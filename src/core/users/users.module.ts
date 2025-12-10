import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRoleRepository } from './repositories/user-role.repository';

@Module({
  imports: [],
  providers: [UserRepository, UserRoleRepository, UsersService],
  controllers: [UsersController],
  exports: [UserRepository],
})
export class UsersModule {}
