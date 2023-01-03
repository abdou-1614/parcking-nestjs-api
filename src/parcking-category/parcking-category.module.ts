import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ParckingCategoryService } from './parcking-category.service';
import { ParckingCategoryController } from './parcking-category.controller';
import { ParckingCategory, ParckingCategorySchema } from './schema/parcking-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ParckingCategory.name, schema: ParckingCategorySchema }])
  ],
  controllers: [ParckingCategoryController],
  providers: [ParckingCategoryService]
})
export class ParckingCategoryModule {}
