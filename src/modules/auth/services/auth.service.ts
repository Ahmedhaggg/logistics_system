import { UserRepository } from '@module/users/user.repository';
import { TokenService } from './token.service';
import { GoogleAuthService } from './googleAuth.service';
import { Injectable } from '@nestjs/common';
import { GoogleUserInfo } from '../types/googleAuthUser.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async loginWithGoogle(googleUser: GoogleUserInfo): Promise<TokenPair> {
    const user = await this.googleAuthService.login(googleUser);
    return this.tokenService.generateTokenPair(user);
  }

  async refreshToken(token: string): Promise<TokenPair> {
    const user = await this.tokenService.validateAndRotateRefreshToken(token);
    return this.tokenService.generateTokenPair(user);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }
}
