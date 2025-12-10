import { Injectable } from "@nestjs/common";
import { injectDB, DB } from "database/provider";
import { InsertUserRole, UserRole } from "../entities/user_role.entity";
import { userRoles } from "database/schema";
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRoleRepository {
 
  constructor(@injectDB() private db: DB) {}

  async create(userRole: InsertUserRole) {
    return this.db.insert(userRoles).values(userRole).returning();
  }

  async findRolesByUserId(userId: string) {
    return this.db.select().from(userRoles).where(eq(userRoles.userId, userId));
  }
}