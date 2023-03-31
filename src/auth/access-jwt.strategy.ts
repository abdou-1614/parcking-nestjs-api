import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { accessJwtConfig } from "src/utils/access-Jwt-Config";
import { AccessTokenPayload } from "./types/access-token-payload";
import { AccessTokenContent } from "./types/access-token-content";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/schema/user.schema";

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy, 'access-token') {
    constructor(
        public configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET')
        })
    }


    async validate(payload: AccessTokenPayload): Promise<AccessTokenContent>{
        const user = await this.userModel.findById(payload.sub)
        return {
            id: payload.sub,
            userRole: payload.userRole,
            ...user
        }
    }
}