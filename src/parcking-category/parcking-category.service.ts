import { HttpException, ServiceUnavailableException } from '@nestjs/common/exceptions';
import { ParckingCategory, ParckingCategoryDocument } from './schema/parcking-category.schema';
import { Injectable, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateParckingCategoryDto } from './dto/create-parcking-category.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { ui_query_projection_category } from './parcking-category.projection';

@Injectable()
export class ParckingCategoryService {
    constructor( @InjectModel(ParckingCategory.name) private readonly parckingCategoryModel: Model<ParckingCategoryDocument> ) {}


    async createCategory(input: CreateParckingCategoryDto) {
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
}
