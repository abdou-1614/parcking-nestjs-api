import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from './schema/setting.schema';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfig } from 'src/utils/multer.util';

@Module({
  imports: [
    MulterModule.register(MulterConfig),
    MongooseModule.forFeature([
      { name: Setting.name, schema: SettingSchema }
    ])
  ],
  controllers: [SettingController],
  providers: [SettingService]
})
export class SettingModule {}
