import { Injectable, Logger } from '@nestjs/common';

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger(AntiFraudService.name);
  private readonly THRESHOLD = 1000;

  validateTransaction(transaction: { id: string; value: number }): TransactionStatus {
    const { id, value } = transaction;
    this.logger.log(`Validating transaction ${id} with value ${value}`);

    if (value > this.THRESHOLD) {
      this.logger.log(
        `Transaction ${id} REJECTED: value ${value} exceeds threshold ${this.THRESHOLD}`,
      );
      return TransactionStatus.REJECTED;
    }

    this.logger.log(
      `Transaction ${id} APPROVED: value ${value} is within threshold ${this.THRESHOLD}`,
    );
    return TransactionStatus.APPROVED;
  }
}
