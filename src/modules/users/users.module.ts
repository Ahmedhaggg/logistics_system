import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [],
  providers: [UserRepository, UsersService],
  controllers: [UsersController],
  exports: [UserRepository],
})
export class UsersModule {}
