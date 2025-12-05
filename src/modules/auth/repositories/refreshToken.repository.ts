import {
  CreateRefreshToken,
  RefreshToken,
  refreshTokens,
} from '../entities/refreshToken.entity';
import { Injectable } from '@nestjs/common';
import { DB, injectDB } from '@common/db/provider';
import { eq, SQL, and } from 'drizzle-orm';

@Injectable()
export class RefreshTokenRepository {
  constructor(@injectDB() private db: DB) {}

  async create(user: CreateRefreshToken): Promise<void> {
    await this.db.insert(refreshTokens).values(user);
  }

  async findOne(
    refreshToken: Partial<RefreshToken>,
  ): Promise<RefreshToken | null> {
    const where: SQL[] = [];
    if (refreshToken.token)
      where.push(eq(refreshTokens.token, refreshToken.token));

    if (refreshToken.userId)
      where.push(eq(refreshTokens.userId, refreshToken.userId));

    if (refreshToken.isRevoked !== undefined)
      where.push(eq(refreshTokens.isRevoked, refreshToken.isRevoked));

    const result = await this.db
      .select()
      .from(refreshTokens)
      .where(and(...where));

    return result[0] ?? null;
  }

  async update(filter: Partial<RefreshToken>, newData: Partial<RefreshToken>) {
    const where: SQL[] = [];
    if (filter.token) where.push(eq(refreshTokens.token, filter.token));

    if (filter.userId) where.push(eq(refreshTokens.userId, filter.userId));

    await this.db
      .update(refreshTokens)
      .set(newData)
      .where(and(...where));
  }
}
