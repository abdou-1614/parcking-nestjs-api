import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tariff, TariffDocument } from './schma/tariff.schema';
import mongoose, { Model } from 'mongoose';
import { ParckingPlace, ParckingPlaceDocument } from 'src/parcking-place/schema/parcking-place.schema';
import { ParckingCategory, ParckingCategoryDocument } from 'src/parcking-category/schema/parcking-category.schema';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { ui_projection_query_tariff } from './tariff.projection';
import { UpdateTariffDto } from './dto/update-tariff.dto';

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

    async queryByID(id: string){
        const isValidID = mongoose.isValidObjectId(id)
        if(!isValidID) throw new BadRequestException('NOT VALID ID')

        const tariff = await this.tariffModel.findById(id)
        if(!tariff) throw new NotFoundException('Tariff Not Found')

        return tariff
    }

    async updateTariff(id: string, input: UpdateTariffDto) {
        const isValidID = mongoose.isValidObjectId(id)
        if(!isValidID) throw new BadRequestException('NOT VALID ID')

        const place = await this.parckingPlaceModel.findById(input.place)
        if(!place) throw new NotFoundException('Place Not Found')

        const category = await this.parckingCategoryModel.findById(input.type)
        if(!category) throw new NotFoundException('Type Not Found')

        const tariff = await this.tariffModel.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true
        })

        if(!tariff) throw new NotFoundException('Tariff Not Found')

        return tariff
    }

}
