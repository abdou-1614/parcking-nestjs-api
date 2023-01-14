import { Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Slot, SlotSchema } from './schema/slot.schema';
import { Floor, FloorSchema } from 'src/floor/schema/floor.schema';
import { ParckingCategory, ParckingCategorySchema } from 'src/parcking-category/schema/parcking-category.schema';
import { ParckingPlace, ParckingPlaceSchema } from 'src/parcking-place/schema/parcking-place.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Slot.name, schema: SlotSchema }, 
    { name: Floor.name, schema: FloorSchema }, 
    { name: ParckingCategory.name, schema: ParckingCategorySchema }, 
    { name: ParckingPlace.name, schema: ParckingPlaceSchema }
  ])],
  controllers: [SlotController],
  providers: [SlotService]
})
export class SlotModule {}
