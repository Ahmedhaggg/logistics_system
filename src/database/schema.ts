import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  pgEnum,
  timestamp,
  varchar,
  boolean,
  real,
  date,
  unique,
  uniqueIndex,
  time,
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
};

export const userRoleEnum = pgEnum('user_role', [
  'CUSTOMER',
  'DRIVER',
  'MANAGER',
  'WAREHOUSE_STAFF',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  imageUrl: varchar('image_url', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  passwordHash: varchar('password_hash', { length: 255 }),
  fullName: varchar('full_name', { length: 100 }),
  ...timestamps,
});

export const userRoles = pgTable(
  'user_roles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    role: userRoleEnum('role').notNull(),
  },
  (table) => ({
    uniqueUserRole: unique('unique_user_role').on(table.userId, table.role),
  }),
);

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  token: varchar().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ...timestamps,
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

export const presenceStatusEnum = pgEnum('presence_status', [
  'online',
  'offline',
]);

export const userPresence = pgTable('user_presence', {
  userId: uuid('user_id')
    .references(() => users.id)
    .primaryKey(),
  status: presenceStatusEnum('status').notNull().default('offline'),
  lastSeen: timestamp('last_seen').defaultNow(),
  ...timestamps,
});

export const employees = pgTable('employees', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  birthday: timestamp('birthday', { withTimezone: true }).notNull(),
  shiftStartTime: time('shift_start_time').notNull(),
  shiftEndTime: time('shift_end_time').notNull(),
  salary: real('salary').notNull(),
  ...timestamps,
});

export const drivers = pgTable(
  'drivers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    employeeId: uuid('employee_id')
      .notNull()
      .references(() => employees.id, { onDelete: 'cascade' }),
    driverLicenseUrl: varchar('driver_license_url', { length: 255 }),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [uniqueIndex('unique_driver_idx').on(table.employeeId)],
);

export const driverApplicationStatusEnum = pgEnum('driver_application_status', [
  'PENDING',
  'APPROVED',
  'REJECTED',
]);

export const driverApplications = pgTable('driver_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  birthday: timestamp('birthday', { withTimezone: true }).notNull(),
  status: driverApplicationStatusEnum('status').notNull().default('PENDING'),
  ...timestamps,
  driverLicenseUrl: varchar('driver_license_url', { length: 255 }).notNull(),
});

export const warehouseStaff = pgTable(
  'warehouse_staff',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    employeeId: uuid('employee_id').references(() => employees.id, {
      onDelete: 'cascade',
    }),
    warehouseId: uuid('warehouse_id').references(() => warehouses.id, {
      onDelete: 'set null',
    }),
    ...timestamps,
  },
  (table) => ({
    uniqueStaffUser: unique('unique_warehouse_staff_user').on(table.employeeId),
  }),
);



// relationships
export const driverEmployeeRelations = relations(drivers, ({ one }) => ({
  employee: one(employees, {
    fields: [drivers.employeeId],
    references: [employees.id],
  }),
}));

export const employeeUserRelations = relations(employees, ({ one }) => ({
  user: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
}));