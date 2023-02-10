import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type SettingDocument = Setting & mongoose.Document

@Schema()
export class Setting {
    @Prop({ type: String })
    name?: string

    @Prop({ type: String })
    image?: string

    @Prop({ type: Boolean, default: false })
    isActive: boolean
}

export const SettingSchema = SchemaFactory.createForClass(Setting)
