import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SharedModule } from '@shared/config.module';
import { AppConfigService } from '@shared/config/config.service';
import { AuthModule } from 'modules/auth/auth.module';
import { DbModule } from '@common/db';

@Module({
  imports: [
    DbModule,
    SharedModule,
    AuthModule,
    ApiKeysModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [AppConfigService],
})
export class AppModule {}
