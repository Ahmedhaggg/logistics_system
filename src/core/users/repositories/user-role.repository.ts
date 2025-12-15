import { Injectable } from '@nestjs/common';
import { injectDB, DB } from '@db/provider';
import { InsertUserRole, UserRole } from '../entities/user_role.entity';
import { userRoles } from '@db/schema';
import { eq } from 'drizzle-orm';
import { DbTransaction } from '@db/transaction-manager';

@Injectable()
export class UserRoleRepository {
  constructor(@injectDB() private db: DB) {}

  async create(userRole: InsertUserRole, tx?: DbTransaction) {
    const db = tx ?? this.db;
    return db.insert(userRoles).values(userRole).returning();
  }

  async findRolesByUserId(userId: string) {
    return this.db.select().from(userRoles).where(eq(userRoles.userId, userId));
  }
}
