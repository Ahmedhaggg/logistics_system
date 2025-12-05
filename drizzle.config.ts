import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/common/db/schema.ts',
  dbCredentials: {
    url: process.env.DB_URL as string,
  },
});
