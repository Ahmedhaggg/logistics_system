import { TokenService } from './token.service';
import { GoogleAuthService } from './googleAuth.service';
import { Injectable } from '@nestjs/common';
import { GoogleUserInfo } from '../types/googleAuthUser.type';
import { Role } from '@core/users/entities/user_role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async loginWithGoogle(googleUser: GoogleUserInfo): Promise<TokenPair & { onboardingRequired: boolean }> {
    const user = await this.googleAuthService.login(googleUser);
    const tokens = await this.tokenService.generateTokenPair(
      user,
      user.roles.map((role) => role.role as Role),
    );
    return { ...tokens, onboardingRequired: user.onboardingRequired };
  }

  async refreshToken(token: string): Promise<TokenPair> {
    const user = await this.tokenService.validateAndRotateRefreshToken(token);
    return this.tokenService.generateTokenPair(
      user,
      user.roles as Role[],
    );
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }
}
