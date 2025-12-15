import { Test, TestingModule } from '@nestjs/testing';
import { DriverService } from '../../services/driver.service';
import { DriverRepository } from '../../repositories/driver.repository';
import { DriverApplicationRepository } from '../../repositories/driver-application.repository';
import { UserRepository } from '@core/users/repositories/user.repository';
import { UserRoleRepository } from '@core/users/repositories/user-role.repository';
import { EmployeeRepository } from '@module/employees/repositories/employee.repository';
import { DbModule } from '@db/index';
import { SharedModule } from '@shared/config.module';
import { fakeUser } from '@test/factory';
import { faker } from '@faker-js/faker';
import { drizzleProvider, DB } from '@db/provider';
import { Role } from '@core/users/entities/user_role.entity';
import { clearDb } from '@test/utils/db';

describe('DriverService Integration', () => {
  let service: DriverService;
  let db: DB;
  let userRepository: UserRepository;
  let driverApplicationRepository: DriverApplicationRepository;
  let driverRepository: DriverRepository;
  let employeeRepository: EmployeeRepository;
  let roleRepository: UserRoleRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, DbModule],
      providers: [
        DriverService,
        DriverRepository,
        DriverApplicationRepository,
        UserRepository,
        UserRoleRepository,
        EmployeeRepository,
      ],
    }).compile();

    service = module.get<DriverService>(DriverService);
    db = module.get<DB>(drizzleProvider);
    userRepository = module.get<UserRepository>(UserRepository);
    driverApplicationRepository = module.get<DriverApplicationRepository>(
      DriverApplicationRepository,
    );
    driverRepository = module.get<DriverRepository>(DriverRepository);
    employeeRepository = module.get<EmployeeRepository>(EmployeeRepository);
    roleRepository = module.get<UserRoleRepository>(UserRoleRepository);
  });

  beforeEach(async () => {
    await clearDb(db);
  });

  afterAll(async () => {
    await clearDb(db);
  });

  describe('Happy Path Scenarios', () => {
    it('should create a driver application successfully', async () => {
      const user = await userRepository.create(fakeUser());

      const dto = {
        birthday: faker.date.past(),
        driverLicenseUrl: faker.image.url(),
      };

      const app = await service.createApplication(user.id, dto);

      expect(app.userId).toBe(user.id);
      expect(app.status).toBe('PENDING');

      const savedApp = await driverApplicationRepository.findById(app.id);

      expect(savedApp!.status).toBe('PENDING');
    });

    it('should accept a driver application', async () => {
      const user = await userRepository.create(fakeUser());

      const app = await service.createApplication(user.id, {
        birthday: faker.date.past(),
        driverLicenseUrl: faker.image.url(),
      });

      const acceptDto = {
        salary: 5000,
        shiftStartTime: '09:00',
        shiftEndTime: '17:00',
      };

      const result = await service.acceptApplication(app.id, acceptDto);

      expect(result.status).toBe('APPROVED');

      const userRolesList = await roleRepository.findRolesByUserId(user.id);
      const hasDriverRole = userRolesList.some((r) => r.role === Role.DRIVER);
      expect(hasDriverRole).toBe(true);

      // Verify Employee
      const employeeList = await employeeRepository.findAll();
      const employee = employeeList.find((e) => e.userId === user.id);

      expect(employee).toBeDefined();
      expect(employee!.salary).toBe(5000);

      // Verify Driver
      const driver = await driverRepository.findByEmployeeId(employee!.id);
      expect(driver).toBeDefined();
    });

    it('should reject a driver application', async () => {
      const user = await userRepository.create(fakeUser());

      const app = await service.createApplication(user.id, {
        birthday: faker.date.past(),
        driverLicenseUrl: faker.image.url(),
      });

      const result = await service.rejectApplication(app.id);

      expect(result.status).toBe('REJECTED');

      const savedApp = await driverApplicationRepository.findById(app.id);
      expect(savedApp!.status).toBe('REJECTED');
    });
  });
});
