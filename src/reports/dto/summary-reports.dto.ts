import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { Floor } from "src/floor/schema/floor.schema"
import { ParckingCategory } from "src/parcking-category/schema/parcking-category.schema"
import { ParckingPlace } from "src/parcking-place/schema/parcking-place.schema"
import { Slot } from "src/slot/schema/slot.schema"

export class SummaryReportDto {

    @ApiProperty({
        name: "from_Date",
        required: false,
        description: "Enter From Date",
        example: "2023-01-01 14:00:00"
    })
    @IsOptional()
    from_Date?: string

    @ApiProperty({
        name: "to_Date",
        required: false,
        description: "Enter To Date",
        example: "2023-02-01 18:00:00"
    })
    @IsOptional()
    to_Date?: string

    @ApiProperty({
        name: "place",
        required: false,
        description: "Enter The Place",
        example: "63dfa5ee662cd84f15254e3f"
    })
    @IsOptional()
    @IsString()
    place?: ParckingPlace

    @ApiProperty({
        name: "type",
        required: false,
        description: "Enter The Category",
        example: "63dfb04b6ed94a01dbf27e97",
    })
    @IsOptional()
    @IsString()
    type?: ParckingCategory

    @ApiProperty({
        name: "floor",
        required: false,
        description: "Enter The Floor",
        example: "63dfa61b662cd84f15254e47"
    })
    @IsOptional()
    @IsString()
    floor?: Floor
}