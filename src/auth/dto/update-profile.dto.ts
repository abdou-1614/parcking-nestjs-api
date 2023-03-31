import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { UpdateUserDto } from "src/user/dto/update-user.dto";

export class UpdateProfileDto extends OmitType(UpdateUserDto, ['role', 'status'] as const){

    @ApiProperty({
        required: true,
        name: 'Current Password',
        description: 'Enter The Current Password',
        example: 'Password@123'
    })
    @IsString()
    @IsNotEmpty()
    currentPassword: string
}