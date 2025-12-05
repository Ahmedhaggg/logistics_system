import { InferInsertModel, InferSelectModel, InferEnum } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const userRole = pgEnum('role', ['GUEST', 'HOST', 'ADMIN']);

export type UserRole = InferEnum<typeof userRole>;

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  role: userRole('role').notNull(),
  photo: text('photo'),
  lastLogin: timestamp('last_login', { withTimezone: true }),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = InferSelectModel<typeof users>;

export type InsertUser = InferInsertModel<typeof users>;
