import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UserStatus } from '../entities/userStatus.entity';
import { UserStatusRepository } from '../repositories/userStatus.repository';

@Injectable()
export class UserStatusService {
  private static readonly USER_STATUS_CACHE_PREFIX = 'users';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userStatusRepository: UserStatusRepository,
  ) {}

  async getUserStatus(
    userId: string,
  ): Promise<Pick<UserStatus, 'status' | 'lastUpdate'>> {
    const userStatusCacheKey = this.getUserStatusCacheKey(userId);

    let cachedOnlineStatus =
      await this.cacheManager.get<Pick<UserStatus, 'status' | 'lastUpdate'>>(
        userStatusCacheKey,
      );

    if (cachedOnlineStatus) return cachedOnlineStatus;

    const userStatus = await this.userStatusRepository.findByUserId(userId);

    if (!userStatus) throw new NotFoundException('user status is not found');

    return userStatus;
  }

  async setUserStatus(
    userId: string,
    status: UserStatus['status'],
  ): Promise<void> {
    await this.userStatusRepository.updateByUserId(userId, status);

    const userStatusCacheKey = this.getUserStatusCacheKey(userId);

    if (status == 'OFFLINE') await this.cacheManager.del(userStatusCacheKey);
    else
      await this.cacheManager.set<Pick<UserStatus, 'status' | 'lastUpdate'>>(
        userStatusCacheKey,
        { lastUpdate: new Date(), status: status },
      );
  }

  private getUserStatusCacheKey(userId: string) {
    return `${UserStatusService.USER_STATUS_CACHE_PREFIX}:${userId}:status`;
  }
}
