import { ParckingPlace, ParckingPlaceSchema } from './../parcking-place/schema/parcking-place.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ParckingCategoryService } from './parcking-category.service';
import { ParckingCategoryController } from './parcking-category.controller';
import { ParckingCategory, ParckingCategorySchema } from './schema/parcking-category.schema';
import { Floor, FloorSchema } from 'src/floor/schema/floor.schema';
import { Slot, SlotSchema } from 'src/slot/schema/slot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ 
      name: ParckingCategory.name, schema: ParckingCategorySchema }, 
      { name: ParckingPlace.name, schema: ParckingPlaceSchema },
      { name: Slot.name, schema: SlotSchema },
      { name: Floor.name, schema: FloorSchema },
    ])
  ],
  controllers: [ParckingCategoryController],
  providers: [ParckingCategoryService]
})
export class ParckingCategoryModule {}
