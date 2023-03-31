import { Body, Controller, Get, Post, Req, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./public.decorator";
import { LoginResponseDto } from "./dto/login-response.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { Request } from "express";
import { RefreshTokenDto } from "./dto/refreshToken.dto";
import { LogoutDto } from "./dto/logout.dto";
import { IsAdmin } from "src/common/decorators/is-admin.decorator";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadBodyInterceptor } from "src/common/interceptors/fileUpload.interceptor";

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
    @Post()
    async Login(@Body() input: LoginDto, @Req() request: Request): Promise<LoginResponseDto>{
        const browserInfo = `${request.ip} ${request.headers['user-agent']} ${request.headers['accept-language']}`.replace(/ undefined/g, '')

        return this.authService.login(input, browserInfo)
    }
    @ApiOkResponse({ type: LoginResponseDto })
    @ApiOperation({ summary: 'RefereshToken' })
    @Public()
    @Post('/refreshToken')
    async refreshToken(@Req() request: Request, @Body() { refreshToken }: RefreshTokenDto): Promise<LoginResponseDto> {
      const browserInfo = `${request.ip} ${request.headers['user-agent']} ${request.headers['accept-language']}`.replace(/ undefined/g, '')
  
      return this.authService.refreshToken(refreshToken, browserInfo)
    }
    @ApiOperation({ summary: 'Log Out User' })
    @ApiBearerAuth()
    @Post('/logout')
    async logout(@Body() { refreshToken }: LogoutDto) {
      return this.authService.logout(refreshToken)
    }
  
    @ApiOperation({ summary: 'Logs out user of all sessions' })
    @ApiBearerAuth()
    @Post('/logoutAll')
    async logouAll(@Req() request: Request) {
      const { id } = request.user as { id: string };;
      return this.authService.logoutAll(id)
    }

    @IsAdmin()
    @Get('/my')
    @ApiBearerAuth()
    async findCurrentLogged(@Req() request: Request){
        const { id } = request.user as { id: string };
        return this.authService.findMe(id)
    }
  
    @ApiOperation({ summary: 'Returns all user active tokens' })
    @ApiBearerAuth()
    @Get('/tokens')
    async findAllTokens(@Req() request: Request){
              const { id } = request.user as { id: string };;
      return this.authService.findAllTokens(id)
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

    @ApiBadRequestResponse({
        description: 'the entered password is invalid'
    })
    @ApiOkResponse({
        type: LoginResponseDto
    })
    @ApiBody({ type: UpdateProfileDto })
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiOperation({ description: 'User Update Current Profile Information' })
    @Post('/profile')
    @UseInterceptors(FileInterceptor('image'), FileUploadBodyInterceptor)
    async updateProfile(@Req() request: Request, @Body() input: UpdateProfileDto): Promise<LoginResponseDto>{
        const { id } = request.user as { id: string }
        return this.authService.updateProfile(id, input)
    }
}