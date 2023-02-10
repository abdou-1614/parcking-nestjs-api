import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Setting, SettingDocument } from './schema/setting.schema';
import { Model } from 'mongoose';
import { CreateSettingDto } from './dto/create-setting.dto';

@Injectable()
export class SettingService {
    constructor( @InjectModel(Setting.name) private settingModel: Model<SettingDocument> ){}

    async createSetting(input: CreateSettingDto){
        const setting = await this.settingModel.create({
            name: input.name,
            image: input.image.filename
        })
        return setting
    }
}
