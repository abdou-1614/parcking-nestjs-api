import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { PARCKING_PLACE_STATUS } from "src/constants/parcking-place-constant"

export class UpdateParckingPlaceDto {

    @ApiProperty({
        name: 'name',
        description: 'Enter The Name Of The Parcking Place',
        required: false
    })
    @IsOptional()
    @IsString()
    name?: string

    @ApiProperty({
        name: 'description',
        description: 'Enter The Description Of The Parcking Place',
        required: false
    })
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty({
        enum: PARCKING_PLACE_STATUS,
        description: 'Update Parcking Place Status',
        required: false
    })
    @IsEnum(PARCKING_PLACE_STATUS, { message: 'Please, enter the correct status' })
    @IsOptional()
    status?: PARCKING_PLACE_STATUS
}