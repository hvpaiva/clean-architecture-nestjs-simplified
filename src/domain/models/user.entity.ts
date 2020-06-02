import {
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Index,
  Unique,
} from 'typeorm';

import { DomainException } from 'domain/exceptions/DomainException';
import { IEntity } from 'domain/shared/IEntity';

import { Post } from './post.entity';

@Entity({
  name: 'users',
  orderBy: {
    createdAt: 'ASC',
  },
})
@Index('IDX_USERS', ['name', 'email'], { unique: true })
@Unique('UNIQUE_USERS', ['email'])
export class User implements IEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @OneToMany(
    () => Post,
    post => post.user,
    { cascade: ['insert', 'update'], onDelete: 'CASCADE' },
  )
  posts?: Post[];

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt?: Date;

  constructor(name: string, email: string, posts?: Post[], id?: number) {
    this.name = name;
    this.email = email;
    this.posts = posts;
    this.id = id;
  }

  findPost(postId: number): Post {
    return this.posts?.find(p => p.id === postId) ?? null;
  }

  findPosts(): Post[] {
    return this.posts ?? [];
  }

  createPost(post: Post): void {
    if (!this.posts) this.posts = new Array<Post>();

    if (this.posts.map(p => p.title).includes(post.title))
      throw new DomainException('Post with the same name already exists');

    this.posts.push(post);
  }

  equals(entity: IEntity) {
    if (!(entity instanceof User)) return false;

    return this.id === entity.id;
  }
}
