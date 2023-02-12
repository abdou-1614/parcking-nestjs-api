import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/schema/user.schema";
import { LoginDto } from "./dto/login.dto";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { compare } from "bcrypt";
import { omit } from "lodash";
import { LoginResponseDto } from "./dto/login-response.dto";

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