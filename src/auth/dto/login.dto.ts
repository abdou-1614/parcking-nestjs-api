import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class LoginDto {

    @ApiProperty({
        name: 'email',
        description: 'Enter The Email',
        example: 'user@example.com',
        required: true
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        name: 'password',
        description: 'Enter The Password',
        example: 'password123',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    password: string
}