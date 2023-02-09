import { ApiProperty, PartialType } from "@nestjs/swagger";
import { SummaryReportDto } from "./summary-reports.dto";
import { IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class DetailsReportsDto extends PartialType(SummaryReportDto) {
    @ApiProperty({
        name: 'vehicle_Number',
        required: false,
        description: "Enter Vehicle Number",
        example: 345566
    })
    @IsOptional()
    @Type(() => Number)
    vehicle_Number?: number
    @ApiProperty({
        name: 'driver_Name',
        required: false,
        description: "Enter Driver Name",
        example: "Mohamed"
    })
    @IsOptional()
    @IsString()
    driver_Name?: string

    @ApiProperty({
        name: 'driver_Mobile',
        required: false,
        description: "Enter Driver Mobile",
        example: "0666447788"
    })
    @IsOptional()
    @IsString()
    driver_Mobile?: string
}