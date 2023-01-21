import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import dayjs from "dayjs";
import mongoose from "mongoose";
import { ParckingCategory } from "src/parcking-category/schema/parcking-category.schema";
import { ParckingPlace } from "src/parcking-place/schema/parcking-place.schema";
import { Slot } from "src/slot/schema/slot.schema";

@Schema({ timestamps: true })
export class Parcking {
    @Prop({
        required: true,
        type: Number,
        unique: true
    })
    vehicle_Number: number

    @Prop({
        required: true,
        type: String
    })
    driver_Name: string

    @Prop({
        required: true,
        type: String
    })
    driver_Mobile: string

    @Prop({
        required: false,
        type: String
    })
    in_time: string

    @Prop({
        required: true,
        type: String
    })
    out_time: string

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
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slot"
    })
    slot: Slot
}

export const ParckingSchema = SchemaFactory.createForClass(Parcking)

ParckingSchema.pre('save', async function(next: Function){
    this.in_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    next()
})