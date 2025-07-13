import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { TransactionsModule } from './transaction/transaction.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    UserModule,
    AuthModule,
    ProductModule,
    TransactionsModule,
  ],
})
export class AppModule {}
