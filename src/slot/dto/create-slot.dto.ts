import { ApiProperty } from '@nestjs/swagger';
import { Floor } from './../../floor/schema/floor.schema';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ParckingPlace } from 'src/parcking-place/schema/parcking-place.schema';
import { ParckingCategory } from 'src/parcking-category/schema/parcking-category.schema';
export class CreateSlotDto {
    @ApiProperty({
        name: 'name',
        required: true,
        description: 'Enter Name OF Slot',
        example: 'BS10A'
    })
    @IsString()
    @IsNotEmpty()
    name: string

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
        required: true,
        description: 'Enter Category OF Slot',
        example: '63b33e04e948de2d244f2230'
    })
    @IsString()
    @IsNotEmpty()
    category: ParckingCategory

    @ApiProperty({
        name: 'place',
        required: true,
        description: 'Enter Place OF Slot',
        example: '63b33e04e948de2d244f2230'
    })
    @IsString()
    @IsNotEmpty()
    place: ParckingPlace

    @ApiProperty({
        name: 'Floor',
        required: true,
        description: 'Enter Floor OF Slot',
        example: '63b71987d4f4219bb227d86b'
    })
    @IsString()
    @IsNotEmpty()
    floor: Floor
}