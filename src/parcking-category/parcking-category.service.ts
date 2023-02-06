import { ParckingPlace, ParckingPlaceDocument } from './../parcking-place/schema/parcking-place.schema';
import { BadRequestException, HttpException, ServiceUnavailableException } from '@nestjs/common/exceptions';
import { ParckingCategory, ParckingCategoryDocument } from './schema/parcking-category.schema';
import { Injectable, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateParckingCategoryDto } from './dto/create-parcking-category.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { ui_query_projection_category } from './parcking-category.projection';
import { UpdateParckingCategoryDto } from './dto/update-parcking-category.dto';
import { Floor, FloorDocument } from 'src/floor/schema/floor.schema';
import { Slot, SlotDocument } from 'src/slot/schema/slot.schema';

@Injectable()
export class ParckingCategoryService {
    constructor( 
        @InjectModel(ParckingCategory.name) private readonly parckingCategoryModel: Model<ParckingCategoryDocument>,
        @InjectModel(ParckingPlace.name) private readonly parckingPlaceModel: Model<ParckingPlaceDocument>,
        @InjectModel(Slot.name) private readonly slotModel: Model<SlotDocument>,
        @InjectModel(Floor.name) private readonly floorModel: Model<FloorDocument>,
    ) {}


    async createCategory(input: CreateParckingCategoryDto) {
        const place = await this.parckingPlaceModel.findById(input.place)
        if(!place) throw new NotFoundException('Place Not Found')
        try{
            const category = await this.parckingCategoryModel.create(input)
            return category
        }catch(e) {
            if(e.code === 11000){
                const dublicatedKey = Object.values(e.keyValue)[0]
                throw new HttpException(
                    {
                        statusCode: HttpStatus.CONFLICT,
                        message: `${dublicatedKey} Already Used!`,
                        dublicatedKey
                    },
                    HttpStatus.CONFLICT
                )
            }
            throw new ServiceUnavailableException()
        }
    }

    async queryAllCategories(filterDto: FilterQueryDto) {
        const filterQuery = new FilterQueries(
            this.parckingCategoryModel,
            filterDto,
            ui_query_projection_category
        )

        filterQuery.filter().limitField().paginate().sort()

        const category = await filterQuery.query.populate('place', 'name')
        if(!category) {
            throw new NotFoundException('Categories Not Found !')
        }

        return category
    }

    async queryById(id: string) {
        const isValidID = mongoose.isValidObjectId(id)
        if(!isValidID) throw new BadRequestException('NOT VALID ID')

        const category = await this.parckingCategoryModel.findById(id).populate('place', 'name')

        if(!category) {
            throw new NotFoundException('Category Not Found')
        }

        return category
    }

    async update(id: string, input: UpdateParckingCategoryDto) {
        const { type, place } = input

        if(type) await this.checkTypeExist(type)

        const checkPlaceExist = await this.parckingPlaceModel.findById(place)
        if(!checkPlaceExist) throw new BadRequestException('the entered place is invalid')

        const updateCategory = await this.parckingCategoryModel.findByIdAndUpdate(id, input, {
            new: true
        })

        if(!updateCategory) {
            throw new NotFoundException('Category Not Found !')
        }

        return updateCategory
    }

    async deleteCategory(id: string): Promise<string> {
        const isValidID = mongoose.isValidObjectId(id)
        if(!isValidID) throw new BadRequestException('NOT VALID ID')
        const category = await this.parckingCategoryModel.findByIdAndDelete(id)

        if(!category){
            throw new NotFoundException('Category Not Found')
        }

        return "Parcking Category Deleted Successfully"
    }

    private async checkTypeExist(type: string) {
        const categoryType = await this.parckingCategoryModel.findOne({ type })
        if(categoryType) throw new BadRequestException(' This Type Already Exists ')
    }
}
