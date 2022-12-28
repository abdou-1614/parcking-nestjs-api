import mongoose from 'mongoose';
import { ACCOUNT_STATUS, ACCOUNT_ROLE } from './../../constants/account.constant';
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { genSalt, hashSync } from 'bcrypt'

export type UserDocument = User & mongoose.Document

@Schema({
    timestamps: true
})
export class User {

    @Prop({ type: String, required: true })
    name: string

    @Prop({ type: String, required: true, trim: true, lowercase: true })
    email: string

    @Prop({ type: String, required: true, select: false })
    password: string

    @Prop({ type: String })
    image?: string

    @Prop({
        type: String,
        enum: Object.keys(ACCOUNT_STATUS),
        default: ACCOUNT_STATUS.ACTIVE
    })
    status: ACCOUNT_STATUS

    @Prop({
        type: String,
        enum: Object.keys(ACCOUNT_ROLE),
        default: ACCOUNT_ROLE.ADMIN
    })
    role: ACCOUNT_ROLE
}

export const UserSchema = SchemaFactory.createForClass(User)


UserSchema.pre('save', async function(next: Function) {
    const user = this as UserDocument
    if(!user.isModified('password')) {
        return
    }

    const salt = await genSalt(10)
    const hashed = await hashSync(user.password, salt)
    user.password = hashed

    next()
})