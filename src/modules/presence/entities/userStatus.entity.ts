import { users } from '@common/db/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

export const userStatus = pgEnum('status', ['ONLINE', 'OFFLINE', 'ON_CALL']);

export const usersStatuses = pgTable('users_statuses', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull()
    .unique(),
  status: userStatus('status').notNull(),
  lastUpdate: timestamp('last_update', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type UserStatus = InferSelectModel<typeof usersStatuses>;
export type CreateUserStatus = InferInsertModel<typeof usersStatuses>;
