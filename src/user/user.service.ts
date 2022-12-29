import { ACCOUNT_STATUS } from './../constants/account.constant';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class UserService {
    constructor( @InjectModel('User') private readonly userModel: Model<UserDocument> ) {}

    async createUser(input: CreateUserDto) {
        try{
        const { name, email, password, image } = input

        await this.isEmailTake(email)

        const user = await this.userModel.create({
            name,
            email,
            password,
            image: image.filename
        })
        return user
        }catch(e) {
            if(e.name === 'ValidationError') {
                throw new BadRequestException(e.errors)
            }

            throw new ServiceUnavailableException()
        }
    }


    private async isEmailTake(email: string) {
        const user = await this.userModel.findOne({email, status: ACCOUNT_STATUS.ACTIVE})

        if(user) throw new BadRequestException('Email Already Taken')
    }
}
