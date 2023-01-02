import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsNotEmpty } from "class-validator"

export class CreateParckingPlaceDto {
    @ApiProperty({
        name: 'name',
        description: 'Enter The Name Of The Parcking Place',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    name: string


    @ApiProperty({
        name: 'description',
        description: 'Enter The Description Of The Parcking Place',
        required: true
    })
    @IsString()
    @IsOptional()
    description?: string
}