import { ParckingPlace } from './../../parcking-place/schema/parcking-place.schema';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SLOT_STATUS } from "src/constants/slot.constant";
import { Floor } from 'src/floor/schema/floor.schema';
import mongoose from 'mongoose';
import { ParckingCategory } from 'src/parcking-category/schema/parcking-category.schema';

export type SlotDocument = Slot & mongoose.Document

@Schema({ timestamps: true })
export class Slot {
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
    remarks?: string

    @Prop({
        type: String,
        required: false,
    })
    identity?: string

    @Prop({
        type: String,
        enum: Object.keys(SLOT_STATUS),
        default: SLOT_STATUS.ACTIVE
    })
    status: SLOT_STATUS

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParckingCategory'
    })
    category: ParckingCategory
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParckingPlace'
    })
    place: ParckingPlace

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Floor'
    })
    floor: Floor
}

export const SlotSchema = SchemaFactory.createForClass(Slot)