import { ACCOUNT_STATUS } from './../constants/account.constant';
import { Injectable, ServiceUnavailableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { ui_query_projection_fields } from './users.projection';
import { UserInterface } from './interface/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { unlinkSync } from 'fs';
import { ChangePasswordDto } from './dto/change-password.dto';
import { compare } from 'bcrypt';

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

    async queryAllUsers(filterQueryDto: FilterQueryDto) {
        const filterQuery = new FilterQueries(
            this.userModel,
            filterQueryDto,
            ui_query_projection_fields
        )
        
        await filterQuery.filter().limitField().paginate().sort()

        const user = await filterQuery.query

        if(user.length === 0) {
            throw new NotFoundException('Users Not Found')
        }

        return user
    }

    async queryUser(id: string) {
        const ValidID = mongoose.isValidObjectId(id)
        if(!ValidID) throw new BadRequestException('NOT VALID ID')
        const user = await this.userModel.findById(id)

        if(!user) {
            throw new NotFoundException('User Not Found')
        }

        return user
    }

    async updateUserDetails(id: string, updateDto: UpdateUserDto) {
        const { name, email, image, status, role } = updateDto
        const validId = mongoose.isValidObjectId(id)
        if(!validId) throw new BadRequestException('NOT VALID ID')

        const user = await this.userModel.findById(id)

        if(!user) {
            throw new NotFoundException('User Not Found')
        }

        return this.userModel.findByIdAndUpdate(id, {
            name,
            email,
            image: image.filename,
            status,
            role
        },
        {
            new: true,
        }
        )
    }

    async deleteUser(id: string) {
        const validId = mongoose.isValidObjectId(id)
        if(!validId) throw new BadRequestException('NOT VALID ID')

        const user = await this.userModel.findByIdAndDelete(id)

        if(!user) throw new NotFoundException('User Not Found')

        return 'Successful User Delete'
    }


    private async isEmailTake(email: string) {
        const user = await this.userModel.findOne({email, status: ACCOUNT_STATUS.ACTIVE})

        if(user) throw new BadRequestException('Email Already Taken')
    }
}
