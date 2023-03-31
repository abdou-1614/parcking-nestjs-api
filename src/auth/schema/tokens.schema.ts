import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from 'src/user/schema/user.schema';

export type RefreshTokenDocument = RefreshToken & Document 

@Schema({ timestamps: true })
export class RefreshToken {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    })
    userId: User

    @Prop({ type: String, required: true, unique: true })
    family: string

    @Prop({ type: String })
    refreshToken: string

    @Prop({ type: String })
    ip?: string

    @Prop({ type: String })
    browserInfo?: string

    @Prop({ type: Date })
    expiresAt: Date
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)