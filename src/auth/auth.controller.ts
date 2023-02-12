import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./public.decorator";
import { LoginResponseDto } from "./dto/login-response.dto";

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
}