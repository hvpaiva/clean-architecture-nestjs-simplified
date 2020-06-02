import { ApiProperty } from '@nestjs/swagger';
import { plainToClass, Expose } from 'class-transformer';

import { User } from 'domain/models/user.entity';

export class UserDto {
  @Expose()
  @ApiProperty({
    description: 'The id of the user',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'The unique email of the user',
    example: 'john.doe@gmail.com',
  })
  email: string;

  @Expose()
  @ApiProperty({ description: 'The crational date of the user' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'The date of the last user update' })
  updatedAt: Date;

  static toDto(user: User): UserDto {
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }
}
