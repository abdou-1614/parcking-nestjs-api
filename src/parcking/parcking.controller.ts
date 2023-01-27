import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ParckingService } from './parcking.service';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateParckingDto } from './dto/create-parcking.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';

@ApiTags('PARCKING')
@Controller('parcking')
export class ParckingController {
  constructor(private readonly parckingService: ParckingService) {}

  @ApiCreatedResponse({
    description: 'Parking Created Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Slot Not Found'
  })
  @ApiNotFoundResponse({
    description: 'Place Not Found'
  })
  @ApiNotFoundResponse({
    description: 'Type Not Found'
  })
  @ApiConflictResponse({
    description: ' Vehicle Number Aleardy Exsit'
  })
  @ApiOperation({ summary: 'Create Parcking' })
  @Post()
  async create(@Body() input: CreateParckingDto){
    return this.parckingService.createParcking(input)
  }

  @ApiOkResponse({
    description: 'Parking Found Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Parking Not Found'
  })
  @ApiOperation({ summary: 'Find All Parcking' })
  @Get()
  async findAll(@Query() query: FilterQueryDto){
    return this.parckingService.findAll(query)
  }
}
