import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransactionCreatedEvent } from '../../../domain/events/transaction-created.event';
import { KafkaService } from '../../../infrastructure/kafka/kafka.service';
import { Logger } from '@nestjs/common';

@EventsHandler(TransactionCreatedEvent)
export class TransactionCreatedHandler implements IEventHandler<TransactionCreatedEvent> {
  private readonly logger = new Logger(TransactionCreatedHandler.name);

  constructor(private kafkaService: KafkaService) {}

  async handle(event: TransactionCreatedEvent) {
    this.logger.log(`Publishing transaction created event for transaction ${event.id}`);
    
    await this.kafkaService.emit('transaction-created', {
      id: event.id,
      accountExternalIdDebit: event.accountExternalIdDebit,
      accountExternalIdCredit: event.accountExternalIdCredit,
      value: event.value,
      transferTypeId: event.transferTypeId,
    });
  }
}