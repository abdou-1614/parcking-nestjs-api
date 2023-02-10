import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { ApiFile } from "src/common/decorators/api-file.decorator"

export class CreateSettingDto {
    @ApiProperty({
        name: 'name',
        required: false,
        description: 'Enter The Name Of The Website',
        example: 'Parking DZ'
    })
    @IsString()
    @IsOptional()
    name?: string

    @ApiFile()
    @IsOptional()
    image?: Express.Multer.File
}