import { Body, Controller, Post } from '@nestjs/common';
import { SlotService } from './slot.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';

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
}
