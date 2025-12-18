import { Global, Module } from '@nestjs/common';
import { dbProvider } from './provider';
import { SharedModule } from '@shared/config.module';
import { TransactionManager } from './transaction-manager';

@Global()
@Module({
  imports: [SharedModule],
  providers: [dbProvider, TransactionManager],
  exports: [dbProvider, TransactionManager],
})
export class DbModule {}
