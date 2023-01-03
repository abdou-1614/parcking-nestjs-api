import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ParckingPlaceService } from './parcking-place.service';
import { CreateParckingPlaceDto } from './dto/create-place.dto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { UpdateParckingPlaceDto } from './dto/update-place.dto';

@ApiTags('PARCKING PLACE')
@Controller('parcking-place')
export class ParckingPlaceController {
  constructor(private readonly parckingPlaceService: ParckingPlaceService) {}


  @ApiCreatedResponse({
    description: 'Parcking Place Created Successfully'
  })
  @ApiInternalServerErrorResponse({
    description: 'Can"t create a parcking place ( likely caused by insufficient write permission )'
  })
  @ApiBadRequestResponse({
    description: 'Name Is Required, Please Enter A Name '
  })
  @ApiConflictResponse({
    description: 'Place Name Already Exist'
  })
  @ApiOperation({ summary: 'Create Parcking Place' })
  @Post()
  async create(@Body() input: CreateParckingPlaceDto) {
    return this.parckingPlaceService.createPlace(input)
  }

  @ApiOkResponse({
    description: 'Parcking Places Found Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Parcking Places Not Found'
  })
  @ApiOperation({ summary: 'Find All Parcking Places' })
  @Get()
  async findAll(@Query() query: FilterQueryDto) {
    return this.parckingPlaceService.queryAllPlaces(query)
  }

  @ApiOkResponse({
    description: 'Parcking Place Found Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Parcking Place Not Found With This ID'
  })
  @ApiOperation({ summary: 'Find Parcking Place By ID' })
  @Get('/:id')
  async findById(@Param('id') id: string) {
    return this.parckingPlaceService.queryId(id)
  }

  @ApiOkResponse({
    description: 'Parcking Place Updated Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Parcking Place Not Found With This ID'
  })
  @ApiOperation({ summary: 'Update Parcking Place By It"s ID' })
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() input: UpdateParckingPlaceDto) {
    return this.parckingPlaceService.updatePlace(id, input)
  }

  @ApiOkResponse({
    description: 'Parcking Place Deleted Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Parcking Place Not Found With This ID'
  })
  @ApiOperation({ summary: 'Update Parcking Place By It"s ID' })
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.parckingPlaceService.deletePlace(id)
  }
}
