import { ParckingPlace } from './../../parcking-place/schema/parcking-place.schema';
import { PARCKING_CATEGORY_STATUS } from './../../constants/parcking-category.constant';
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateParckingCategoryDto {
    @ApiProperty({
        name: 'type',
        description: 'Enter The Type Of Category',
        required: false,
        uniqueItems: true,
        example: 'Car'
    })
    @IsString()
    @IsOptional()
    type?: string

    @ApiProperty({
        name: 'description',
        description: 'Enter The Description Of Category',
        required: false,
        example: 'Awsome Type Car'
    })
    @IsString()
    @IsOptional()
    description?: string


    @ApiProperty({
        name: 'status',
        description: 'Enter Status Of Category',
        required: false,
        enum: PARCKING_CATEGORY_STATUS
    })
    @IsEnum(PARCKING_CATEGORY_STATUS, { message: 'Please, enter the correct status' })
    @IsOptional()
    status?: PARCKING_CATEGORY_STATUS

    @ApiProperty({
        name: 'place',
        required: false,
        description: 'Enter Place Of Category',
        example: '63b33e04e948de2d244f2230'
    })
    @IsOptional()
    place?: ParckingPlace
}