import { pgTable, uuid, varchar, real } from "drizzle-orm/pg-core";

export const warehouses = pgTable("warehouses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  city: varchar("city", { length: 70 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
});
