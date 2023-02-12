import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { User, UserDocument } from "src/user/schema/user.schema";
import { LoginDto } from "./dto/login.dto";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { compare } from "bcrypt";
import { omit } from "lodash";
import { LoginResponseDto } from "./dto/login-response.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Injectable()
export class AuthService {
    constructor( 
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private configService: ConfigService
        ){}

    async login(input: LoginDto): Promise<LoginResponseDto>{
        const { email, password } = input
        const user = await this.validateUser(email, password)

        const payload = { sub: user._id, userRole: user.role }

        const accessToken = await this.generateAccessToken(payload)

        return {
            accessToken
        }
    }

    async changePassword(id: string, input: UpdatePasswordDto): Promise<LoginResponseDto>{
        const { old_password, new_password } = input
        const isValidId = mongoose.isValidObjectId(id)
        if(!isValidId) throw new BadRequestException('INVALID ID')

        const user = await this.userModel.findOne({ _id: id }).select('password')
        if(!user) throw new NotFoundException('User Not Found')

        const isCorrectPassword = await compare(old_password, user.password)
        if(!isCorrectPassword) throw new BadRequestException('the entered password is invalid')

        const payload = { sub: user._id, userRole: user.role }

        const accessToken = await this.generateAccessToken(payload)

        user.password = new_password
        await user.save()

        return {
            accessToken
        }
    }

    private async validateUser(email: string, password: string){
        const user = await this.userModel.findOne({email})
        if(!user) throw new BadRequestException('Invalid Email Or Password')

        const isValidPassword = await compare(password, user.password)

        if(!isValidPassword) throw new BadRequestException('Invalid Email Or Password')

        return user
    }


    private async generateAccessToken(payload: { sub: string, userRole: string }): Promise<string>{
        const accessConfig: JwtSignOptions = {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES')
        }

        const accessToken = await this.jwtService.signAsync(payload, accessConfig)
        return accessToken
    }
}