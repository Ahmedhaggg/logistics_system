import { driverApplications } from 'database/schema';
import { InferEnum, InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type DriverApplication = InferSelectModel<typeof driverApplications>;
export type DriverApplicationStatusEnum = InferEnum<
  typeof driverApplications.status
>;
export type InsertDriverApplication = InferInsertModel<
  typeof driverApplications
>;
