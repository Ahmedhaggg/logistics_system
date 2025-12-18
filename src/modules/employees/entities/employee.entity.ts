import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { employees } from '@db/schema';

export type Employee = InferSelectModel<typeof employees>;

export type InsertEmployee = InferInsertModel<typeof employees>;
