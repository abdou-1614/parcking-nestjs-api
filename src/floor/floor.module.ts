import { ParckingPlace, ParckingPlaceSchema } from './../parcking-place/schema/parcking-place.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { FloorService } from './floor.service';
import { FloorController } from './floor.controller';
import { Floor, FloorSchema } from './schema/floor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Floor.name, schema: FloorSchema }, { name: ParckingPlace.name, schema: ParckingPlaceSchema }])
  ],
  controllers: [FloorController],
  providers: [FloorService]
})
export class FloorModule {}
