import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ParckingService } from './parcking.service';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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

  @ApiOkResponse({
    description: 'Parking Found Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Parking Not Found'
  })
  @ApiBadRequestResponse({
    description: 'Not Valid ID'
  })
  @ApiOperation({ summary: 'Find All Parcking' })
  @Get('/:id')
  @ApiParam({ required: true, description: 'Enter Parking ID', name: 'ID' })
  async findById(@Param('id') id: string){
    return this.parckingService.findById(id)
  }
}
