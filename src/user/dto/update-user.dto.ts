import { ACCOUNT_STATUS, ACCOUNT_ROLE } from './../../constants/account.constant';
import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsOptional, IsString } from "class-validator"
import { ApiFile } from "src/common/decorators/api-file.decorator"

export class UpdateUserDto {
    @ApiProperty({
        name: 'name',
        description: 'Enter Your Name',
        required: false
    })
    @IsString()
    @IsOptional()
    name?: string

    @ApiProperty({
        name: 'email',
        description: 'Enter Your Email',
        required: false
    })
    @IsString()
    @IsOptional()
    @IsEmail()
    email?: string

    @ApiFile()
    @IsOptional()
    image?: Express.Multer.File

    @ApiProperty({
        enum: ACCOUNT_STATUS,
        description: 'Update User Status',
        required: false
    })
    @IsOptional()
    status?: ACCOUNT_STATUS

    @ApiProperty({
        enum: ACCOUNT_ROLE,
        description: 'Update User Role',
        required: false
    })
    @IsOptional()
    role?: ACCOUNT_ROLE
}