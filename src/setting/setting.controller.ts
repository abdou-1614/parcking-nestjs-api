import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { SettingService } from './setting.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadBodyInterceptor } from 'src/common/interceptors/fileUpload.interceptor';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSettingDto } from './dto/create-setting.dto';

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
}
