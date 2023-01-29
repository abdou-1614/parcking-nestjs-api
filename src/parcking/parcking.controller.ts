import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ParckingService } from './parcking.service';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateParckingDto } from './dto/create-parcking.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { UpdateParckingDto } from './dto/update-parking.dto';

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
    description: 'Ended Parking Found Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Parking Not Found'
  })
  @ApiOperation({ summary: 'Find All Ended Parcking' })
  @Get('ended')
  async findEnded(){
    return this.parckingService.findEndedParking()
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
  @ApiOperation({ summary: 'Find Parcking By It"s ID' })
  @Get('/:id')
  @ApiParam({ required: true, description: 'Enter Parking ID', name: 'ID' })
  async findById(@Param('id') id: string){
    return this.parckingService.findById(id)
  }

  @ApiOkResponse({
    description: 'Parking Updated Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Parking Not Found'
  })
  @ApiBadRequestResponse({
    description: 'Not Valid ID'
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
  @ApiOperation({ summary: 'Find Parcking By Id And Update' })
  @Patch('/:id')
  @ApiParam({ required: true, description: 'Enter Parking ID', name: 'ID' })
  async updateParking(@Param('id') id: string, @Body() input: UpdateParckingDto){
    return this.parckingService.update(id, input)
  }

  @ApiOkResponse({
    description: 'Parking Deleted Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Parking Not Found'
  })
  @ApiOperation({ summary: 'Find Parcking By Id And Delete' })
  @Delete('/:id')
  @ApiParam({ required: true, description: 'Enter Parking ID', name: 'ID' })
  async delete(@Param('id') id: string){
    return this.parckingService.deleteParking(id)
  }
}
