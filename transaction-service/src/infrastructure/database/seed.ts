import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from '../../domain/entities/transaction-type.entity';
import { v4 as uuidv4 } from 'uuid';

async function bootstrap() {
  const logger = new Logger('Seed');
  const app = await NestFactory.create(AppModule);

  const transactionTypeRepository = app.get<Repository<TransactionType>>(getRepositoryToken(TransactionType));

  const count = await transactionTypeRepository.count();

  if (count === 0) {
    logger.log('Seeding transaction types...');

    const transactionTypeNames = [
      'TRANSFER',
      'DEPOSIT',
      'PAYMENT',
      'REFUND',
      'CHARGE',
      'SUBSCRIPTION',
      'INTERNATIONAL_TRANSFER'
    ];

    const transactionTypes = transactionTypeNames.map(name => ({ id: uuidv4(), name }));

    for (const typeData of transactionTypes) {
      const transactionType = transactionTypeRepository.create(typeData);
      await transactionTypeRepository.save(transactionType);
      logger.log(`Created transaction type: ${transactionType.id} - ${transactionType.name}`);
    }

    logger.log(`Successfully seeded`);
  } else {
    logger.log('Transaction types already exist, skipping seed');
  }

  await app.close();
}

bootstrap();