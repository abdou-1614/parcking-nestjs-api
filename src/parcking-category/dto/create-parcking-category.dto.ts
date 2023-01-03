import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"
import { ParckingPlace } from "src/parcking-place/schema/parcking-place.schema"

export class CreateParckingCategoryDto {
    @ApiProperty({
        name: 'type',
        description: 'Enter The Type Of Category',
        required: true,
        uniqueItems: true,
        example: 'Car'
    })
    @IsString()
    @IsNotEmpty()
    type: string

    @ApiProperty({
        name: 'description',
        description: 'Enter The Description Of Category',
        required: false,
        example: 'Description Of This Car 1'
    })
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty({
        name: 'place',
        description: 'Enter Place',
        required: true,
        example: '63b33e04e948de2d244f2230'
    })
    @IsNotEmpty()
    place: ParckingPlace
}