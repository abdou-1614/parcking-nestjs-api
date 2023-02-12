import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { SettingService } from './setting.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadBodyInterceptor } from 'src/common/interceptors/fileUpload.interceptor';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateSettingDto } from './dto/create-setting.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';

@IsAdmin()
@ApiBearerAuth()
@ApiTags('WEBSITE-INFORMATION')
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @ApiBody({
    type: CreateSettingDto
  })
  @ApiCreatedResponse({
    description: 'Setting Created Successfully'
  })
  @ApiOperation({ description: 'Create Logo and Name Of Website' })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('image'), FileUploadBodyInterceptor)
  async create(@Body() input: CreateSettingDto){
    return this.settingService.createSetting(input)
  }

  @ApiNotFoundResponse({
    description: 'No Info Found'
  })
  @ApiOkResponse({
    description: 'Setting Found Successfully'
  })
  @ApiOperation({ description: 'Find All Logos and Names Of Website' })
  @Get()
  async find(@Query() query: FilterQueryDto){
    return this.settingService.findAll(query)
  }

  @ApiNotFoundResponse({
    description: 'No Info Found'
  })
  @ApiOkResponse({
    description: 'Setting Found Successfully'
  })
  @ApiOperation({ description: 'Find Logo and Name Of Website By IT"s ID' })
  @Get(':id')
  @ApiParam({ required: true, name: 'ID', description: 'Enter Setting ID' })
  async findById(@Param('id') id: string){
    return this.settingService.findById(id)
  }

  @ApiNotFoundResponse({
    description: 'No Info Found'
  })
  @ApiOkResponse({
    description: 'Setting Updated Successfully'
  })
  @ApiOperation({ description: 'Find Logo and Name by ID and Update' })
  @ApiBody({
    type: UpdateSettingDto
  })
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'), FileUploadBodyInterceptor)
  @ApiParam({ required: true, name: 'ID', description: 'Enter Setting ID' })
  async update(@Param('id') id: string, @Body() input: UpdateSettingDto){
    return this.settingService.updateSetting(id, input)
  }
  @ApiNotFoundResponse({
    description: 'No Info Found'
  })
  @ApiOkResponse({
    description: 'Setting Deleted Successfully'
  })
  @ApiOperation({ description: 'Find Logo and Name by ID and Delete' })
  @Delete(':id')
  @ApiParam({ required: true, name: 'ID', description: 'Enter Setting ID' })
  async delete(@Param('id') id: string){
    return this.settingService.deleteSetting(id)
  }
}
