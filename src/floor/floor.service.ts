import { BadRequestException, NotFoundException, HttpException, ServiceUnavailableException } from '@nestjs/common/exceptions';
import { ParckingPlace, ParckingPlaceDocument } from './../parcking-place/schema/parcking-place.schema';
import { CreateFloorDto } from './dto/create-floor.dto';
import { Floor, FloorDocument } from './schema/floor.schema';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FloorService {
    constructor(
        @InjectModel(Floor.name) private floorModel: Model<FloorDocument>,
        @InjectModel(ParckingPlace.name) private parckingPlaceModel: Model<ParckingPlaceDocument>,
    ) {}

    async createFloor(input: CreateFloorDto) {
        const checkPlace = await this.parckingPlaceModel.findById(input.place)

        if(!checkPlace) {
            throw new NotFoundException('Place Not Found')
        }
        try{
            const floor = await this.floorModel.create(input)
            return floor
        }catch(e) {
            if(e.code === 11000){
                const dublicatedKey = Object.values(e.keyValue)[0]

                throw new HttpException(
                    {
                        statusCode: HttpStatus.CONFLICT,
                        message: `${dublicatedKey} Is Already Exist`,
                        dublicatedKey
                    },
                    HttpStatus.CONFLICT
                )
            }

            throw new ServiceUnavailableException()
        }
    }
}
