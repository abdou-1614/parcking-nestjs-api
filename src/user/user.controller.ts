import { UserInterface } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { Controller, Post, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileUploadBodyInterceptor } from 'src/common/interceptors/fileUpload.interceptor';
import { Get, Query } from '@nestjs/common/decorators';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';

@ApiTags('USERS')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({
    type: UserInterface,
    description: 'User Created Successfully'
  })
  @ApiBadRequestResponse({
    description: 'Some User Data Is Invalid'
  })
  @ApiInternalServerErrorResponse({
    description: 'Can"t create user ( likely caused by insufficient write permission )'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Registration User'})
  @ApiConsumes('multipart/form-data')
  @Post('create')
  @UseInterceptors(FileInterceptor('image'), FileUploadBodyInterceptor)
  async create(@Body() input: CreateUserDto) {
    return this.userService.createUser(input)
  }

  @ApiOkResponse({
    type: [UserInterface],
    description: 'Find Users Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Users Not Found'
  })
  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async findAll(@Query() query: FilterQueryDto) {
    return await this.userService.queryAllUsers(query)
  }
}
