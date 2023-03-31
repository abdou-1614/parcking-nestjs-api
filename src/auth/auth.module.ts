import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenJwtStrategy } from "./access-jwt.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/schema/user.schema";
import { RefreshToken, RefreshTokenSchema } from "./schema/tokens.schema";
import { MulterModule } from "@nestjs/platform-express";
import { MulterConfig } from "src/utils/multer.util";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema,},
            {name: RefreshToken.name, schema: RefreshTokenSchema}
    ]),
        PassportModule,
        JwtModule.register({}),
        MulterModule.register(MulterConfig)
    ],
    providers: [AuthService, AccessTokenJwtStrategy],
    controllers: [AuthController]
})
export class AuthModule{}