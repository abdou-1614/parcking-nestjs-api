import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { SettingService } from './setting.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadBodyInterceptor } from 'src/common/interceptors/fileUpload.interceptor';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSettingDto } from './dto/create-setting.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';

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
  async findById(@Param('id') id: string){
    return this.settingService.findById(id)
  }
}
