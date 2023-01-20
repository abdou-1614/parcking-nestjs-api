import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { TARIFF_STATUS } from "src/constants/tariff.constant";
import { ParckingPlace } from "src/parcking-place/schema/parcking-place.schema";
import { ParckingCategory } from 'src/parcking-category/schema/parcking-category.schema'

export type TariffDocument = Tariff & mongoose.Document

@Schema({ timestamps: true })
export class Tariff {

    @Prop({ required: true, type: String })
    name: string

    @Prop({ 
        type: String, 
        required: false,
        default: new Date().toLocaleString('en-GB', { hour12: false })
     })
    start_date?: Date

    @Prop({ 
        type: String 
    })
    end_date?: Date

    @Prop({ type: Number })
    min_amount: number

    @Prop({ type: Number })
    hour: number

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParckingPlace'
    })
    place: ParckingPlace


    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParckingCategory'
    })
    type: ParckingCategory

    @Prop({
        type: String,
        enum: Object.keys(TARIFF_STATUS),
        default: TARIFF_STATUS.ENABLE
    })
    status?: TARIFF_STATUS
}

export const TariffSchema = SchemaFactory.createForClass(Tariff)