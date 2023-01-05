import { Controller, Post, Body } from '@nestjs/common';
import { FloorService } from './floor.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { ApiOperation, ApiCreatedResponse, ApiNotFoundResponse, ApiConflictResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@Controller('floor')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @ApiCreatedResponse({
    description: "Floor Created Successfully"
  })
  @ApiBadRequestResponse({
    description: "The Entered Place Is Invalid"
  })
  @ApiNotFoundResponse({
    description: "The Entered Place Not Found"
  })
  @ApiConflictResponse({
    description: "The Name OF Floor Is Already Used"
  })
  @ApiOperation({ summary: 'Create Floor With Parcking Place' })
  @Post()
  async create(@Body() input: CreateFloorDto) {
    return this.floorService.createFloor(input)
  }
}
