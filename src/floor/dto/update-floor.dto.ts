import { IsOptional, IsString, IsNumber } from 'class-validator';
import { FLOOR_STATUS } from './../../constants/floor.constants';
import { ParckingPlace } from "src/parcking-place/schema/parcking-place.schema"
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFloorDto {

    @ApiProperty({
        name: 'name',
        description: 'Enter Name Of Floor',
        required: false,
        example: 'Basement-4'
    })
    @IsString()
    @IsOptional()
    name?: string

    @ApiProperty({
        name: 'level',
        description: 'Enter Level Of Floor',
        required: false,
        example: 4
    })
    @IsNumber()
    @IsOptional()
    level?: number

    @ApiProperty({
        name: 'remarks',
        description: 'Enter Remarks Of Floor',
        required: false,
        example: 'Basement-4 is Awsome'
    })
    @IsString()
    @IsOptional()
    remarks?: string

    @ApiProperty({
        name: 'place',
        description: 'Enter Place Of Floor',
        required: false,
        example: '63b33e04e948de2d244f2230'
    })
    @IsOptional()
    place?: ParckingPlace

    @ApiProperty({
        name: 'status',
        description: 'Enter Status Of Floor',
        required: false,
        enum: FLOOR_STATUS,
        example: 'ACTIVE'
    })
    @IsOptional()
    status?: FLOOR_STATUS
}