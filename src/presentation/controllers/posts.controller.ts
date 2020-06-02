import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { PostsService } from 'application/use-cases/posts.service';
import { BadRequestError } from 'presentation/errors/BadRequestError';
import { NotFoundError } from 'presentation/errors/NotFoundError';
import { UnprocessableEntityError } from 'presentation/errors/UnprocessableEntityError';
import { CreatePostDto } from 'presentation/view-models/posts/create-post.dto';
import { PostDto } from 'presentation/view-models/posts/post.dto';

@ApiTags('Posts')
@Controller()
export class PostsController {
  constructor(private readonly postsServices: PostsService) {}

  @Get('users/:userId/posts')
  @ApiOperation({
    summary: 'Find all Posts of an User',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'The user id',
  })
  @ApiOkResponse({ description: 'Posts founded.', type: [PostDto] })
  @ApiNotFoundResponse({
    description: 'If the user passed in userId not exists.',
    type: NotFoundError,
  })
  async getPostsByUser(@Param('userId') userId: string): Promise<PostDto[]> {
    const posts = this.postsServices.getAllPostsByUser(parseInt(userId, 10));

    return (await posts).map(post => PostDto.toDto(post));
  }

  @Get('users/:userId/posts/:postId')
  @ApiOperation({
    summary: 'Find a Post of an User',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'The user id',
  })
  @ApiParam({
    name: 'postId',
    type: Number,
    description: 'The post id',
  })
  @ApiOkResponse({ description: 'Post founded.', type: PostDto })
  @ApiNotFoundResponse({
    description: 'If the user or the post not exists.',
    type: NotFoundError,
  })
  async getPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<PostDto> {
    const post = await this.postsServices.getPostByUser(
      parseInt(userId, 10),
      parseInt(postId, 10),
    );

    return PostDto.toDto(post);
  }

  @Post('users/:userId/posts')
  @ApiOperation({
    summary: 'Creates a Post',
  })
  @ApiCreatedResponse({ description: 'User created.', type: PostDto })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error while creating user',
    type: UnprocessableEntityError,
  })
  async createPost(
    @Param('userId') userId: string,
    @Body() createPost: CreatePostDto,
  ): Promise<PostDto> {
    const post = await this.postsServices.createPost(
      parseInt(userId, 10),
      CreatePostDto.fromDto(createPost),
    );

    return PostDto.toDto(post);
  }
}
