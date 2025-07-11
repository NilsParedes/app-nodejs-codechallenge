import { TransactionStatus } from '../entities/transaction.entity';

export class TransactionStatusUpdatedEvent {
  constructor(
    public readonly id: string,
    public readonly status: TransactionStatus,
  ) {}
}