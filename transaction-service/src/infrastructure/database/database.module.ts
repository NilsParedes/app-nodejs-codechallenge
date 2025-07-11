import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/entities/transaction-type.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'transaction_db',
      entities: [Transaction, TransactionType],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Transaction, TransactionType]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}