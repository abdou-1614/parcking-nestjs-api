import { Module } from '@nestjs/common';
import { ParckingService } from './parcking.service';
import { ParckingController } from './parcking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Parcking, ParckingSchema } from './schema/parcking.schema';
import { Slot, SlotSchema } from 'src/slot/schema/slot.schema';
import { ParckingPlace, ParckingPlaceSchema } from 'src/parcking-place/schema/parcking-place.schema';
import { ParckingCategory, ParckingCategorySchema } from 'src/parcking-category/schema/parcking-category.schema';
import { Floor, FloorSchema } from 'src/floor/schema/floor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Parcking.name, schema: ParckingSchema },
      { name: Slot.name, schema: SlotSchema },
      { name: ParckingPlace.name, schema: ParckingPlaceSchema },
      { name: ParckingCategory.name, schema: ParckingCategorySchema },
      { name: Floor.name, schema: FloorSchema }
    ])
  ],
  controllers: [ParckingController],
  providers: [ParckingService]
})
export class ParckingModule {}
