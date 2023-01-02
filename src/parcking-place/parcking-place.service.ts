import { BadRequestException, HttpException, ServiceUnavailableException } from '@nestjs/common/exceptions';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ParckingPlace, ParckingPlaceDocument } from './schema/parcking-place.schema';
import mongoose, { Model } from 'mongoose';
import { CreateParckingPlaceDto } from './dto/create-place.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { ui_query_projection_place } from './parcking-place.projection';
import { UpdateParckingPlaceDto } from './dto/update-place.dto';

@Injectable()
export class ParckingPlaceService {
    constructor( @InjectModel(ParckingPlace.name) private readonly parckingPlaceModel: Model<ParckingPlaceDocument> ) {}

    async createPlace(input: CreateParckingPlaceDto) {
        try{
        const { name, description } = input

        return await this.parckingPlaceModel.create({
            name,
            description
        })
        }catch(error){
            if(error.code === 11000) {
                const duplicateKey = Object.values(error.keyValue)[0] 
                throw new HttpException(
                    {
                    statusCode: HttpStatus.CONFLICT,
                    message: duplicateKey + " Already Used",
                    duplicateKey
                }, 
                HttpStatus.CONFLICT
                )
            }
            throw new ServiceUnavailableException()
        }
    }

    async queryAllPlaces(filterDto: FilterQueryDto) {
        const filterQuery = new FilterQueries(
            this.parckingPlaceModel,
            filterDto,
            ui_query_projection_place
        )

        filterQuery.filter().limitField().paginate().sort()

        const place = filterQuery.query

        if(!place) {
            throw new NotFoundException('Parcking Places Not Found')
        }

        return place
    }

    async queryId(id: string) {
        const isValidID = mongoose.isValidObjectId(id)
        if(!isValidID) throw new BadRequestException('NOT VALID ID')

        const place = await this.parckingPlaceModel.findById(id)

        if(!place) {
            throw new NotFoundException('Place Not Found')
        }

        return place
    }

    async updatePlace(id: string, input: UpdateParckingPlaceDto) {
        const isValidID = mongoose.isValidObjectId(id)
        if(!isValidID) throw new BadRequestException('NOT VALID ID') 

        const place = await this.parckingPlaceModel.findByIdAndUpdate(id, input, {
            new: true
        })

        if(!place) {
            throw new NotFoundException('Place Not Found')
        }
        return place
    }
}
