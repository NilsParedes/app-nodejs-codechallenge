import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionQuery } from '../get-transaction.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { Repository } from 'typeorm';
import { Logger, NotFoundException } from '@nestjs/common';
import { TransactionResponseDto, TransactionStatusDto, TransactionTypeDto } from '../../dtos/transaction-response.dto';
import { TransactionType } from '../../../domain/entities/transaction-type.entity';

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler implements IQueryHandler<GetTransactionQuery> {
  private readonly logger = new Logger(GetTransactionHandler.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async execute(query: GetTransactionQuery): Promise<TransactionResponseDto> {
    this.logger.log(`Getting transaction with ID: ${query.id}`);

    const transaction = await this.transactionRepository.findOne({ where: { id: query.id } });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${query.id} not found`);
    }

    const transactionType = await this.transactionTypeRepository.findOne({
      where: { id: transaction.transferTypeId },
    });

    if (!transactionType) {
      throw new NotFoundException(`Transaction type with ID ${transaction.transferTypeId} not found`);
    }

    return {
      transactionExternalId: transaction.id,
      transactionType: {
        name: transactionType.name,
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}