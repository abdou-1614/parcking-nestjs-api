import { Controller } from '@nestjs/common';
import { ParckingCategoryService } from './parcking-category.service';

@Controller('parcking-category')
export class ParckingCategoryController {
  constructor(private readonly parckingCategoryService: ParckingCategoryService) {}
}
