import { Injectable } from '@nestjs/common';
import { DB, injectDB } from '@db/provider';
import {
  DriverApplication,
  InsertDriverApplication,
} from '../entities/driver-application.entity';
import { driverApplications } from '@db/schema';
import { eq } from 'drizzle-orm';
import { DbTransaction } from '@db/transaction-manager';

@Injectable()
export class DriverApplicationRepository {
  constructor(@injectDB() private readonly db: DB) {}

  async findAll(): Promise<DriverApplication[]> {
    return this.db.select().from(driverApplications);
  }
  
  async findById(
    id: string,
    tx?: DbTransaction,
  ): Promise<DriverApplication | null> {
    const db = tx ?? this.db;

    const result = await db
      .select()
      .from(driverApplications)
      .where(eq(driverApplications.id, id))
      .limit(1);

    return result[0] ?? null;
  }

  async create(
    driverApplication: InsertDriverApplication,
  ): Promise<DriverApplication> {
    const res = await this.db
      .insert(driverApplications)
      .values(driverApplication)
      .returning();
    return res[0];
  }

  async updateById(
    id: string,
    driverApplication: Partial<DriverApplication>,
    tx?: DbTransaction,
  ): Promise<DriverApplication> {
    const db = tx ?? this.db;
    const res = await db
      .update(driverApplications)
      .set(driverApplication)
      .where(eq(driverApplications.id, id))
      .returning();
    return res[0];
  }
}
