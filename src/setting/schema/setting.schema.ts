import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type SettingDocument = Setting & mongoose.Document

@Schema()
export class Setting {
    @Prop({ type: String })
    name?: string
    @Prop({ type: String })
    image?: string
}

export const SettingSchema = SchemaFactory.createForClass(Setting)
