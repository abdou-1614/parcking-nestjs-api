import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tariff, TariffDocument } from './schma/tariff.schema';
import { Model } from 'mongoose';
import { ParckingPlace, ParckingPlaceDocument } from 'src/parcking-place/schema/parcking-place.schema';
import { ParckingCategory, ParckingCategoryDocument } from 'src/parcking-category/schema/parcking-category.schema';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { ui_projection_query_tariff } from './tariff.projection';

@Injectable()
export class TariffService {
    constructor(
        @InjectModel(Tariff.name) private tariffModel: Model<TariffDocument>,
        @InjectModel(ParckingPlace.name) private parckingPlaceModel: Model<ParckingPlaceDocument>,
        @InjectModel(ParckingCategory.name) private parckingCategoryModel: Model<ParckingCategoryDocument>
    ) {}

    async createTariff(input: CreateTariffDto){
        const place = await this.parckingPlaceModel.findById(input.place)
        if(!place) throw new NotFoundException('The Entered Place Not Found')
        const type = await this.parckingCategoryModel.findById(input.type)
        if(!type) throw new NotFoundException('The Entered Type Not Found')
        const tariff = await this.tariffModel.create(input)
        return tariff
    }

    async queryAll(query: FilterQueryDto){
        const filterQuery = new FilterQueries(
            this.tariffModel,
            query,
            ui_projection_query_tariff
        )

        filterQuery.filter().limitField().paginate().sort()

        const tariff = await filterQuery.query.populate('place', 'name').populate('type', 'type')

        if(!tariff) throw new NotFoundException('Tariff Not Found !')

        return tariff
    }

}
