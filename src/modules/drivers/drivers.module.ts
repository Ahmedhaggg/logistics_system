import { Module } from '@nestjs/common';
import { DriverApplicationService } from './services/driver-application.service';
import { DriverController } from './controllers/driver.controller';
import { DriverRepository } from './repositories/driver.repository';
import { TransactionManager } from '@db/transaction-manager';
import { UserRoleRepository } from '@core/users/repositories/user-role.repository';
import { DriverApplicationRepository } from './repositories/driver-application.repository';
import { EmployeeRepository } from '@module/employees/repositories/employee.repository';
import { UserRepository } from '@core/users/repositories/user.repository';
import { StorageModule } from '@shared/storage/storage.module';
import {DriverApplicationController } from './controllers/driver-application.controller';
import { DriverService } from './services/driver.service';

@Module({
  controllers: [DriverController, DriverApplicationController],
  providers: [
    DriverApplicationService,
    UserRepository,
    DriverRepository,
    TransactionManager,
    UserRoleRepository,
    DriverApplicationRepository,
    EmployeeRepository,
    DriverApplicationController,
    DriverService
  ],
  imports: [StorageModule],
  exports: [],
})
export class DriversModule {}
