import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ParckingPlaceService } from './parcking-place.service';
import { ParckingPlaceController } from './parcking-place.controller';
import { ParckingPlace, ParckingPlaceSchema } from './schema/parcking-place.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ParckingPlace.name, schema: ParckingPlaceSchema }])
  ],
  controllers: [ParckingPlaceController],
  providers: [ParckingPlaceService]
})
export class ParckingPlaceModule {}
