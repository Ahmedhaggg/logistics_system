import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from './refreshToken.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@core/users/repositories/user.repository';
import { User } from '@core/users/entities/user.entity';
import { Role, UserRole } from '@core/users/entities/user_role.entity';
import { UserRoleRepository } from '@core/users/repositories/user-role.repository';

@Injectable()
export class TokenService {
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 7;

  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  async generateTokenPair(user: User, roles: Role[]): Promise<TokenPair> {
    const payload = { sub: user.id, email: user.email, roles };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.refreshTokenService.generate(user.id);
    return { accessToken, refreshToken };
  }

  async validateAndRotateRefreshToken(
    token: string,
  ): Promise<User & { roles: UserRole[] }> {
    const userId = await this.refreshTokenService.validateAndRotate(token);

    const user = await this.userRepository.findById(userId);

    if (!user) throw new UnauthorizedException('User not found');
    const roles = await this.userRoleRepository.findRolesByUserId(userId);
    return { ...user, roles };
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenService.revoke(token);
  }
}
