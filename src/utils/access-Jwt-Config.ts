import { JwtSignOptions } from "@nestjs/jwt";

export const accessJwtConfig: JwtSignOptions = {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d'
}