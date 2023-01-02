import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ParckingPlace, ParckingPlaceDocument } from './schema/parcking-place.schema';
import { Model } from 'mongoose';
import { CreateParckingPlaceDto } from './dto/create-place.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { ui_query_projection_place } from './parcking-place.projection';

@Injectable()
export class ParckingPlaceService {
    constructor( @InjectModel(ParckingPlace.name) private readonly parckingPlaceModel: Model<ParckingPlaceDocument> ) {}

    async createPlace(input: CreateParckingPlaceDto) {
        const { name, description } = input

        return this.parckingPlaceModel.create({
            name,
            description
        })
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
}
