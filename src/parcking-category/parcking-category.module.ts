import { Module } from '@nestjs/common';
import { ParckingCategoryService } from './parcking-category.service';
import { ParckingCategoryController } from './parcking-category.controller';

@Module({
  controllers: [ParckingCategoryController],
  providers: [ParckingCategoryService]
})
export class ParckingCategoryModule {}
