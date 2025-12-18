import { User } from '@core/users/entities/user.entity';
import { UserRole } from '@core/users/entities/user_role.entity';
import { faker } from '@faker-js/faker';
import { DriverApplication } from '@module/drivers/entities/driver-application.entity';
import { Driver } from '@module/drivers/entities/driver.entity';
import { Employee } from '@module/employees/entities/employee.entity';

export const fakeDriverApplication = (
  overrides?: Partial<DriverApplication>,
): DriverApplication => {
  return {
    id: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    userId: faker.string.uuid(),
    status: 'PENDING',
    birthday: faker.date.past(),
    driverLicenseUrl: faker.image.url(),
    ...overrides,
  };
};

export const fakeUserRole = (overrides?: Partial<UserRole>): UserRole => {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    role: 'DRIVER',
    ...overrides,
  };
};

export const fakeUser = (overrides?: Partial<User>): User => {
  return {
    id: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    imageUrl: faker.image.url(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    passwordHash: faker.internet.password(),
    fullName: faker.person.fullName(),
    ...overrides,
  };
};

export const fakeDriver = (overrides?: Partial<Driver>): Driver => {
  return {
    id: faker.string.uuid(),
    employeeId: faker.string.uuid(),
    approvedAt: new Date(),
    driverLicenseUrl: faker.image.url(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

export const fakeEmployee = (overrides?: Partial<Employee>): Employee => {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    birthday: faker.date.past(),
    shiftStartTime: '09:00',
    shiftEndTime: '17:00',
    salary: parseInt(faker.finance.amount()),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};
