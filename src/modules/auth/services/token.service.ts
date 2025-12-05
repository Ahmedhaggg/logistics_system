import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from './refreshToken.service';
import { UserRepository } from '@module/users/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@module/users/entities/user.entity';

@Injectable()
export class TokenService {
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 7;

  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userRepository: UserRepository,
  ) {}

  async generateTokenPair(user: User): Promise<TokenPair> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.refreshTokenService.generate(user.id);
    return { accessToken, refreshToken };
  }

  async validateAndRotateRefreshToken(token: string): Promise<User> {
    const userId = await this.refreshTokenService.validateAndRotate(token);

    const user = await this.userRepository.findById(userId);

    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenService.revoke(token);
  }
}
