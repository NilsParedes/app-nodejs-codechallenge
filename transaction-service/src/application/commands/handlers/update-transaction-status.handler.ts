import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTransactionStatusCommand } from '../update-transaction-status.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionStatusUpdatedEvent } from '../../../domain/events/transaction-status-updated.event';
import { Logger, NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateTransactionStatusCommand)
export class UpdateTransactionStatusHandler implements ICommandHandler<UpdateTransactionStatusCommand> {
  private readonly logger = new Logger(UpdateTransactionStatusHandler.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private eventBus: EventBus,
  ) {}

  async execute(command: UpdateTransactionStatusCommand): Promise<Transaction> {
    this.logger.log(`Updating transaction ${command.id} status to ${command.status}`);

    const transaction = await this.transactionRepository.findOne({ where: { id: command.id } });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${command.id} not found`);
    }

    transaction.status = command.status;
    const updatedTransaction = await this.transactionRepository.save(transaction);

    this.eventBus.publish(
      new TransactionStatusUpdatedEvent(
        updatedTransaction.id,
        updatedTransaction.status,
      ),
    );

    return updatedTransaction;
  }
}