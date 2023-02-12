import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsEmail, IsOptional, Min } from "class-validator"
import { ApiFile } from "src/common/decorators/api-file.decorator"

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

    @ApiFile()
    @IsOptional()
    image?: Express.Multer.File
}