import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';
import { UserStatusRepository } from '../repositories/userStatus.repository';
import { UserStatusService } from '../services/userStatus.service';
import { DbModule } from '@common/db';
import { faker } from '@faker-js/faker/.';
import { UserRepository } from '@module/users/user.repository';
import { seedUserData } from '@module/auth/test/user.seed';

// TODO to Fix The Failed Test Cases Must insert users to users tables
describe('UserStatusService (Integration)', () => {
  let service: UserStatusService;
  let repository: UserStatusRepository;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbModule, CacheModule.register()],
      providers: [UserStatusService, UserStatusRepository, UserRepository],
    }).compile();

    service = module.get(UserStatusService);
    repository = module.get(UserStatusRepository);
    userRepository = module.get(UserRepository);
  });

  it('should set and get user status correctly', async () => {
    const user = await userRepository.create(seedUserData());
    let userId = user.id;
    await repository.create({ userId, status: 'ONLINE' });

    await service.setUserStatus(userId, 'ONLINE');

    const status = await service.getUserStatus(userId);

    expect(status).toEqual(
      expect.objectContaining({
        status: 'ONLINE',
        lastUpdate: expect.any(Date),
      }),
    );
  });

  it('should delete cache when status is OFFLINE', async () => {
    const user = await userRepository.create(seedUserData());
    let userId = user.id;
    await repository.create({ userId, status: 'ONLINE' });

    await service.setUserStatus(userId, 'ONLINE');
    await service.setUserStatus(userId, 'OFFLINE');

    const cached = await (service as any).cacheManager.get(
      `users:${userId}:status`,
    );

    expect(cached).toBeUndefined();
  });

  it('should throw NotFoundException if user status does not exist', async () => {
    await expect(service.getUserStatus(faker.string.uuid())).rejects.toThrow(
      'user status is not found',
    );
  });
});
