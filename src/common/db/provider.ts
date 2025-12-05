import { Inject, Provider } from '@nestjs/common';
import { AppConfigService } from '@shared/config/config.service';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
export const drizzleProvider = 'drizzleProvider';

export const injectDB = () => Inject(drizzleProvider);

export type DB = ReturnType<typeof configDb>;

function configDb(configService: AppConfigService) {
  const pool = new Pool({
    connectionString: configService.get('DB_URL'),
  });
  const db = drizzle(pool, { schema });

  return db;
}

export const dbProvider: Provider = {
  provide: drizzleProvider,
  inject: [AppConfigService],
  useFactory: configDb,
};
