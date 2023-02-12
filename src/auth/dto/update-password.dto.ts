import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class UpdatePasswordDto {

    @ApiProperty({
        name: 'old_password',
        description: 'the old password',
        example: 'oldPassword',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    old_password: string

    @ApiProperty({
        name: 'new_password',
        description: 'the new password',
        example: 'newPassword',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    new_password: string
}