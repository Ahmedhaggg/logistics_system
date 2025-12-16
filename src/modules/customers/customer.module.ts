import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './customer.controller';
import { UsersModule } from '@core/users/users.module';
import { UserRoleRepository } from '@core/users/repositories/user-role.repository';

@Module({
  imports: [UsersModule],
  controllers: [CustomerController],
  providers: [CustomerService, UserRoleRepository],
})
export class CustomerModule {}
