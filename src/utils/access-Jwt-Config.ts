import { JwtSignOptions } from "@nestjs/jwt";

export const accessJwtConfig: JwtSignOptions = {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d'
}

export const refreshTokenConfig: JwtSignOptions = {
    secret: process.env.REFRESH_JWT_SECRET,
    expiresIn: '90d',
}