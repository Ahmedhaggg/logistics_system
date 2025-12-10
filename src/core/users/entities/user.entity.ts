import { users } from 'database/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type User = InferSelectModel<typeof users>;

export type InsertUser = InferInsertModel<typeof users>;
