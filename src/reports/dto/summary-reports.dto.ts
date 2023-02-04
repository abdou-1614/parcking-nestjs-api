import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { Floor } from "src/floor/schema/floor.schema"
import { ParckingCategory } from "src/parcking-category/schema/parcking-category.schema"
import { ParckingPlace } from "src/parcking-place/schema/parcking-place.schema"
import { Slot } from "src/slot/schema/slot.schema"

export class SummaryReportDto {

    @ApiProperty()
    @IsOptional()
    from_Date?: string

    @ApiProperty()
    @IsOptional()
    to_Date?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    place?: ParckingPlace

    @ApiProperty()
    @IsOptional()
    @IsString()
    type?: ParckingCategory

    @ApiProperty()
    @IsOptional()
    @IsString()
    floor?: Floor
}