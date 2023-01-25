import { Body, Controller, Post } from '@nestjs/common';
import { ParckingService } from './parcking.service';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateParckingDto } from './dto/create-parcking.dto';

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
}
