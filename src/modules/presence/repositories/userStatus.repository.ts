import { DB, injectDB } from '@common/db/provider';
import { Injectable } from '@nestjs/common';
import {
  CreateUserStatus,
  usersStatuses,
  UserStatus,
} from '../entities/userStatus.entity';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserStatusRepository {
  constructor(@injectDB() private db: DB) {}

  async findByUserId(
    userId: string,
  ): Promise<Pick<UserStatus, 'status' | 'lastUpdate'> | null> {
    const queryResult = await this.db
      .select({
        status: usersStatuses.status,
        lastUpdate: usersStatuses.lastUpdate,
      })
      .from(usersStatuses)
      .where(eq(usersStatuses.userId, userId));

    return queryResult[0] ?? null;
  }

  async create(data: CreateUserStatus) {
    await this.db.insert(usersStatuses).values(data);
  }

  async updateByUserId(userId: string, newStatus: CreateUserStatus['status']) {
    await this.db
      .update(usersStatuses)
      .set({ status: newStatus })
      .where(eq(usersStatuses.userId, userId));
  }
}
