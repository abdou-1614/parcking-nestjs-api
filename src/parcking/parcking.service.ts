import { HttpException, HttpStatus, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Parcking, ParckingDocument } from './schema/parcking.schema';
import { Model } from 'mongoose';
import { Slot, SlotDocument } from 'src/slot/schema/slot.schema';
import { ParckingPlace, ParckingPlaceDocument } from 'src/parcking-place/schema/parcking-place.schema';
import { ParckingCategory, ParckingCategoryDocument } from 'src/parcking-category/schema/parcking-category.schema';
import { CreateParckingDto } from './dto/create-parcking.dto';
import { Floor, FloorDocument } from 'src/floor/schema/floor.schema';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { ui_projection_query_parking } from './parking.projection';
import { Tariff, TariffDocument } from 'src/tariff/schma/tariff.schema';

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
            
            try{
                const parking = await this.parckingModel.create(input)
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

                console.log(e)

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
                path: 'amount',
                select: 'hour'
            })
            .populate({
                path: 'type',
                select: 'type'
            })

            if(!parking) throw new NotFoundException('Parking Not Found !')

            return parking
        }
}
