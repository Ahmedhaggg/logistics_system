import { Module } from '@nestjs/common';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SharedModule } from '@shared/config.module';
import { AppConfigService } from '@shared/config/config.service';
import { AuthModule } from 'core/auth/auth.module';
import { DbModule } from 'database/index';
import { UsersModule } from '@core/users/users.module';
import { CustomerModule } from './modules/customers/customer.module';

@Module({
  imports: [
    DbModule,
    SharedModule,
    AuthModule,
    UsersModule,
    NotificationsModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [AppConfigService],
})
export class AppModule {}
