import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { userRoles } from 'database/schema';

export enum Role {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  MANAGER = 'MANAGER',
  WAREHOUSE_STAFF = 'WAREHOUSE_STAFF',
}

export type InsertUserRole = InferInsertModel<typeof userRoles>;

export type UserRole = InferSelectModel<typeof userRoles>;
