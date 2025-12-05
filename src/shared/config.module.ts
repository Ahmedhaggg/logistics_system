import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfigService } from './config/config.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [SharedModule],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService, JwtModule],
})
export class SharedModule {}
