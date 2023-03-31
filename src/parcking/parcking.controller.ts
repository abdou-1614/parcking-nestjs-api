import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ParckingService } from './parcking.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateParckingDto } from './dto/create-parcking.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { UpdateParckingDto } from './dto/update-parking.dto';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { Public } from 'src/auth/public.decorator';
import { EndParkingDto } from './dto/ended-parking.dto';

@IsAdmin()
@ApiBearerAuth()
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
  @Post('create')
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
  @Get('all')
  async findAll(@Query() query: FilterQueryDto){
    return this.parckingService.findAll(query)
  }
  @ApiOperation({ summary: 'Get PArking Statics' })
  @Get('/parking-stats')
  async findAllStats(){
    return this.parckingService.parkingStats()
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
    description: 'Current Parking Found Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Parking Not Found'
  })
  @ApiOperation({ summary: 'Find All Current Parcking' })
  @Get('/current/current')
  async findCurrent(){
    return this.parckingService.findCurrentParking()
  }

  @ApiOperation({ summary: 'Find Parking By Vehicle Number' })
  @Get(':vehicle_number')
  async findByVehicleNumber(@Param('vehicle_Number') vehicle_Number: string){
    return this.parckingService.findParkingByVehicleNumber(vehicle_Number)
  }
  @ApiOkResponse({
    description: 'Scan Qr Code Parking Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Parking Not Found'
  })
  @ApiOperation({ summary: 'Scan Qr Code and Get All Data' })
  @Post('/scan-qrCode/:vehicle_Number')
  async scanQrCode(@Param('vehicle_Number') vehicle_Number: string){
    return this.parckingService.scanQrCodeAndEndParking(vehicle_Number)
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
  @Get('/get-single-parking/:id')
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
  @ApiParam({ required: true, description: 'Enter Parking ID', name: 'ID' })
  @Patch('ended/:id')
  async payAndEndParking(@Param('id') id: string, @Body() input: EndParkingDto){
    return this.parckingService.payAndEndParking(id, input)
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
  @Patch('/update/:id')
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
  @Delete('/delete/:id')
  @ApiParam({ required: true, description: 'Enter Parking ID', name: 'ID' })
  async delete(@Param('id') id: string){
    return this.parckingService.deleteParking(id)
  }
}
