import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly refreshTokenRepo: RefreshTokenRepository) {}

  async generate(userId: string): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex');
    const hashed = this.hash(token);
    const expiresAt = this.calculateExpiry();

    await this.refreshTokenRepo.create({ userId, token: hashed, expiresAt });

    return token;
  }

  async validateAndRotate(rawToken: string): Promise<string> {
    const hashed = this.hash(rawToken);
    const token = await this.refreshTokenRepo.findOne({
      token: hashed,
      isRevoked: false,
    });

    if (!token || token.expiresAt < new Date())
      throw new UnauthorizedException('Refresh token invalid or expired');

    await this.revoke(rawToken);

    return token.userId;
  }

  async revoke(rawToken: string): Promise<void> {
    const hashed = this.hash(rawToken);
    await this.refreshTokenRepo.update({ token: hashed }, { isRevoked: true });
  }

  private hash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private calculateExpiry(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  }
}
