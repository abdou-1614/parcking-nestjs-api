import { Module } from '@nestjs/common';
import { TariffService } from './tariff.service';
import { TariffController } from './tariff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tariff, TariffSchema } from './schma/tariff.schema';
import { ParckingCategory, ParckingCategorySchema } from 'src/parcking-category/schema/parcking-category.schema';
import { ParckingPlace, ParckingPlaceSchema } from 'src/parcking-place/schema/parcking-place.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
       name: Tariff.name, schema: TariffSchema 
      }, 
       { 
        name: ParckingCategory.name, schema: ParckingCategorySchema 
      },
      {
        name: ParckingPlace.name, schema: ParckingPlaceSchema
      }
    ])
  ],
  controllers: [TariffController],
  providers: [TariffService]
})
export class TariffModule {}
