import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Floor } from "src/floor/schema/floor.schema";
import { ParckingCategory } from "src/parcking-category/schema/parcking-category.schema";
import { ParckingPlace } from "src/parcking-place/schema/parcking-place.schema";
import { Parcking } from "src/parcking/schema/parcking.schema";
import { Slot } from "src/slot/schema/slot.schema";

export type ReportDocument = Reports & mongoose.Document
@Schema()
export class Reports {
    @Prop({
        type: String
    })
    from_Date: string

    @Prop({
        type: String
    })
    to_Date: string

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parking'
    })
    parking: Parcking

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot'
    })
    slot: Slot

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParckingPlace'
    })
    place: ParckingPlace

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Floor'
    })
    floor: Floor

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParckingCategory'
    })
    type: ParckingCategory
}

export const ReportsSchema = SchemaFactory.createForClass(Reports)