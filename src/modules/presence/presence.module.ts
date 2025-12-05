import { Module } from '@nestjs/common';
import { UserStatusRepository } from './repositories/userStatus.repository';
import { UserStatusService } from './services/userStatus.service';
import { UserStatusGateway } from './userStatus.gateway';

@Module({
  providers: [UserStatusRepository, UserStatusService, UserStatusGateway],
  exports: [UserStatusService],
})
export class PresenceModule {}
