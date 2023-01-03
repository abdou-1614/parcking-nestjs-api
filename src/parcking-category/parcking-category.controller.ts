import { FilterQueryDto } from './../common/dto/filterquery.dto';
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ParckingCategoryService } from './parcking-category.service';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @ApiOkResponse({
    description: 'Parcking Category Found Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Categories Not Found'
  })
  @ApiOperation({ summary: 'Find All Categories With Name Of Parcking Place' })
  @Get()
  async findAll(@Query() query: FilterQueryDto) {
    return this.parckingCategoryService.queryAllCategories(query)
  }
}
