import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./public.decorator";
import { LoginResponseDto } from "./dto/login-response.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { Request } from "express";

@ApiTags('AUTH')
@Controller('auth')
export class AuthController{
    constructor( private readonly authService: AuthService ){}

    @ApiBadRequestResponse({
        description: 'Invalid Email Or Password'
    })
    @ApiOkResponse({
        type: LoginResponseDto
    })
    @ApiOperation({ description: 'User Login' })
    @Public()
    @Get()
    async Login(@Body() input: LoginDto): Promise<LoginResponseDto>{
        return this.authService.login(input)
    }

    @ApiBadRequestResponse({
        description: 'the entered password is invalid'
    })
    @ApiOkResponse({
        type: LoginResponseDto
    })
    @ApiBearerAuth()
    @ApiOperation({ description: 'User Update Current Password' })
    @Post('/change-my-password')
    async changePassword(@Req() request: Request, @Body() input: UpdatePasswordDto): Promise<LoginResponseDto> {
        const { id } = request.user as { id: string }
        return this.authService.changePassword(id, input)
    }
}