import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tariff, TariffDocument } from './schma/tariff.schema';
import { Model } from 'mongoose';
import { ParckingPlace, ParckingPlaceDocument } from 'src/parcking-place/schema/parcking-place.schema';
import { ParckingCategory, ParckingCategoryDocument } from 'src/parcking-category/schema/parcking-category.schema';
import { CreateTariffDto } from './dto/create-tariff.dto';

@Injectable()
export class TariffService {
    constructor(
        @InjectModel(Tariff.name) private tariffModel: Model<TariffDocument>,
        @InjectModel(ParckingPlace.name) private parckingPlaceModel: Model<ParckingPlaceDocument>,
        @InjectModel(ParckingCategory.name) private parckingCategoryModel: Model<ParckingCategoryDocument>
    ) {}

    async createTariff(dto: CreateTariffDto){
        const tariff = await this.tariffModel.create(dto)
        return tariff
    }
}
