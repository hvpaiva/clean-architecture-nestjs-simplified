import {
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  Entity,
} from 'typeorm';

import { IEntity } from 'domain/shared/IEntity';

import { User } from './user.entity';

@Entity({
  name: 'posts',
  orderBy: {
    createdAt: 'ASC',
  },
})
export class Post implements IEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 50 })
  title: string;

  @Column()
  text: string;

  @ManyToOne(
    () => User,
    user => user.posts,
  )
  user: User;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt?: Date;

  constructor(title: string, text: string, user?: User, id?: number) {
    this.title = title;
    this.text = text;
    this.user = user;
    this.id = id;
  }

  equals(entity: IEntity): boolean {
    if (!(entity instanceof Post)) return false;

    return this.id === entity.id;
  }
}
