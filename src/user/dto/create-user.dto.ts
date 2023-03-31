import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsEmail, IsOptional, Min, IsEnum } from "class-validator"
import { ApiFile } from "src/common/decorators/api-file.decorator"
import { ACCOUNT_ROLE } from "src/constants/account.constant"

export class CreateUserDto {
    @ApiProperty({
        example: 'James Doe',
        description: 'Enter The Name',
        name: 'name'
    })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({
        example: 'test@gmail.com',
        description: 'Enter Your E-mail',
        uniqueItems: true,
        name: 'email'
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        example: 'password@123',
        description: 'Enter The Password',
        name: 'password',
        minLength: 6
    })
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({
        enum: ACCOUNT_ROLE,
        description: 'Create User Role',
        required: false
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(ACCOUNT_ROLE)
    role: ACCOUNT_ROLE

    @ApiFile()
    @IsOptional()
    image?: Express.Multer.File
}