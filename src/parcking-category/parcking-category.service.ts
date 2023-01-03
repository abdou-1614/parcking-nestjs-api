import { HttpException, ServiceUnavailableException } from '@nestjs/common/exceptions';
import { ParckingCategory, ParckingCategoryDocument } from './schema/parcking-category.schema';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateParckingCategoryDto } from './dto/create-parcking-category.dto';

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
}
