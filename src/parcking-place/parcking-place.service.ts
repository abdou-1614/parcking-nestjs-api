import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ParckingPlace, ParckingPlaceDocument } from './schema/parcking-place.schema';
import { Model } from 'mongoose';
import { CreateParckingPlaceDto } from './dto/create-place.dto';

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
}
