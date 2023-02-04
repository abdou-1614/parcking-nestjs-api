import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Parcking, ParckingSchema } from 'src/parcking/schema/parcking.schema';
import { Slot, SlotSchema } from 'src/slot/schema/slot.schema';
import { ParckingPlace, ParckingPlaceSchema } from 'src/parcking-place/schema/parcking-place.schema';
import { ParckingCategory, ParckingCategorySchema } from 'src/parcking-category/schema/parcking-category.schema';
import { Floor, FloorSchema } from 'src/floor/schema/floor.schema';
import { Reports, ReportsSchema } from './schema/reports.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Parcking.name, schema: ParckingSchema },
      { name: Slot.name, schema: SlotSchema },
      { name: ParckingPlace.name, schema: ParckingPlaceSchema },
      { name: ParckingCategory.name, schema: ParckingCategorySchema },
      { name: Floor.name, schema: FloorSchema },
      { name: Reports.name, schema: ReportsSchema },
    ])
  ],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
