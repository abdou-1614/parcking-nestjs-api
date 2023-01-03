import { ParckingPlace } from './../../parcking-place/schema/parcking-place.schema';
import mongoose from 'mongoose';
import { PARCKING_CATEGORY_STATUS } from './../../constants/parcking-category.constant';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ParckingCategoryDocument = ParckingCategory & mongoose.Document

@Schema({ timestamps: true })
export class ParckingCategory {

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParckingPlace',
        required: true
    })
    place: ParckingPlace

    @Prop({
        type: String,
        unique: true,
        trim: true,
        required: true
    })
    type: string

    @Prop({
        type: String,
        required: false
    })
    description?: string

    @Prop({
        type: String,
        enum: Object.keys(PARCKING_CATEGORY_STATUS),
        default: PARCKING_CATEGORY_STATUS.ENABLE
    })
    status: PARCKING_CATEGORY_STATUS
}

export const ParckingCategorySchema = SchemaFactory.createForClass(ParckingCategory)