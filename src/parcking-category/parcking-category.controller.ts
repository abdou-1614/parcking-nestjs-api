import { FilterQueryDto } from './../common/dto/filterquery.dto';
import { Controller, Post, Body, Get, Query, Param, Patch, Delete } from '@nestjs/common';
import { ParckingCategoryService } from './parcking-category.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateParckingCategoryDto } from './dto/create-parcking-category.dto';
import { UpdateParckingCategoryDto } from './dto/update-parcking-category.dto';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';

@IsAdmin()
@ApiBearerAuth()
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
    description: 'the entered place is invalid'
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

  @ApiBadRequestResponse({
    description: 'This Type Already Exists'
  })
  @ApiOkResponse({
    description: 'Parcking Category Updated Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Categories Not Found'
  })
  @ApiBadRequestResponse({
    description: 'the entered place is invalid'
  })
  @ApiOperation({ summary: 'Update Category By It"s ID' })
  @ApiParam({ name: 'id', required: true, description: "Enter ID Of Category" })
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() input: UpdateParckingCategoryDto) {
    return this.parckingCategoryService.update(id, input)
  }

  @ApiBadRequestResponse({
    description: 'NOT VALID ID'
  })
  @ApiOkResponse({
    description: 'Parcking Category Deleted Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Categories Not Found'
  })
  @ApiOperation({ summary: 'Delete Category By It"s ID' })
  @ApiParam({ name: 'id', required: true, description: "Enter ID Of Category" })
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<string> {
    return this.parckingCategoryService.deleteCategory(id)
  }
}
