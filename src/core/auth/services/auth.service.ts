import { UserRepository } from '@core/users/repositories/user.repository';
import { TokenService } from './token.service';
import { GoogleAuthService } from './googleAuth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GoogleUserInfo } from '../types/googleAuthUser.type';
import { Role } from '@core/users/entities/user_role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly userRepository: UserRepository,
  ) {}

  async loginWithGoogle(googleUser: GoogleUserInfo): Promise<TokenPair> {
    const user = await this.googleAuthService.login(googleUser);
    return this.tokenService.generateTokenPair(user, user.roles.map(role => role.role as Role));
  }

  async refreshToken(token: string): Promise<TokenPair> {
    const user = await this.tokenService.validateAndRotateRefreshToken(token);
    return this.tokenService.generateTokenPair(user, user.roles.map(role => role.role as Role));
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }


}
