import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class EndParkingDto {
    @ApiProperty({
        name: 'paid_amount',
        required: true,
        description: 'Enter Paid Amount',
        example: 4565
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    paid_amount?: number
}