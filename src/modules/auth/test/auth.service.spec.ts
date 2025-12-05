import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '@module/users/user.repository';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { TokenService } from '../services/token.service';
import { GoogleAuthService } from '../services/googleAuth.service';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';
import { DbModule } from '@common/db/index';

import {
  seedUserData,
  seedGoogleUserInfo,
  seedRefreshTokenData,
} from './user.seed';
import { RefreshTokenService } from '../services/refreshToken.service';

describe('AuthService (Business Logic)', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let refreshTokenRepository: RefreshTokenRepository;

  const mockJwtService = {
    sign: jest.fn(() => faker.string.alpha(32)),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbModule],
      providers: [
        AuthService,
        TokenService,
        GoogleAuthService,
        UserRepository,
        RefreshTokenRepository,
        RefreshTokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userRepository = module.get(UserRepository);
    refreshTokenRepository = module.get(RefreshTokenRepository);
  });

  describe('loginWithGoogle()', () => {
    it('should log in an existing user and return a token pair', async () => {
      const googleUser = seedGoogleUserInfo();

      await userRepository.create({
        ...seedUserData(),
        email: googleUser.email,
      });

      const result = await authService.loginWithGoogle(googleUser);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should create a new user and return a token pair', async () => {
      const googleUser = seedGoogleUserInfo(); // random new email

      const result = await authService.loginWithGoogle(googleUser);

      const user = await userRepository.findOne({ email: googleUser.email });

      expect(user).not.toBeNull();
      expect(user?.email).toBe(googleUser.email);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException if Google email is missing', async () => {
      const googleUser = { ...seedGoogleUserInfo(), email: '' };

      await expect(authService.loginWithGoogle(googleUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken()', () => {
    let userId: string;
    const token = faker.string.alpha(64);

    beforeAll(async () => {
      const user = await userRepository.create(seedUserData());

      userId = user.id;

      await refreshTokenRepository.create(seedRefreshTokenData(userId, token));
    });
    it('should return a new token pair if refresh token is valid', async () => {
      const result = await authService.refreshToken(token);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw if refresh token is invalid', async () => {
      await expect(authService.refreshToken('bad_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if refresh token is expired or revoked', async () => {
      const user = await userRepository.create(seedUserData());
      const rawToken = faker.string.alpha(64);

      await refreshTokenRepository.create({
        ...seedRefreshTokenData(user.id, rawToken),
        isRevoked: true,
      });

      await expect(authService.refreshToken(rawToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout()', () => {
    it('should revoke the provided refresh token', async () => {
      const user = await userRepository.create(seedUserData());
      const rawToken = faker.string.alpha(64);

      const data = seedRefreshTokenData(user.id, rawToken);

      await refreshTokenRepository.create(data);

      await authService.logout(rawToken);

      const revokedToken = await refreshTokenRepository.findOne({
        token: data.token,
      });

      expect(revokedToken?.isRevoked).toBe(true);
    });
  });
});
