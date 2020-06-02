import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { UsersService } from 'application/use-cases/users.service';
import { BadRequestError } from 'presentation/errors/BadRequestError';
import { NotFoundError } from 'presentation/errors/NotFoundError';
import { UnprocessableEntityError } from 'presentation/errors/UnprocessableEntityError';
import { CreateUserDto } from 'presentation/view-models/users/create-user.dto';
import { UserDto } from 'presentation/view-models/users/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersServices: UsersService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Find one user by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The user id',
  })
  @ApiOkResponse({ description: 'User founded.', type: UserDto })
  @ApiNotFoundResponse({
    description: 'User cannot be founded.',
    type: NotFoundError,
  })
  async get(@Param('id') id: string): Promise<UserDto> {
    const user = await this.usersServices.getUserById(parseInt(id, 10));

    return UserDto.toDto(user);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all users',
  })
  @ApiOkResponse({ description: 'All user`s fetched.', type: [UserDto] })
  async getAll(): Promise<UserDto[]> {
    const users = await this.usersServices.getUsers();

    return users.map(user => UserDto.toDto(user));
  }

  @Post()
  @ApiOperation({
    summary: 'Creates an user',
  })
  @ApiCreatedResponse({ description: 'User created.', type: UserDto })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while creating user',
    type: UnprocessableEntityError,
  })
  async createUser(@Body() createUser: CreateUserDto): Promise<UserDto> {
    const newUser = await this.usersServices.createUser(
      CreateUserDto.fromDto(createUser),
    );

    return UserDto.toDto(newUser);
  }
}
