import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from '@shared/config.module';
import { AppConfigService } from '@shared/config/config.service';
import { UsersModule } from '../users/users.module';
import { AuthService } from './services/auth.service';
import { GoogleAuthService } from './services/googleAuth.service';
import { RefreshTokenService } from './services/refreshToken.service';
import { TokenService } from './services/token.service';
import { AuthController } from './auth.controller';
import { RefreshTokenRepository } from './repositories/refreshToken.repository';
import { GoogleStrategy } from './stratgies/google.startgy';
import { JwtStrategy } from './stratgies/jwt.stratgy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    RefreshTokenRepository,
    GoogleAuthService,
    TokenService,
    RefreshTokenService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
