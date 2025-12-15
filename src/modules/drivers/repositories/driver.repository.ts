import { Injectable } from '@nestjs/common';
import { DB, injectDB } from '@db/provider';
import { eq } from 'drizzle-orm';
import { drivers } from '@db/schema';
import { Driver, InsertDriver } from '../entities/driver.entity';
import { DbTransaction } from '@db/transaction-manager';

@Injectable()
export class DriverRepository {
  constructor(@injectDB() private db: DB) {}

  async create(
    driver: InsertDriver,
    transaction: DbTransaction,
  ): Promise<Driver> {
    const result = await transaction.insert(drivers).values(driver).returning();
    return result[0];
  }

  async findById(id: string): Promise<Driver | null> {
    const result = await this.db
      .select()
      .from(drivers)
      .where(eq(drivers.id, id));
    return result[0] ?? null;
  }

  async findByEmployeeId(employeeId: string): Promise<Driver | null> {
    const result = await this.db
      .select()
      .from(drivers)
      .where(eq(drivers.employeeId, employeeId));
    return result[0] ?? null;
  }

  async findAll(): Promise<Driver[]> {
    return await this.db.select().from(drivers);
  }

  async update(id: string, driver: Partial<Driver>): Promise<Driver | null> {
    const result = await this.db
      .update(drivers)
      .set(driver)
      .where(eq(drivers.id, id))
      .returning();
    return result[0] ?? null;
  }
}
