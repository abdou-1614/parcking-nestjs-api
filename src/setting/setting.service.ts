import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Setting, SettingDocument } from './schema/setting.schema';
import mongoose, { Model } from 'mongoose';
import { CreateSettingDto } from './dto/create-setting.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { unlinkSync } from 'fs';

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
    async findById(id: string){
        const isValidID = mongoose.isValidObjectId(id)
        if(!isValidID) throw new BadRequestException('NOT VALID ID')

        const setting = await this.settingModel.findById(id)
        if(!setting) throw new NotFoundException('No Info Found')

        return setting
    }

    async updateSetting(id: string, input: UpdateSettingDto){
        const isValidID = mongoose.isValidObjectId(id)
        if(!isValidID) throw new BadRequestException('NOT VALID ID')

        const foundSetting = await this.settingModel.findById(id)

        const path = this.getPath(foundSetting.image)

        if(path){
            unlinkSync(path)
        }
        
        const setting = await this.settingModel.findByIdAndUpdate(id, {
            name: input.name,
            image: input.image.filename
        }, { new: true })

        if(!setting){
            throw new NotFoundException('No Info Found')
        }

        return setting
    }
    private getPath(image: string){
        return `${process.cwd()}/tmp/${image}`
    }
}
