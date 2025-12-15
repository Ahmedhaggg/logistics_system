import { Module } from '@nestjs/common';
import { DriverService } from './services/driver.service';
import { DriverController } from './controllers/driver.controller';
import { DriverRepository } from './repositories/driver.repository';
import { TransactionManager } from '@db/transaction-manager';
import { UserRoleRepository } from '@core/users/repositories/user-role.repository';
import { DriverApplicationRepository } from './repositories/driver-application.repository';
import { EmployeeRepository } from '@module/employees/repositories/employee.repository';
import { UserRepository } from '@core/users/repositories/user.repository';

@Module({
  controllers: [DriverController],
  providers: [
    DriverService,
    UserRepository,
    DriverRepository,
    TransactionManager,
    UserRoleRepository,
    DriverApplicationRepository,
    EmployeeRepository,
  ],
  exports: [],
})
export class DriversModule {}
