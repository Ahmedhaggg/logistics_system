import { pgTable, uuid, unique, pgEnum, timestamp, varchar, boolean, real } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "CUSTOMER",
  "DRIVER",
  "MANAGER",
  "WAREHOUSE_STAFF",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  imageUrl: varchar("image_url", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  fullName: varchar("full_name", { length: 100 }),
});

export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, {
      onDelete: "cascade",
    }),
    role: userRoleEnum("role").notNull(),
  },
  (table) => ({
    uniqueUserRole: unique("unique_user_role").on(table.userId, table.role),
  })
);

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  token: varchar().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  isRevoked: boolean('is_revoked').default(false).notNull(),
});

export const warehouses = pgTable('warehouses', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  city: varchar('city', { length: 70 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
});


export const warehouseStaff = pgTable(
  "warehouse_staff",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    warehouseId: uuid("warehouse_id").references(() => warehouses.id, {
      onDelete: "set null",
    }),
    position: varchar("position", { length: 50 }),
  },
  (table) => ({
    uniqueStaffUser: unique("unique_warehouse_staff_user").on(table.userId),
  })
);

export const presenceStatusEnum = pgEnum("presence_status", [
  "online",
  "offline",
]);

export const userPresence = pgTable("user_presence", {
  userId: uuid("user_id").references(() => users.id).primaryKey(),
  status: presenceStatusEnum("status").notNull().default("offline"),
  lastSeen: timestamp("last_seen").defaultNow(),
});
