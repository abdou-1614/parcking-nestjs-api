import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Slot, SlotDocument } from './schema/slot.schema';
import { Floor, FloorDocument } from 'src/floor/schema/floor.schema';
import { ParckingCategory, ParckingCategoryDocument } from 'src/parcking-category/schema/parcking-category.schema';
import { ParckingPlace, ParckingPlaceDocument } from 'src/parcking-place/schema/parcking-place.schema';
import { CreateSlotDto } from './dto/create-slot.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { ui_projection_query_slot } from './slot.projection';
import { UpdateSlotDto } from './dto/update-slot.dto';

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
            floor.slot.push(slot.id)
            await floor.save();
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

    async queryAll(query: FilterQueryDto){
        const filterQuery = new FilterQueries(
            this.slotModel,
            query,
            ui_projection_query_slot
        )

        filterQuery.filter().limitField().paginate().sort()

        const slot = await filterQuery.query
        .populate('place', 'name')
        .populate('category', 'type')
        .populate('floor', 'name')

        if(!slot) {
            throw new NotFoundException('Slot Not Found !')
        }

        return slot
    }

    async queryById(id: string){
        const isValid = mongoose.isValidObjectId(id)
        if(!isValid) throw new BadRequestException('NOT VALID ID !')

        const slot = await this.slotModel.findById(id).populate('place', 'name')
        .populate('category', 'type')
        .populate('floor', 'name')

        if(!slot) throw new NotFoundException('Slot Not Found')

        return slot
    }

    async updateSlot(id: string, input: UpdateSlotDto){
        const isValid = mongoose.isValidObjectId(id)
        if(!isValid) throw new BadRequestException('NOT VALID ID !')
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
            const slot = await this.slotModel.findByIdAndUpdate(id, input, {
                new: true,
                runValidators: true
            })
            if(!slot) throw new NotFoundException('Slot Not Found')

            return slot
        }catch(e){
            if(e.code === 11000){
                const dublicatedKey = Object.values(e.keyValue)[0]
                throw new HttpException(
                {
                    statusCode: HttpStatus.CONFLICT,
                    message: `${dublicatedKey} is Already Exist`,
                    dublicatedKey

                }, HttpStatus.CONFLICT
                )
            }

            throw new HttpException(
                {
                    statusCode: e.response.statusCode,
                    message: e.response.message,
                    error: e.response.error
                },
                HttpStatus.NOT_FOUND
            )
        }
    }

    async deleteSlot(id: string){
        const isValid = mongoose.isValidObjectId(id)
        if(!isValid) throw new BadRequestException('NOT VALID ID !')
        const slot = await this.slotModel.findByIdAndDelete(id)
        if(!slot) throw new NotFoundException('Slot Not Found !')

        return 'Slot Deleted Successfully !'
    }
}
