import { DB, injectDB } from '@db/provider';
import { Injectable } from '@nestjs/common';
import { Employee, InsertEmployee } from '../entities/employee.entity';
import { employees } from '@db/schema';
import { DbTransaction } from '@db/transaction-manager';
import { eq } from 'drizzle-orm';

@Injectable()
export class EmployeeRepository {
  constructor(@injectDB() private readonly db: DB) {}

  async create(employee: InsertEmployee, tx: DbTransaction): Promise<Employee> {
    let db = tx ?? this.db;
    const collection = db.insert(employees).values(employee);
    const result = await collection.returning();
    return result[0];
  }

  async findById(id: string): Promise<Employee | null> {
    const collection = this.db
      .select()
      .from(employees)
      .where(eq(employees.id, id));
    return collection[0] ?? null;
  }

  async update(
    id: string,
    employee: Partial<Employee>,
  ): Promise<Employee | null> {
    const collection = this.db
      .update(employees)
      .set(employee)
      .where(eq(employees.id, id))
      .returning();
    return collection[0] ?? null;
  }

  async findAll(): Promise<Employee[]> {
    const collection = this.db.select().from(employees);
    return collection;
  }
}
