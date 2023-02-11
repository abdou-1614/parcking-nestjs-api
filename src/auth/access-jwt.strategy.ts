import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { accessJwtConfig } from "src/utils/access-Jwt-Config";
import { AccessTokenPayload } from "./types/access-token-payload";
import { AccessTokenContent } from "./types/access-token-content";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy, 'access-token') {
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'SECRET@JWT@1416'
        })
    }


    async validate(payload: AccessTokenPayload): Promise<AccessTokenContent>{
        return {
            id: payload.sub,
            userRole: payload.userRole
        }
    }
}