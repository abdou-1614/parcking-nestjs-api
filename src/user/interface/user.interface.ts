import { ApiProperty } from '@nestjs/swagger';
import { ACCOUNT_STATUS, ACCOUNT_ROLE } from './../../constants/account.constant';
export class UserInterface {
    @ApiProperty({
        example: 'James Doe'
    })
    name: string

    @ApiProperty({
        example: 'test@gmail.com'
    })
    email: string

    @ApiProperty({
        example: 'password@123'
    })
    password: string

    @ApiProperty({
        example: 'picture.png'
    })
    image: string
    @ApiProperty({
        example: 'ACTIVE'
    })
    status: ACCOUNT_STATUS

    @ApiProperty({
        example: 'USER'
    })
    role: ACCOUNT_ROLE
}