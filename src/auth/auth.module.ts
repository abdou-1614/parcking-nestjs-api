import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenJwtStrategy } from "./access-jwt.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/schema/user.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: User.name, schema: UserSchema
        }]),
        PassportModule,
        JwtModule.register({})
    ],
    providers: [AuthService, AccessTokenJwtStrategy],
    controllers: [AuthController]
})
export class AuthModule{}