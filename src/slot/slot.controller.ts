import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SlotService } from './slot.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@ApiTags('SLOT')
@Controller('slot')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @ApiCreatedResponse({
    description: 'Slot Created Successfully !'
  })
  @ApiNotFoundResponse({
    description: 'The Entered Place Not Found'
  })
  @ApiNotFoundResponse({
    description: 'The Entered Category Not Found'
  })
  @ApiNotFoundResponse({
    description: 'The Entered Floor Not Found'
  })
  @ApiConflictResponse({
    description: 'The Name OF Slot Is Already Use'
  })
  @ApiOperation({ summary: 'Create Slot' })
  @Post()
  async create(@Body() input: CreateSlotDto){
    return this.slotService.createSlot(input)
  }

  @ApiOkResponse({
    description: 'Slots Founds Successfully !'
  })
  @ApiNotFoundResponse({
    description: 'Slot Not Found'
  })
  @ApiOperation({ summary: 'find All Slots' })
  @Get()
  async findAll(@Query() query: FilterQueryDto){
    return this.slotService.queryAll(query)
  }

  @ApiOkResponse({
    description: 'Slot Founds Successfully !'
  })
  @ApiNotFoundResponse({
    description: 'Slot Not Found'
  })
  @ApiOperation({ summary: 'find Slot By ID' })
  @ApiParam({ name: 'id', description: 'Enter Slot ID', required: true })
  @Get('/:id')
  async findById(@Param('id') id: string){
    return this.slotService.queryById(id)
  }

  @ApiOkResponse({
    description: 'Slot Updated Successfully !'
  })
  @ApiNotFoundResponse({
    description: 'Slot Not Found'
  })
  @ApiConflictResponse({
    description: 'The Name OF Slot Is Already Use'
  })
  @ApiOperation({ summary: 'find Slot And Update By ID' })
  @ApiParam({ name: 'id', description: 'Enter Slot ID', required: true })
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() input: UpdateSlotDto){
    return this.slotService.updateSlot(id, input)
  }

  @ApiOkResponse({
    description: 'Slot Deleted Successfully !'
  })
  @ApiNotFoundResponse({
    description: 'Slot Not Found'
  })
  @ApiOperation({ summary: 'find Slot And Delete By ID' })
  @ApiParam({ name: 'id', description: 'Enter Slot ID', required: true })
  @Delete('/:id')
  async delete(@Param('id') id: string){
    return this.slotService.deleteSlot(id)
  }
}
