import { HttpException, HttpStatus, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Parcking, ParckingDocument } from './schema/parcking.schema';
import { Model } from 'mongoose';
import { Slot, SlotDocument } from 'src/slot/schema/slot.schema';
import { ParckingPlace, ParckingPlaceDocument } from 'src/parcking-place/schema/parcking-place.schema';
import { ParckingCategory, ParckingCategoryDocument } from 'src/parcking-category/schema/parcking-category.schema';
import { CreateParckingDto } from './dto/create-parcking.dto';
import { Floor, FloorDocument } from 'src/floor/schema/floor.schema';

@Injectable()
export class ParckingService {
    constructor( 
        @InjectModel(Parcking.name) private parckingModel: Model<ParckingDocument>,
        @InjectModel(Slot.name) private slotgModel: Model<SlotDocument>,
        @InjectModel(ParckingPlace.name) private parckingPlaceModel: Model<ParckingPlaceDocument>,
        @InjectModel(ParckingCategory.name) private ParckingCategoryModel: Model<ParckingCategoryDocument>,
        @InjectModel(Floor.name) private floorModel: Model<FloorDocument>, 
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
}
