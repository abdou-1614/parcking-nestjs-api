import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as dayjs from 'dayjs'
import mongoose, { Model } from "mongoose";
import { ParckingCategory } from "src/parcking-category/schema/parcking-category.schema";
import { ParckingPlace } from "src/parcking-place/schema/parcking-place.schema";
import { Slot } from "src/slot/schema/slot.schema";
import { TariffDocument, Tariff } from 'src/tariff/schma/tariff.schema'

export type ParckingDocument = Parcking & mongoose.Document 

@Schema({ 
    timestamps: true,
    methods: {
        async calculateAmount(this: ParckingDocument, out_time: string, model: TariffModel){
            const start = Number(dayjs(this.in_time));
            const end = Number(dayjs(out_time));
          
            const duration = end - start;
          
            const hours = Math.floor(duration / (1000 * 60 * 60));
            const minutes = Math.floor((duration / (1000 * 60)) % 60);
          
            const tariff = await model.findById(this.amount);
            const price = tariff.hour;
          
            const totalPerHour = price * hours;
            const feesPerMinutes = Math.ceil(minutes / 2) / totalPerHour;
          
            const total = Math.ceil(totalPerHour + feesPerMinutes);
          
            return total;
        },
        async calculateDuration(this: ParckingDocument, out_time: string){
            const start = Number(dayjs(this.in_time));
            const end = Number(dayjs(out_time));
          
            const duration = end - start;
          
            const hours = Math.floor(duration / (1000 * 60 * 60));
            const minutes = Math.floor((duration / (1000 * 60)) % 60);

            this.duration = `${hours} hour, ${minutes} minutes`

            return await this.save()
        }
    }
})
export class Parcking {
    @Prop({
        required: true,
        type: Number,
        unique: true
    })
    vehicle_Number: number

    @Prop({
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tariff',
        default: 0
    })
    amount: number

    @Prop({
        required: false,
        type: String
    })
    duration: string 

    @Prop({
        required: true,
        type: String
    })
    driver_Name: string

    @Prop({
        required: true,
        type: Date
    })
    driver_Mobile: string

    @Prop({
        required: false,
        type: String
    })
    in_time: string

    @Prop({
        required: false,
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

export interface TariffModel extends Model<TariffDocument | Tariff> {}

ParckingSchema.pre('save', async function(next: Function){
    this.in_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    next()
})