import { ParckingPlace } from './../../parcking-place/schema/parcking-place.schema';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { FLOOR_STATUS } from "src/constants/floor.constants";
import { ParckingCategory } from 'src/parcking-category/schema/parcking-category.schema';
import { Slot } from 'src/slot/schema/slot.schema';

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

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Slot' }])
    slot: Slot[]

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParckingPlace',
        required: true
    })
    place: ParckingPlace

    @Prop([{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParckingCategory',
    }])
    type: ParckingCategory[]
}

export const FloorSchema = SchemaFactory.createForClass(Floor)