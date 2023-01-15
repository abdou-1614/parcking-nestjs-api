import { ApiProperty } from '@nestjs/swagger';
import { Floor } from './../../floor/schema/floor.schema';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ParckingPlace } from 'src/parcking-place/schema/parcking-place.schema';
import { ParckingCategory } from 'src/parcking-category/schema/parcking-category.schema';
import { SLOT_STATUS } from 'src/constants/slot.constant';
export class UpdateSlotDto {
    @ApiProperty({
        name: 'name',
        required: false,
        description: 'Enter Name OF Slot',
        example: 'BS10A'
    })
    @IsString()
    @IsOptional()
    name?: string

    @ApiProperty({
        name: 'remarks',
        required: false,
        description: 'Enter Remarks OF Slot',
        example: 'Nice Slot'
    })
    @IsOptional()
    remarks?: string

    @ApiProperty({
        name: 'identity',
        required: false,
        description: 'Enter Identity OF Slot',
        example: 'ADVCDG545'
    })
    @IsOptional()
    identity?: string

    @ApiProperty({
        name: 'category',
        required: false,
        description: 'Enter Category OF Slot',
        example: '63b33e04e948de2d244f2230'
    })
    @IsString()
    @IsOptional()
    category?: ParckingCategory

    @ApiProperty({
        name: 'place',
        required: false,
        description: 'Enter Place OF Slot',
        example: '63b33e04e948de2d244f2230'
    })
    @IsString()
    @IsOptional()
    place?: ParckingPlace

    @ApiProperty({
        name: 'floor',
        required: false,
        description: 'Enter Floor OF Slot',
        example: '63b71987d4f4219bb227d86b'
    })
    @IsString()
    @IsOptional()
    floor?: Floor

    @ApiProperty({
        name: 'status',
        description: 'Enter Status Of Slot',
        required: false,
        enum: SLOT_STATUS,
        example: 'ACTIVE'
    })
    @IsOptional()
    status?: SLOT_STATUS
}