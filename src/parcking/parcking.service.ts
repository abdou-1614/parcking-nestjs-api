import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Parcking, ParckingDocument } from './schema/parcking.schema';
import mongoose, { Model } from 'mongoose';
import { Slot, SlotDocument } from 'src/slot/schema/slot.schema';
import { ParckingPlace, ParckingPlaceDocument } from 'src/parcking-place/schema/parcking-place.schema';
import { ParckingCategory, ParckingCategoryDocument } from 'src/parcking-category/schema/parcking-category.schema';
import { CreateParckingDto } from './dto/create-parcking.dto';
import { Floor, FloorDocument } from 'src/floor/schema/floor.schema';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { ui_projection_query_parking } from './parking.projection';
import { Tariff, TariffDocument } from 'src/tariff/schma/tariff.schema';
import { UpdateParckingDto } from './dto/update-parking.dto';
import { unlinkSync } from 'fs';
import * as dayjs from 'dayjs'
import { SLOT_STATUS } from 'src/constants/slot.constant'

@Injectable()
export class ParckingService {
    constructor( 
        @InjectModel(Parcking.name) private parckingModel: Model<ParckingDocument>,
        @InjectModel(Slot.name) private slotgModel: Model<SlotDocument>,
        @InjectModel(ParckingPlace.name) private parckingPlaceModel: Model<ParckingPlaceDocument>,
        @InjectModel(ParckingCategory.name) private ParckingCategoryModel: Model<ParckingCategoryDocument>,
        @InjectModel(Floor.name) private floorModel: Model<FloorDocument>, 
        @InjectModel(Tariff.name) private tariffModel: Model<TariffDocument>, 
        ){}

        async createParcking(input: CreateParckingDto){
            const place = await this.parckingPlaceModel.findById(input.place)
            if(!place) throw new NotFoundException('Place Not Found')

            const type = await this.ParckingCategoryModel.findById(input.type)
            if(!type) throw new NotFoundException('Type Not Found')

            const slot = await this.slotgModel.findById(input.slot)
            if(!slot) throw new NotFoundException('Slot Not Found')
            if(slot.status === SLOT_STATUS.INACTIVE){
                throw new BadRequestException('SLOT Already Booked')
            }
            
            try{
                const parking = await this.parckingModel.create({
                    ...input,
                    in_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
                })
                const carType = parking.type
                const tariff = await this.tariffModel.aggregate([
                    {
                        $match: {
                            type: carType
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            hour: 1
                        }
                    }
                ])
                parking.amount = tariff[0].hour
                await this.slotgModel.findOneAndUpdate({_id: parking.slot}, { $set: { status: SLOT_STATUS.INACTIVE } }, { new: true })
                await parking.generateQrcode(this.slotgModel, this.ParckingCategoryModel, this.floorModel)
                await parking.save()
                return parking
            }catch(e){
                if(e.code === 11000){
                    const dublicatedKey = Object.values(e.keyValue)[0]
                    throw new HttpException({
                        statusCode: HttpStatus.CONFLICT,
                        message: `${dublicatedKey} Already Exist`,
                        dublicatedKey
                    }, HttpStatus.CONFLICT)
                }

                throw new ServiceUnavailableException(e)
            }
        }

        async findAll(query: FilterQueryDto){
            const filterQuery = new FilterQueries(
                this.parckingModel,
                query,
                ui_projection_query_parking
            )

            filterQuery.filter().limitField().paginate().sort()

            const parking = filterQuery.query
            .populate({
                path: 'slot',
                select: 'name',
                populate: {path: 'floor', select: 'name'}
            })
            .populate({
                path: 'type',
                select: 'type'
            })

            if(!parking) throw new NotFoundException('Parking Not Found !')

            return parking
        }

        async findById(id: string){
            const validId = mongoose.isValidObjectId(id)
            if(!validId) throw new BadRequestException('Not Valid ID')

            const parking = await this.parckingModel.findById(id).populate({
                path: 'slot',
                select: 'name',
                populate: {path: 'floor', select: 'name'}
            })
            .populate({
                path: 'type',
                select: 'type'
            })
            if(!parking) {
                throw new NotFoundException('Parking Not Found')
            }

            return parking
        }

        async findEndedParking(){

            const parking = await this.parckingModel.find({out_time: { $exists: true }}).select('qrCode vehicle_Number in_time out_time payable_amount')

            if(parking.length === 0) throw new NotFoundException('Ended Parking Not Found')

            return parking
        }

        async findCurrentParking(){
            const parking = await this.parckingModel.find({out_time: null}).populate({
                path: 'slot',
                select: 'name',
            })
            .populate({
                path: 'type',
                select: 'type'
            }).select('_id qrCode vehicle_Number in_time')
            if(parking.length === 0) throw new NotFoundException('Parking Not Found')
            return parking
        }

        async update(id: string, input: UpdateParckingDto){
            const validId = mongoose.isValidObjectId(id)
            if(!validId) throw new BadRequestException('Not Valid ID')

            const place = await this.parckingPlaceModel.findById(input.place)
            if(!place) throw new NotFoundException('Place Not Found')

            const type = await this.ParckingCategoryModel.findById(input.type)
            if(!type) throw new NotFoundException('Type Not Found')

            const slot = await this.slotgModel.findById(input.slot)
            if(!slot) throw new NotFoundException('Slot Not Found')

            try{
                const foundParking = await this.parckingModel.findById(id)
                if(!foundParking) throw new NotFoundException('Parking Not Found')
                const parking = await this.parckingModel.findByIdAndUpdate(id, input, {
                    new: true,
                    runValidators: true
                })
                const filePath = this.getPath(foundParking.qrCode)
                unlinkSync(filePath)
                const carType = parking.type
                const tariff = await this.tariffModel.aggregate([
                    {
                        $match: {
                            type: carType
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            hour: 1
                        }
                    }
                ])
                parking.amount = tariff[0].hour
                await parking.generateQrcode(this.slotgModel, this.ParckingCategoryModel, this.floorModel)
                await parking.save()
                return parking
            }catch(e){
                if(e.code === 11000){
                    const dublicatedKey = Object.values(e.keyValue)[0]
                    throw new HttpException({
                        statusCode: HttpStatus.CONFLICT,
                        message: `${dublicatedKey} Already Exist`,
                        dublicatedKey
                    }, HttpStatus.CONFLICT)
                }

                throw new ServiceUnavailableException(e)
            }
        }

        async deleteParking(id: string){
            const validId = mongoose.isValidObjectId(id)
            if(!validId) throw new BadRequestException('Not Valid ID')

            const parking = await this.parckingModel.findByIdAndDelete(id)
            if(!parking) throw new NotFoundException('Parking Not Found')

            await this.slotgModel.findOneAndUpdate({ _id: parking.slot }, { $set: { status: SLOT_STATUS.ACTIVE } }, { new: true } )

            const filePath = this.getPath(parking.qrCode)
            unlinkSync(filePath)

            return 'Parking Deleted Successfully'
        }

        async scanQrCodeAndEndParking(qrCode: string){
            const parking = await this.parckingModel.findOne({qrCode})
            if(!parking) throw new NotFoundException('Parking Not Found')

            parking.out_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
            parking.duration = await parking.calculateDuration(parking.out_time)
            parking.payable_amount = await parking.calculateAmount(parking.out_time)

            await this.slotgModel.findOneAndUpdate({ _id: parking.slot }, { $set: { status: SLOT_STATUS.ACTIVE } }, { new: true } ) 

            await parking.save()

            return parking
        }

        async parkingStats(){
            const amountStats = await this.parckingModel.aggregate([
               {
                $group: {
                    _id: null,
                    'Total Amount': { $sum: '$payable_amount' },
                    'Total Parking': { $sum: 1 },
                }
               }
              ]);
              const endedParkingStats = await this.parckingModel.aggregate([
                {
                    $match: {
                        out_time: { $exists: true}
                    }
                },
                {
                    $group: {
                        _id: null,
                        'Total Ended Parking': { $sum: 1 }
                    }
                }
              ])
              const currentParkingStats = await this.parckingModel.aggregate([
                {
                    $match: {
                        out_time: { $exists: false}
                    }
                },
                {
                    $group: {
                        _id: null,
                        'Total Current Parking': { $sum: 1 },
                    }
                },
              ])

              const totalSlot = await this.slotgModel.aggregate([
                {
                    $group: {
                        _id: null,
                        'Total Slots': { $sum: 1 },
                        'Total Available Status': {
                            $sum: {
                                $cond: [
                                    { $eq: ['$status', SLOT_STATUS.ACTIVE] }, 1, 0
                                ]
                            }
                        },
                        'Total Booked Slot': {
                            $sum: {
                                $cond: [
                                    { $eq: [ '$status', SLOT_STATUS.INACTIVE ] }, 1, 0
                                ]
                            }
                        }
                    }
                }
              ])

              const today = dayjs().startOf('day')
              const thisMonth = dayjs().startOf('month')
              const thisYear = dayjs().startOf('year')

              const dailyAmount = await this.parckingModel.aggregate([
                {
                    $match: {
                        in_time: {
                            $gte: today.format('YYYY-MM-DD HH:mm:ss'),
                            $lt: dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        'Total Daily Amount': { $sum: '$payable_amount' }
                    }
                }
              ])

              const monthlyAmount = await this.parckingModel.aggregate([
                {
                    $match: {
                        in_time: {
                            $gte: thisMonth.format('YYYY-MM-DD HH:mm:ss'),
                            $lt: dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')
                        }
                    }  
                },
                {
                    $group: {
                        _id: null,
                        'Total Monthly Amount': { $sum: '$payable_amount' }
                    }
                }
              ])
              const yearlyAmount = await this.parckingModel.aggregate([
                {
                    $match: {
                        in_time: {
                            $gte: thisYear.format('YYYY-MM-DD HH:mm:ss'),
                            $lt: dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss')
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        'Total Yearly Amount': { $sum: '$payable_amount' }
                    }
                }
              ])
              console.log({monthlyAmount, dailyAmount, yearlyAmount})
              
              return [...amountStats, ...endedParkingStats, ...currentParkingStats, ...totalSlot, ...dailyAmount, ...monthlyAmount, ...yearlyAmount]
        }

        private getPath(qrCode: string){
            return `${process.cwd()}/tmp/${qrCode}`
        }
}
