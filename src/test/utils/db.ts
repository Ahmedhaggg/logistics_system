// src/test/utils/db.ts

import { DB } from '@db/provider';

export const clearDb = async (db: DB) => {
  // Safety check to prevent accidental clearing of non-test DB
  //   if (!process.env.DATABASE_URL?.includes('test')) {
  //     throw new Error('clearDb() can only run on test database!');
  //   }

  // Truncate all tables with cascade and restart identity
  await db.execute(`
    TRUNCATE TABLE
      drivers,
      driver_applications,
      user_roles,
      employees,
      users,
      refresh_tokens,
      user_presence,
      warehouse_staff,
      warehouses
    RESTART IDENTITY CASCADE;
  `);
};
