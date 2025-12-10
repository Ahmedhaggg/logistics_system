import { Injectable } from '@nestjs/common';
import { DB, injectDB } from 'database/provider';
import { and, eq, SQL } from 'drizzle-orm';
import { User, InsertUser } from '../entities/user.entity';
import { users, userRoles } from 'database/schema';
import { Role } from '../entities/user_role.entity';

@Injectable()
export class UserRepository {
  constructor(@injectDB() private db: DB) {}

  async findById(id: string): Promise<User | null> {
    const queryResult = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return queryResult[0] ?? null;
  }

  async findOne(user: Partial<User>): Promise<User | null> {
    let query: SQL[] = [];
    if (user.email) query.push(eq(users.email, user.email));

    const queryResult = await this.db
      .select()
      .from(users)
      .where(and(...query));

    return queryResult[0] ?? null;
  }

  async updateById(id: string, user: Partial<User>): Promise<void> {
    await this.db.update(users).set(user).where(eq(users.id, id));
  }

  async create(user: InsertUser): Promise<User> {
    const newUser = await this.db.insert(users).values(user).returning();
    return newUser[0];
  }

  async deleteById(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }

  async find() {
    return await this.db.select().from(users);
  }

  async findByRole(role: Role): Promise<User[]> {
    const result = await this.db
      .select({
        id: users.id,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        imageUrl: users.imageUrl,
        email: users.email,
        phone: users.phone,
        passwordHash: users.passwordHash,
        fullName: users.fullName,
      })
      .from(users)
      .innerJoin(userRoles, eq(users.id, userRoles.userId))
      .where(eq(userRoles.role, role));
    
    return result;
  }
}
