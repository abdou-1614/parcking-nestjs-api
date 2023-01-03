import { Controller, Post, Body } from '@nestjs/common';
import { ParckingCategoryService } from './parcking-category.service';
import { ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateParckingCategoryDto } from './dto/create-parcking-category.dto';

@ApiTags('PARCKING_CATEGORY')
@Controller('parcking-category')
export class ParckingCategoryController {
  constructor(private readonly parckingCategoryService: ParckingCategoryService) {}

  @ApiCreatedResponse({
    description: 'Parcking Category Created Successfully'
  })
  @ApiConflictResponse({
    description: 'Category Type Is Already Used'
  })
  @ApiOperation({ summary: 'Create Category For Parcking With Places' })
  @Post()
  async create(@Body() input: CreateParckingCategoryDto) {
    return this.parckingCategoryService.createCategory(input)
  }
}
