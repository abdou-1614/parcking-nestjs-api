import { IsOptional } from 'class-validator';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ParckingPlace } from './../../parcking-place/schema/parcking-place.schema';
import { ApiProperty } from '@nestjs/swagger';
export class CreateFloorDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({
        required: true,
        description: 'Enter Level Of Floor',
        example: 2,
        name: 'level',
        type: Number
    })
    @IsNumber()
    @IsNotEmpty()
    level: number

    @ApiProperty({
        required: false,
        description: 'Enter The Remark Of Floor',
        example: 'Nice Floor',
        name: 'remarks'
    })
    @IsString()
    @IsOptional()
    remarks?: string

    @ApiProperty({
        required: true,
        description: 'Enter The Place',
        example: '63b33e04e948de2d244f2230',
        name: 'place'
    })
    @IsString()
    @IsNotEmpty()
    place: ParckingPlace
}