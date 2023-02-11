import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenJwtStrategy } from "./access-jwt.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({})
    ],
    providers: [AuthService, AccessTokenJwtStrategy],
    controllers: [AuthController]
})
export class AuthModule{}