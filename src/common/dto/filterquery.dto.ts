import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class FilterQueryDto {
    @ApiProperty({
        name: 'filter',
        description: 'This will filter all users and select only user that contain the word you insert and search in all user fields about this word',
        required: false
    })
    @IsString()
    @IsOptional()
    filter?: string

    @ApiProperty({
        name: 'page',
        description: 'When number of user is greater than 10 users, it divides into pages each page contain 10 users.',
        required: false
    })
    @IsOptional()
    @IsString()
    page?: string

    @ApiProperty({
        name: 'limit',
        description: 'Limit the number of users from for example 20 user to 5 users.',
        required: false
    })
    @IsOptional()
    @IsString()
    limit?: string

    @ApiProperty({
        name: 'sort',
        description: 'sort the result by one or more property',
        required: false
    })
    @IsString()
    @IsOptional()
    sort?: string

    @ApiProperty({
        name: 'fields',
        description: 'fields that return in the result',
        required: false
    })
    @IsString()
    @IsOptional()
    fields?: string
}