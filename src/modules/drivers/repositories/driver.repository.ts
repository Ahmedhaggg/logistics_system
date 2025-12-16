import { Injectable } from '@nestjs/common';
import { DB, injectDB } from '@db/provider';
import { eq } from 'drizzle-orm';
import { driverEmployeeRelations, drivers, employees } from '@db/schema';
import { Driver, InsertDriver } from '../entities/driver.entity';
import { DbTransaction } from '@db/transaction-manager';
import { Employee } from '@module/employees/entities/employee.entity';
import { User } from '@core/users/entities/user.entity';

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

  async findAll(): Promise<(Driver & {employee: Employee & { user: User }})[]> {
    let result = await this.db.query.drivers.findMany({
      with: {
        employee: {
          with: {
            user: true,
          }
        },
      },
    })

    return result;
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
