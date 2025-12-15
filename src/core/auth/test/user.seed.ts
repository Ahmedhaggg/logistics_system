import { faker } from '@faker-js/faker/.';
import { GoogleUserInfo } from '../types/googleAuthUser.type';
import * as crypto from 'crypto';
import { RefreshToken } from '../entities/refreshToken.entity';
import { User } from '@core/users/entities/user.entity';

export const seedUserData = (): Omit<User, 'id'> => ({
  email: faker.internet.email(),
  imageUrl: faker.image.url(),
  createdAt: new Date(),
  fullName: faker.internet.displayName(),
  passwordHash: faker.string.alpha({ length: 64 }),
  phone: faker.phone.number(),
  updatedAt: new Date(),
});

export const seedGoogleUserInfo = (): GoogleUserInfo => ({
  email: faker.internet.email(),
  name: faker.internet.displayName(),
  firstName: faker.string.alpha({ length: 6 }),
  lastName: faker.string.alpha({ length: 6 }),
  picture: faker.image.url(),
});

export const seedRefreshTokenData = (
  userId: string,
  token: string,
): Omit<RefreshToken, 'id'> => ({
  userId,
  token: crypto.createHash('sha256').update(token).digest('hex'),
  expiresAt: new Date(Date.now() + 100000),
  isRevoked: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});
