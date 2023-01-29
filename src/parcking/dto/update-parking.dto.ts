import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { ParckingCategory } from "src/parcking-category/schema/parcking-category.schema"
import { ParckingPlace } from "src/parcking-place/schema/parcking-place.schema"
import { Slot } from "src/slot/schema/slot.schema"

export class UpdateParckingDto {
    @ApiProperty({
        name: 'vehicle_Number',
        required: false,
        description: 'Enter Vehicle Number',
        example: 435288906
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    vehicle_Number?: number

    @ApiProperty({
        name: 'driver_Name',
        description: 'Enter Driver Name',
        required: true,
        example: 'James Doe'
    })
    @IsOptional()
    @IsString()
    driver_Name?: string

    @ApiProperty({
        name: 'driver_Mobile',
        description: 'Enter Driver Mobile Number',
        required: false,
        example: '0777777777'
    })
    @IsOptional()
    @IsString()
    driver_Mobile?: string

    @ApiProperty({
        name: 'slot',
        required: false,
        description: 'Enter The Slot',
        example: '63c46f21bf33c6445bb4d103'
    })
    @IsOptional()
    @IsString()
    slot?: Slot

    @ApiProperty({
        name: 'place',
        required: false,
        description: 'Enter The Place',
        example: '63b33e04e948de2d244f2230'
    })
    @IsOptional()
    @IsString()
    place?: ParckingPlace

    @ApiProperty({
        name: 'type',
        required: false,
        description: 'Enter Type Of Vehicle',
        example: '63b9edc47e1e7acdd6f45fa9'
    })
    @IsOptional()
    @IsString()
    type?: ParckingCategory
}