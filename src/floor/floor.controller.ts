import { UpdateFloorDto } from './dto/update-floor.dto';
import { FilterQueryDto } from './../common/dto/filterquery.dto';
import { Controller, Post, Body, Get, Query, Param, Patch, Delete } from '@nestjs/common';
import { FloorService } from './floor.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { ApiOperation, ApiCreatedResponse, ApiNotFoundResponse, ApiConflictResponse, ApiBadRequestResponse, ApiOkResponse, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { Public } from 'src/auth/public.decorator';

@IsAdmin()
@ApiBearerAuth()
@ApiTags('FLOOR')
@Controller('floor')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @ApiCreatedResponse({
    description: "Floor Created Successfully"
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
  @ApiOkResponse({
    description: 'Floors Found Successfully'
  })
  @ApiNotFoundResponse({
    description: "Floor Not Found!"
  })
  @ApiOperation({ summary: 'Find All Floors With Parcking Place Name' })
  @Get()
  async findAll(@Query() query: FilterQueryDto) {
    return this.floorService.queryAllFloor(query)
  }

  @ApiOkResponse({
    description: 'Floor Found Successfully'
  })
  @ApiNotFoundResponse({
    description: "Floor Not Found With This ID"
  })
  @ApiOperation({ summary: 'Find Floor With ID' })
  @Get('/:id')
  @ApiParam({ name: 'id', required: true, description: 'Enter The ID Of Floor' })
  async findById(@Param('id') id: string) {
    return this.floorService.queryById(id)
  }

  @ApiOkResponse({
    description: 'Floor Updated Successfully'
  })
  @ApiNotFoundResponse({
    description: "Floor Not Found With This ID"
  })
  @ApiConflictResponse({
    description: "Name Of Floor Already Exist"
  })
  @ApiParam({ name: 'id', required: true, description: 'Enter The ID Of Floor' })
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() input: UpdateFloorDto) {
    return this.floorService.updateFloor(id, input)
  }

  @ApiOkResponse({
    description: 'Floor Deleted Successfully'
  })
  @ApiNotFoundResponse({
    description: "Floor Not Found With This ID"
  })
  @ApiParam({ name: 'id', required: true, description: 'Enter The ID Of Floor' })
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.floorService.deleteFloor(id)
  }
}
