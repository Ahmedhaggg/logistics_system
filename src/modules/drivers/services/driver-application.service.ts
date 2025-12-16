import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DriverRepository } from '../repositories/driver.repository';
import { Driver } from '../entities/driver.entity';
import { CreateDriverApplicationDto } from '../dto/driver-application.dto';
import { UserRepository } from '@core/users/repositories/user.repository';
import { TransactionManager } from '@db/transaction-manager';
import { UserRoleRepository } from '@core/users/repositories/user-role.repository';
import { Role } from '@core/users/entities/user_role.entity';
import { DriverApplicationRepository } from '../repositories/driver-application.repository';
import { DriverApplication } from '../entities/driver-application.entity';
import { AcceptDriverApplicationDto } from '../dto/accept-driver.dto';
import { EmployeeRepository } from '@module/employees/repositories/employee.repository';
import { StorageService } from '@shared/storage/storage.service';

@Injectable()
export class DriverApplicationService {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: UserRoleRepository,
    private readonly driverApplicationRepository: DriverApplicationRepository,
    private readonly transactionManager: TransactionManager,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async findAll(): Promise<DriverApplication[]> {
    return this.driverApplicationRepository.findAll();
  }

  async findOne(id: string): Promise<DriverApplication> {
    const driver = await this.driverApplicationRepository.findById(id);
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return driver;
  }

  async createApplication(
    userId: string,
    driver: Omit<CreateDriverApplicationDto, 'driverLicense'> & {
      driverLicenseUrl: string;
    },
  ): Promise<DriverApplication> {
    let user = await this.userRepository.findById(userId);

    if (!user) throw new BadRequestException('User not found');

    const existingApplication =
      await this.driverApplicationRepository.findById(userId);

    if (existingApplication)
      throw new BadRequestException('User already has a driver application');


    return this.driverApplicationRepository.create({
      userId: user.id,
      birthday: driver.birthday,
      driverLicenseUrl: driver.driverLicenseUrl,
      status: 'PENDING',
    });
  }

  async acceptApplication(
    id: string,
    driver: AcceptDriverApplicationDto,
  ): Promise<DriverApplication> {
    return await this.transactionManager.runTransaction(async (tx) => {
      let driverApplication = await this.driverApplicationRepository.findById(
        id,
        tx,
      );

      if (!driverApplication)
        throw new BadRequestException('Driver application not found');

      if (driverApplication.status !== 'PENDING')
        throw new BadRequestException('Driver application is not pending');

      await this.roleRepository.create(
        {
          userId: driverApplication.userId,
          role: Role.DRIVER,
        },
        tx,
      );

      const employee = await this.employeeRepository.create(
        {
          shiftStartTime: driver.shiftStartTime,
          shiftEndTime: driver.shiftEndTime,
          salary: driver.salary,
          birthday: driverApplication.birthday,
          userId: driverApplication.userId,
        },
        tx,
      );

      await this.driverRepository.create(
        {
          employeeId: employee.id,
          approvedAt: new Date(),
          driverLicenseUrl: driverApplication.driverLicenseUrl,
        },
        tx,
      );

      let updatedDriverApplication =
        await this.driverApplicationRepository.updateById(
          id,
          {
            status: 'APPROVED',
          },
          tx,
        );

      return updatedDriverApplication;
    });
  }

  async rejectApplication(id: string): Promise<DriverApplication> {
    let driverApplication = await this.driverApplicationRepository.findById(id);

    if (!driverApplication)
      throw new BadRequestException('Driver application not found');

    if (driverApplication.status !== 'PENDING')
      throw new BadRequestException('Driver application is not pending');

    return this.driverApplicationRepository.updateById(id, {
      status: 'REJECTED',
    });
  }
}
