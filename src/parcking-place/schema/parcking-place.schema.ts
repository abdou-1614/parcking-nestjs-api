import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { PARCKING_PLACE_STATUS } from "src/constants/parcking-place-constant";
import { Floor } from "src/floor/schema/floor.schema";

export type ParckingPlaceDocument = ParckingPlace & mongoose.Document

@Schema({ timestamps: true })
export class ParckingPlace {

    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true
    })
    name: string

    @Prop({
        type: String,
        required: false,
    })
    description?: string

    @Prop({
        type: String,
        enum: Object.keys(PARCKING_PLACE_STATUS),
        default: PARCKING_PLACE_STATUS.ACTIVE
    })
    status: PARCKING_PLACE_STATUS

    @Prop([{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Floor'
    }])
    floor?: Floor[]
}

export const ParckingPlaceSchema = SchemaFactory.createForClass(ParckingPlace)