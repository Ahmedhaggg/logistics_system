import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { drivers } from 'database/schema';

export type Driver = InferSelectModel<typeof drivers>;
export type InsertDriver = InferInsertModel<typeof drivers>;
