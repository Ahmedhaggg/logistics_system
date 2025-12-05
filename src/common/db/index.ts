import { Global, Module } from '@nestjs/common';
import { dbProvider } from './provider';
import { SharedModule } from '@shared/config.module';

@Global()
@Module({
  imports: [SharedModule],
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule {}
