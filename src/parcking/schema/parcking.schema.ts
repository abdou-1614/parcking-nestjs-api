import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import dayjs from 'dayjs'
import mongoose, { Model } from "mongoose";
import { join } from "path";
import { Floor, FloorDocument } from "src/floor/schema/floor.schema";
import { ParckingCategory, ParckingCategoryDocument } from "src/parcking-category/schema/parcking-category.schema";
import { ParckingPlace } from "src/parcking-place/schema/parcking-place.schema";
import { Slot, SlotDocument } from "src/slot/schema/slot.schema";
import { TariffDocument, Tariff, TariffSchema } from 'src/tariff/schma/tariff.schema'
const qr = require('qr-image')
import { writeFileSync } from "fs"

export type ParckingDocument = Parcking & mongoose.Document 

@Schema({ 
    timestamps: true,
    methods: {
        async calculateAmount(this: ParckingDocument, out_time: string){
            const start = Number(dayjs(this.in_time));
            const end = Number(dayjs(out_time));
          
            const duration = end - start;
          
            const hours = Math.floor(duration / (1000 * 60 * 60));
            const minutes = Math.floor((duration / (1000 * 60)) % 60);
          
            const price = this.amount;
          
            const totalPerHour = price * hours;
            const feesPerMinutes = price / 60;

            const additionalCostForMinutes = minutes * feesPerMinutes;
          
            const total = totalPerHour + additionalCostForMinutes;
          
            return total;
        },
        async calculateDuration(this: ParckingDocument, out_time: string){
            const start = Number(dayjs(this.in_time));
            const end = Number(dayjs(out_time));
          
            const duration = end - start;
          
            const hours = Math.floor(duration / (1000 * 60 * 60));
            const minutes = Math.floor((duration / (1000 * 60)) % 60);

            if (hours === 0) {
                this.duration = `${minutes} min`;
            } else {
                this.duration = `${hours} hour, ${minutes} min`;
            }

            await this.save()
            return this.duration
        },

        async generateQrcode(this: ParckingDocument, slot: slotModel, type: categoryModel, floor?: floorModel){
            const category = await type.findById(this.type)
            const slotName = await slot.findById(this.slot)
            const floorName = await floor.findById(slotName.floor)
            const data = {
                id: this.id,
                vehicle_Number: this.vehicle_Number,
                in_time: this.in_time,
                driver_Name: this.driver_Name,
                driver_Mobile: this.driver_Mobile,
                type: category.type,
                slot: slotName.name,
                floor: floorName.name
            }

            const qr_image = qr.imageSync(JSON.stringify(data), { type: 'png' })

            const fileName = `${this.vehicle_Number}-${this.driver_Name}-qrcode.png`

            const qrPath = `${process.cwd()}/tmp/`

            const file = join(qrPath, fileName)

            writeFileSync(file, qr_image)

            this.qrCode = fileName

            return this
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
        type: Number,
        default: 0,
    })
    payable_amount: number

    @Prop({
        required: false,
        type: Number,
        default: 0,
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
        type: String
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
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParckingCategory'
    })
    type: ParckingCategory


    @Prop({
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slot"
    })
    slot: Slot

    @Prop({
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "ParckingPlace"
    })
    place: ParckingPlace

    @Prop({
        type: String,
        required: false,
        trim: true
    })
    qrCode: string


    @Prop({
        required: false,
        type: Number,
        default: 0
    })
    paid_amount: number

    generateQrcode: (slot: slotModel, type: categoryModel, floor?: floorModel) => Promise<Parcking>
    calculateDuration: (out_time: string) => Promise<any>
    calculateAmount: (out_time: string) => Promise<number>
}

export const ParckingSchema = SchemaFactory.createForClass(Parcking)

export interface TariffModel extends Model<TariffDocument | Tariff> {}
export interface slotModel extends Model<SlotDocument | Slot> {}
export interface categoryModel extends Model<ParckingCategoryDocument | ParckingCategory> {}
export interface floorModel extends Model<Floor | FloorDocument> {}