import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from '../create-transaction.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionCreatedEvent } from '../../../domain/events/transaction-created.event';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {
  private readonly logger = new Logger(CreateTransactionHandler.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private eventBus: EventBus,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<Transaction> {
    this.logger.log(`Creating transaction with value: ${command.value}`);

    const transaction = this.transactionRepository.create({
      accountExternalIdDebit: command.accountExternalIdDebit,
      accountExternalIdCredit: command.accountExternalIdCredit,
      transferTypeId: command.transferTypeId,
      value: command.value,
    });

    this.logger.log(`Attempting to save transaction to database: ${JSON.stringify(transaction)}`);
    const savedTransaction = await this.transactionRepository.save(transaction);
    this.logger.log(`Transaction successfully saved to database with ID: ${savedTransaction.id}`);

    this.eventBus.publish(
      new TransactionCreatedEvent(
        savedTransaction.id,
        savedTransaction.accountExternalIdDebit,
        savedTransaction.accountExternalIdCredit,
        savedTransaction.value,
        savedTransaction.transferTypeId,
      ),
    );

    return savedTransaction;
  }
}