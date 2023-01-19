import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { ParckingCategory } from "src/parcking-category/schema/parcking-category.schema"
import { ParckingPlace } from "src/parcking-place/schema/parcking-place.schema"

export class CreateTariffDto {
    @ApiProperty({
        name: 'name',
        required: true,
        description: 'Enter Name OF Tariff',
        example: 'Demo Tarif'
    })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({
        name: 'start_date',
        required: false,
        description: 'Enter Date OF Entred Car',
        example: '2023-01-10, 10:00:00'
    })
    @IsOptional()
    start_date: string

    @ApiProperty({
        name: 'end_date',
        required: false,
        description: 'Enter Date OF Out Car',
        example: '2023-01-10, 18:00:00'
    })
    @IsOptional()
    end_date?: string

    @ApiProperty({
        name: 'min_amount',
        required: false,
        description: 'Enter Minimum Amount',
        example: 100
    })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    min_amount: number

    @ApiProperty({
        name: 'hour',
        required: true,
        description: 'Enter Hour',
        example: 70
    })
    @IsNumber()
    @Type(() => Number)
    hour?: number

    @ApiProperty({
        name: 'place',
        required: true,
        description: 'Enter The Place',
        example: '63b33e04e948de2d244f2230'
    })
    @IsString()
    @IsNotEmpty()
    place: ParckingPlace

    @ApiProperty({
        name: 'type',
        required: true,
        description: 'Enter The Type OF Category',
        example: '63b9edc47e1e7acdd6f45fa9'
    })
    @IsString()
    @IsNotEmpty()
    type: ParckingCategory
}