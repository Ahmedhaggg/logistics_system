import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UserRepository } from '../user.repository';
import { createTestDatabaseModule } from '@common/test/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { seedUserData } from '@module/auth/test/user.seed';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('User Service Test', () => {
  let userService: UsersService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [
        ...createTestDatabaseModule(User),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService, UserRepository],
    }).compile();

    userService = testingModule.get<UsersService>(UsersService);
    userRepository = testingModule.get<UserRepository>(UserRepository);
  });

  describe('deleteUserByEmail', () => {
    test('should throw NotFoundException if user does not exist', async () => {
      const nonExistentEmail = faker.internet.email();

      await expect(
        userService.deleteUserByEmail(nonExistentEmail),
      ).rejects.toThrow(NotFoundException);
    });

    test('should throw ForbiddenException if user is an ADMIN', async () => {
      const adminUser = await userRepository.create({
        ...seedUserData('INVITED'),
        role: 'ADMIN',
      });

      await expect(
        userService.deleteUserByEmail(adminUser.email),
      ).rejects.toThrow(ForbiddenException);
    });

    test('should delete user successfully', async () => {
      const normalUser = await userRepository.create(seedUserData('INVITED'));

      await userService.deleteUserByEmail(normalUser.email);

      const deletedUser = await userRepository.findOne({
        email: normalUser.email,
      });

      expect(deletedUser).toBeNull();
    });
  });

  describe('findAll', () => {
    test('should return all users', async () => {
      // Clear users
      await userRepository.clear();

      await userRepository.create(seedUserData('INVITED'));
      await userRepository.create(seedUserData('INVITED'));
      await userRepository.create(seedUserData('INVITED'));

      const users = await userService.findAll();

      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBe(3);
      users.forEach((user) => {
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('role');
        expect(user).toHaveProperty('createdAt');
      });
    });
  });
});
