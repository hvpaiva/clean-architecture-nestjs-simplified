import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsService } from 'application/use-cases/posts.service';
import { User } from 'domain/models/user.entity';
import { PostsController } from 'presentation/controllers/posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
