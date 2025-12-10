import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserRoleRepository } from './repositories/user-role.repository';
import { UserRole } from './entities/user_role.entity';
import { FindUserDto } from './dto/find-users.dto';
import { users, userRoles } from '../../database/schema';
import { DB, injectDB } from 'database/provider';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
    @injectDB() private readonly db: DB,
  ) {}

  findByQuery(query: FindUserDto) {
    console.log(query);
    return this.userRepository.find();
  }

  /**
   * Creates a user and its associated role within a single transaction.
   * @param user User entity data to insert.
   * @param role Role to assign to the new user.
   */
  async createUser(user: any, role: UserRole["role"]) {
    return this.db.transaction(async (tx) => {
      const insertedUsers = await tx.insert(users).values(user).returning();
      const newUser = insertedUsers[0];
      await tx.insert(userRoles).values({ userId: newUser.id, role }).returning();
      return newUser;
    });
  }
}