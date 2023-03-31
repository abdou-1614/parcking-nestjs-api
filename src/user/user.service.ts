import { ACCOUNT_STATUS } from './../constants/account.constant';
import { Injectable, ServiceUnavailableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { FilterQueries } from 'src/utils/filterQueries.util';
import { ui_query_projection_fields } from './users.projection';
import { UserInterface } from './interface/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { unlinkSync } from 'fs';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
    constructor( @InjectModel(User.name) private readonly userModel: Model<UserDocument> ) {}

    async createUser(input: CreateUserDto) {
        const { name, email, password, image, role } = input

        await this.isEmailTake(email)
        try{

        const user = await this.userModel.create({
            name,
            email,
            password,
            role,
            image: image ? image.filename : image
        })
        return user
        }catch(e) {
            if(e.name === 'ValidationError') {
                throw new BadRequestException(e.errors)
            }
            console.log(e)
            throw new ServiceUnavailableException(e)
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
        const { name, email, password, image, status, role } = updateDto
        const validId = mongoose.isValidObjectId(id)
        if(!validId) throw new BadRequestException('NOT VALID ID')

        const user = await this.userModel.findById(id)

        if(!user) {
            throw new NotFoundException('User Not Found')
        }

        return this.userModel.findByIdAndUpdate(id, {
            name,
            email,
            password,
            image: image ? image.filename : image,
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
