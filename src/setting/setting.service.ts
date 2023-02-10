import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Setting, SettingDocument } from './schema/setting.schema';
import { Model } from 'mongoose';
import { CreateSettingDto } from './dto/create-setting.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';

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

    async findAll(inputQuery: FilterQueryDto){
        const filterQuery = new FilterQueries(
            this.settingModel,
            inputQuery
        )
        await filterQuery.filter().limitField().paginate().sort()

        const setting = await filterQuery.query

        if(setting.length === 0){
            throw new NotFoundException('No Info Found')
        }
        return setting
    }
}
