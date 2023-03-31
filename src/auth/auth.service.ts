import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
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
import {v4 as uuidv4} from 'uuid'
import { RefreshToken, RefreshTokenDocument } from "./schema/tokens.schema";
import { getTokenExpirationDate } from "src/utils/tokensExpirationDate";
import { RefreshTokenPayload } from "./types/refresh-token-payload";
import { ACCOUNT_ROLE } from "src/constants/account.constant";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class AuthService {
    constructor( 
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
        private jwtService: JwtService,
        private configService: ConfigService
        ){}

    async login(input: LoginDto, browserInfo?: string): Promise<LoginResponseDto>{
        const { email, password } = input
        const user = await this.validateUser(email, password)

        const payload = { sub: user._id, userRole: user.role }

        const accessToken = await this.generateAccessToken(payload)

        const refreshToken = await this.createRefreshToken(
            payload,
            browserInfo
            )

        return {
            accessToken,
            refreshToken
        }
    }
    async findMe(id: string){
        const user = await this.userModel.findById(id)
        return user
    }
    async refreshToken(refreshToken: string, browserInfo?: string): Promise<LoginResponseDto> {
        const refreshConfig: JwtSignOptions = {
            secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES')
        }
        const refreshTokenContent: RefreshTokenPayload = await this.jwtService.verifyAsync(refreshToken, refreshConfig)

        await this.validateRefreshToken(refreshToken, refreshTokenContent)

        const userRole = await this.getUserRole(refreshTokenContent.sub)

        const accessToken = await this.generateAccessToken({
            sub: refreshTokenContent.sub,
            userRole
        })

        const newRefreshToken = await this.rotateRefreshToken(
            refreshToken,
            refreshTokenContent,
            browserInfo
        )

        return {
            accessToken,
            refreshToken: newRefreshToken
        }

    }
    async logout(refreshToken: string) {
        return this.refreshTokenModel.findOneAndDelete({ refreshToken })
    }

    async logoutAll(userId: string) {
        return this.refreshTokenModel.deleteMany({userId})
    }

    async findAllTokens(userId: string) {
        const tokens = await this.refreshTokenModel.find({ userId })
        return tokens
    }

    async changePassword(id: string, input: UpdatePasswordDto, browserInfo?: string): Promise<LoginResponseDto>{
        const { old_password, new_password } = input
        const isValidId = mongoose.isValidObjectId(id)
        if(!isValidId) throw new BadRequestException('INVALID ID')

        const user = await this.userModel.findOne({ _id: id }).select('password')
        if(!user) throw new NotFoundException('User Not Found')

        const isCorrectPassword = await compare(old_password, user.password)
        if(!isCorrectPassword) throw new BadRequestException('the entered password is invalid')

        const payload = { sub: user._id, userRole: user.role }

        const accessToken = await this.generateAccessToken(payload)
        const refreshToken = await this.createRefreshToken(payload, browserInfo)

        user.password = new_password
        await user.save()

        return {
            accessToken,
            refreshToken
        }
    }

    async updateProfile(id: string, input: UpdateProfileDto, browserInfo?: string): Promise<LoginResponseDto>{
        const {
          name,
          email,
          password,
          image,
          currentPassword
        } = input
        const isValidId = mongoose.isValidObjectId(id)
        if(!isValidId) throw new BadRequestException('INVALID ID')
      
        const user = await this.userModel.findById(id).select('password')
        if(!user) throw new NotFoundException('User Not Found')
      
        const isCorrectPassword = await compare(currentPassword, user.password)
        if(!isCorrectPassword) throw new BadRequestException('the entered password is invalid')

        user.name = name
        user.email = email
        if(password){
            user.password = password
        }
        if(image){
            user.image = image.filename
        }
        await user.save()
        const payload = { sub: user._id, userRole: user.role }
      
        const accessToken = await this.generateAccessToken(payload)
        const refreshToken = await this.createRefreshToken(payload, browserInfo)
        return {
          accessToken,
          refreshToken
        }
      }

    private async validateUser(email: string, password: string){
        const user = await this.userModel.findOne({email})
        if(!user) throw new BadRequestException('Invalid Email Or Password')

        if(user.role !== ACCOUNT_ROLE.ADMIN){
            throw new UnauthorizedException()
        }

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
    private async createRefreshToken(payload: { sub: string, userRole: string, family?: string }, browserInfo?: string) {
        if(!payload.family) {
            payload.family = uuidv4()
        }

        const refreshConfig: JwtSignOptions = {
            secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES')
        }

        const refreshToken = await this.jwtService.signAsync(payload, refreshConfig)

        await this.saveRefreshToken({
            userId: payload.sub,
            refreshToken,
            family: payload.family,
            browserInfo
        })

        return refreshToken
    }
    private async saveRefreshToken(refreshTokenInfos: {
        userId: string,
        refreshToken: string
        family: string,
        browserInfo?: string
    }) {
        const expiresAt = getTokenExpirationDate()
        return this.refreshTokenModel.create({
            ...refreshTokenInfos,
            expiresAt
        })
    }
    private async validateRefreshToken(refreshToken: string, refreshTokenContent: RefreshTokenPayload): Promise<boolean> {
        const userTokens = await this.refreshTokenModel.findOne({ userId: refreshTokenContent.sub, refreshToken })

        const isValidRefreshToken = userTokens.refreshToken.length > 0

        if(!isValidRefreshToken) {
            await this.removeRefreshTokenFamilyIfCompromised(
                refreshTokenContent.tokenFamily
            )

            throw new BadRequestException('Invalid Refresh Token')
        }

        return true
    }

    private async removeRefreshTokenFamilyIfCompromised(tokenFamily: string) {
        const familyTokens = await this.refreshTokenModel.findOne({family: tokenFamily})
        const { family } = familyTokens

        if(family.length > 0) {
            return this.refreshTokenModel.deleteMany({ family })
        }
    }
    private async rotateRefreshToken(refreshToken: string, refreshTokenContent: RefreshTokenPayload, browserInfo?: string) {
        await this.refreshTokenModel.deleteMany({refreshToken})

        const newRefreshToken = await this.createRefreshToken({
           sub: refreshTokenContent.sub,
           userRole: refreshTokenContent.userRole,
           family: refreshTokenContent.tokenFamily
        },
        browserInfo
        )

        return newRefreshToken
    }
    private async getUserRole(userId: string) {
        const user = await this.userModel.findById({ _id: userId})
        return user.role
    }
    private getPath(qrCode: string){
        return `${process.cwd()}/tmp/${qrCode}`
    }
}