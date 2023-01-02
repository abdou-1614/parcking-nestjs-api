import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ParckingPlaceService } from './parcking-place.service';
import { CreateParckingPlaceDto } from './dto/create-place.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';

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
  @ApiOperation({ summary: 'Create Parcking Place' })
  @Post()
  async create(@Body() input: CreateParckingPlaceDto) {
    return this.parckingPlaceService.createPlace(input)
  }

  @ApiCreatedResponse({
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
}
