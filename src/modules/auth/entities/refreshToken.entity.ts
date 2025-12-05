import { users } from '@module/users/entities/user.entity';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  token: varchar().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  isRevoked: boolean('is_revoked').default(false).notNull(),
});

export type RefreshToken = InferSelectModel<typeof refreshTokens>;

export type CreateRefreshToken = InferInsertModel<typeof refreshTokens>;
