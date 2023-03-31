import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"
import { TARIFF_STATUS } from "src/constants/tariff.constant"
import { ParckingCategory } from "src/parcking-category/schema/parcking-category.schema"
import { ParckingPlace } from "src/parcking-place/schema/parcking-place.schema"

export class UpdateTariffDto {
    @ApiProperty({
        name: 'name',
        required: false,
        description: 'Enter Name OF Tariff',
        example: 'Demo Tarif'
    })
    @IsOptional()
    @IsString()
    name?: string


    @ApiProperty({
        name: 'start_date',
        required: false,
        description: 'Enter Date OF Entred Car',
        example: '2023-01-10, 10:00:00'
    })
    @IsOptional()
    start_date?: Date


    @ApiProperty({
        name: 'end_date',
        required: false,
        description: 'Enter Date OF Out Car',
        example: '2023-01-10, 10:11:00'
    })
    @IsOptional()
    end_date?: Date


    @ApiProperty({
        name: 'min_amount',
        required: false,
        description: 'Enter Minimum Amount',
        example: 100
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    min_amount?: number


    @ApiProperty({
        name: 'hour',
        required: true,
        description: 'Enter Hour',
        example: 70
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    hour: number


    @ApiProperty({
        name: 'place',
        required: false,
        description: 'Enter The Place',
        example: '63b33e04e948de2d244f2230'
    })
    @IsOptional()
    place?: ParckingPlace


    @ApiProperty({
        name: 'type',
        required: false,
        description: 'Enter The Type OF Category',
        example: '63b9edc47e1e7acdd6f45fa9'
    })
    @IsOptional()
    type?: ParckingCategory


    @ApiProperty({
        name: 'status',
        required: false,
        description: 'Enter Status',
        enum: TARIFF_STATUS,
        example: 'ENABLE'
    })
    @IsOptional()
    @IsEnum(TARIFF_STATUS, { message: 'Enter Correct Status' })
    status?: TARIFF_STATUS
}