import { HttpException, HttpStatus, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slot, SlotDocument } from './schema/slot.schema';
import { Floor, FloorDocument } from 'src/floor/schema/floor.schema';
import { ParckingCategory, ParckingCategoryDocument } from 'src/parcking-category/schema/parcking-category.schema';
import { ParckingPlace, ParckingPlaceDocument } from 'src/parcking-place/schema/parcking-place.schema';
import { CreateSlotDto } from './dto/create-slot.dto';

@Injectable()
export class SlotService {
    constructor( 
        @InjectModel(Slot.name) private readonly slotModel: Model<SlotDocument>,
        @InjectModel(Floor.name) private readonly floorModel: Model<FloorDocument>,
        @InjectModel(ParckingPlace.name) private readonly parckingPlaceModel: Model<ParckingPlaceDocument>,
        @InjectModel(ParckingCategory.name) private readonly parckingCategoryModel: Model<ParckingCategoryDocument>

        ){}

    async createSlot(input: CreateSlotDto){
        const place = await this.parckingPlaceModel.findById(input.place)
        if(!place){
            throw new NotFoundException('Place Not Found')
        }
        const category = await this.parckingCategoryModel.findById(input.category)

        if(!category){
            throw new NotFoundException('Category Not Found')
        }
        const floor = await this.floorModel.findById(input.floor)

        if(!floor){
            throw new NotFoundException('Floor Not Found')
        }
        try{
            const slot = await this.slotModel.create(input)
            return slot
        }catch(e){
            if(e.code === 11000){
                const dublicatedKey = Object.values(e.keyValue)[0]

                throw new HttpException(
                    {
                        statusCode: HttpStatus.CONFLICT,
                        message: `${dublicatedKey} is Already Exist !`,
                        dublicatedKey
                    },
                    HttpStatus.CONFLICT
                )
            }
            console.log(e)
            throw new ServiceUnavailableException()
        }
    }
}
