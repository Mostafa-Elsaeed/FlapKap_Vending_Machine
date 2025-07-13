import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/product.entity';
import { UserEntity } from 'src/user/user.entity';
import { TransactionsController } from './transaction.controller';
import { TransactionsService } from './transaction.service';
import { TransactionEntity } from './transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProductEntity, TransactionEntity]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
