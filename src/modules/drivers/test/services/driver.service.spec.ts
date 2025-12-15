import { Role } from '@core/users/entities/user_role.entity';
import { UserRoleRepository } from '@core/users/repositories/user-role.repository';
import { UserRepository } from '@core/users/repositories/user.repository';
import { TransactionManager } from '@db/transaction-manager';
import { faker } from '@faker-js/faker';
import { DriverApplicationRepository } from '@module/drivers/repositories/driver-application.repository';
import { DriverRepository } from '@module/drivers/repositories/driver.repository';
import { DriverService } from '@module/drivers/services/driver.service';
import { EmployeeRepository } from '@module/employees/repositories/employee.repository';
import { TestBed, type Mocked } from '@suites/unit';
import { fakeDriverApplication, fakeEmployee, fakeUser } from '@test/factory';

const fakeAcceptDto = () => ({
  salary: Number(faker.finance.amount()),
  shiftEndTime: '08:30',
  shiftStartTime: '04:30',
});

describe('Driver Service', () => {
  let driverService: DriverService;
  let userRepository: Mocked<UserRepository>;
  let driverApplicationRepository: Mocked<DriverApplicationRepository>;
  let driverRepository: Mocked<DriverRepository>;
  let roleRepository: Mocked<UserRoleRepository>;
  let employeeRepository: Mocked<EmployeeRepository>;
  let transactionManager: Mocked<TransactionManager>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(DriverService).compile();

    driverService = unit;
    userRepository = unitRef.get(UserRepository);
    driverApplicationRepository = unitRef.get(DriverApplicationRepository);
    driverRepository = unitRef.get(DriverRepository);
    roleRepository = unitRef.get(UserRoleRepository);
    employeeRepository = unitRef.get(EmployeeRepository);
    transactionManager = unitRef.get(TransactionManager);
  });

  beforeEach(() => {
    transactionManager.runTransaction.mockImplementation(async (fn) =>
      fn({} as any),
    );
  });

  describe('createApplication', () => {
    it('should throw an error, if user is not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(
        driverService.createApplication(faker.database.mongodbObjectId(), {
          birthday: faker.date.past(),
          driverLicenseUrl: faker.image.url(),
        }),
      ).rejects.toThrow('User not found');
    });

    it('should throw if user have existing application', async () => {
      driverApplicationRepository.findById.mockResolvedValue(
        fakeDriverApplication(),
      );
      userRepository.findById.mockResolvedValue(fakeUser());

      await expect(
        driverService.createApplication(faker.database.mongodbObjectId(), {
          birthday: faker.date.past(),
          driverLicenseUrl: faker.image.url(),
        }),
      ).rejects.toThrow('User already has a driver application');
    });

    it('should create a driver application', async () => {
      const user = fakeUser();
      const app = fakeDriverApplication();

      userRepository.findById.mockResolvedValue(user);
      driverApplicationRepository.findById.mockResolvedValue(null);
      driverApplicationRepository.create.mockResolvedValue(app);

      const result = await driverService.createApplication(user.id, {
        birthday: app.birthday,
        driverLicenseUrl: app.driverLicenseUrl,
      });

      expect(result).toEqual(app);
      expect(driverApplicationRepository.create).toHaveBeenCalledWith({
        userId: user.id,
        birthday: app.birthday,
        driverLicenseUrl: app.driverLicenseUrl,
        status: 'PENDING',
      });
    });
  });

  describe('acceptApplication', () => {
    it('should throw if driver application is not found', async () => {
      driverApplicationRepository.findById.mockResolvedValue(null);

      await expect(
        driverService.acceptApplication('app-id', fakeAcceptDto()),
      ).rejects.toThrow('Driver application not found');
    });

    it('should create DRIVER role for user', async () => {
      const application = fakeDriverApplication({ status: 'PENDING' });
      const employee = fakeEmployee();

      driverApplicationRepository.findById.mockResolvedValue(application);
      employeeRepository.create.mockResolvedValue(employee);
      driverApplicationRepository.updateById.mockResolvedValue({
        ...application,
        status: 'APPROVED',
      });

      await driverService.acceptApplication(application.id, fakeAcceptDto());

      expect(roleRepository.create).toHaveBeenCalledWith(
        {
          userId: application.userId,
          role: Role.DRIVER,
        },
        expect.anything(),
      );
    });

    it('should create employee with correct data', async () => {
      const application = fakeDriverApplication({ status: 'PENDING' });
      const dto = fakeAcceptDto();
      const employee = fakeEmployee();

      driverApplicationRepository.findById.mockResolvedValue(application);
      employeeRepository.create.mockResolvedValue(employee);
      driverApplicationRepository.updateById.mockResolvedValue({
        ...application,
        status: 'APPROVED',
      });

      await driverService.acceptApplication(application.id, dto);

      expect(employeeRepository.create).toHaveBeenCalledWith(
        {
          shiftStartTime: dto.shiftStartTime,
          shiftEndTime: dto.shiftEndTime,
          salary: dto.salary,
          birthday: application.birthday,
          userId: application.userId,
        },
        expect.anything(),
      );
    });

    it('should create driver linked to employee', async () => {
      const application = fakeDriverApplication({ status: 'PENDING' });
      const employee = fakeEmployee();

      driverApplicationRepository.findById.mockResolvedValue(application);
      employeeRepository.create.mockResolvedValue(employee);
      driverApplicationRepository.updateById.mockResolvedValue({
        ...application,
        status: 'APPROVED',
      });

      await driverService.acceptApplication(application.id, fakeAcceptDto());

      expect(driverRepository.create).toHaveBeenCalledWith(
        {
          employeeId: employee.id,
          approvedAt: expect.any(Date),
          driverLicenseUrl: application.driverLicenseUrl,
        },
        expect.anything(),
      );
    });

    it('should update driver application status to APPROVED', async () => {
      const application = fakeDriverApplication({ status: 'PENDING' });

      driverApplicationRepository.findById.mockResolvedValue(application);
      employeeRepository.create.mockResolvedValue(fakeEmployee());
      driverApplicationRepository.updateById.mockResolvedValue({
        ...application,
        status: 'APPROVED',
      });

      const result = await driverService.acceptApplication(
        application.id,
        fakeAcceptDto(),
      );

      expect(driverApplicationRepository.updateById).toHaveBeenCalledWith(
        application.id,
        { status: 'APPROVED' },
        expect.anything(),
      );

      expect(result.status).toBe('APPROVED');
    });

    it('should execute logic inside a transaction', async () => {
      driverApplicationRepository.findById.mockResolvedValue(
        fakeDriverApplication({ status: 'PENDING' }),
      );
      employeeRepository.create.mockResolvedValue(fakeEmployee());
      driverApplicationRepository.updateById.mockResolvedValue(
        fakeDriverApplication({ status: 'APPROVED' }),
      );

      await driverService.acceptApplication('id', fakeAcceptDto());
    });
  });

  describe('rejectApplication', () => {
    it('should throw if driver application is not found', async () => {
      driverApplicationRepository.findById.mockResolvedValue(null);

      await expect(driverService.rejectApplication('app-id')).rejects.toThrow(
        'Driver application not found',
      );
    });

    it('should throw if driver application is not pending', async () => {
      const application = fakeDriverApplication({ status: 'APPROVED' });

      driverApplicationRepository.findById.mockResolvedValue(application);

      await expect(
        driverService.rejectApplication(application.id),
      ).rejects.toThrow('Driver application is not pending');
    });

    it('should update driver application status to REJECTED', async () => {
      const application = fakeDriverApplication({ status: 'PENDING' });

      driverApplicationRepository.findById.mockResolvedValue(application);
      driverApplicationRepository.updateById.mockResolvedValue({
        ...application,
        status: 'REJECTED',
      });

      const result = await driverService.rejectApplication(application.id);

      expect(driverApplicationRepository.updateById).toHaveBeenCalledWith(
        application.id,
        { status: 'REJECTED' },
      );

      expect(result.status).toBe('REJECTED');
    });
  });
});
