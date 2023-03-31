import { UserInterface } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { Controller, Post, UseInterceptors, Body, Param, Patch, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileUploadBodyInterceptor } from 'src/common/interceptors/fileUpload.interceptor';
import { Get, Query } from '@nestjs/common/decorators';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { Public } from 'src/auth/public.decorator';

@Public()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: FilterQueryDto) {
    return await this.userService.queryAllUsers(query)
  }

  @ApiOkResponse({
    type: UserInterface,
    description: 'Find User Successfully'
  })
  @ApiBearerAuth()
  @ApiNotFoundResponse({
    description: 'User Not Found With This ID'
  })
  @ApiOperation({ summary: 'Get user By Its ID' })
  @Get('/:id')
  async findbyId(@Param('id') id: string) {
    return this.userService.queryUser(id)
  }

  @ApiOkResponse({
    type: UserInterface,
    description: 'Updated User Details Successfully'
  })
  @ApiNotFoundResponse({
    description: 'User Not Found'
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: 'Update User Details' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('image'), FileUploadBodyInterceptor)
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.userService.updateUserDetails(id, updateDto)
  }

  @ApiOkResponse({
    description: 'Delete User Successfully'
  })
  @ApiNotFoundResponse({
    description: 'User Not Found'
  })
  @ApiOperation({ summary: 'Delete Users' })
  @Delete('/:id')
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    return this.userService.deleteUser(id)
  }
}
