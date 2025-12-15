import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './customer.controller';
import { UsersModule } from '@core/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
