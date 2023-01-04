import { FilterQueryDto } from './../common/dto/filterquery.dto';
import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { ParckingCategoryService } from './parcking-category.service';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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

  @ApiBadRequestResponse({
    description: 'NOT VALID ID'
  })
  @ApiOkResponse({
    description: 'Parcking Category Found Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Categories Not Found'
  })
  @ApiOperation({ summary: 'Find Category By It"s ID' })
  @ApiParam({ name: 'id', required: true, description: "Enter ID Of Category" })
  @Get('/:id')
  async findById(@Param('id') id: string) {
    return this.parckingCategoryService.queryById(id)
  }
}
