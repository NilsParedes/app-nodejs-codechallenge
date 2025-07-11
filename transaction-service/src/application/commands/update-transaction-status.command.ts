import { TransactionStatus } from '../../domain/entities/transaction.entity';

export class UpdateTransactionStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: TransactionStatus,
  ) {}
}