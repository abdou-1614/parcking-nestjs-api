import { ParckingPlace } from './../../parcking-place/schema/parcking-place.schema';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { FLOOR_STATUS } from "src/constants/floor.constants";

export type FloorDocument = Floor & mongoose.Document

@Schema({ timestamps: true })
export class Floor {
    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true
    })
    name: string

    @Prop({
        type: Number,
        default: 0,
        required: true
    })
    level: number

    @Prop({
        type: String,
        required: false
    })
    remarks?: string

    @Prop({
        type: String,
        enum: Object.keys(FLOOR_STATUS),
        default: FLOOR_STATUS.ACTIVE
    })
    status: FLOOR_STATUS

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParckingPlace',
        required: true
    })
    place: ParckingPlace
}

export const FloorSchema = SchemaFactory.createForClass(Floor)