import { Injectable } from '@nestjs/common';
import { DB, injectDB } from './provider';
import { PgTransaction } from 'drizzle-orm/pg-core';

export type DbTransaction = PgTransaction<any, any, any>;

@Injectable()
export class TransactionManager {
  constructor(@injectDB() private db: DB) {}

  async runTransaction<T>(callback: (db: DbTransaction) => Promise<T>) {
    return this.db.transaction(async (tx) => {
      return callback(tx);
    });
  }
}
