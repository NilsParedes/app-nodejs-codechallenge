import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer, KafkaMessage } from 'kafkajs';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateTransactionStatusCommand } from '../../application/commands/update-transaction-status.command';
import { TransactionStatus } from '../../domain/entities/transaction.entity';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly consumer: Consumer;
  private readonly logger = new Logger(KafkaService.name);

  constructor(private commandBus: CommandBus) {
    this.kafka = new Kafka({
      clientId: 'transaction-service',
      brokers: ['localhost:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'transaction-service-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();

    await this.consumer.subscribe({
      topics: ['transaction-status-updated'],
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.logger.log(`Received message from topic ${topic}: ${message.value?.toString() ?? 'null'}`);
        await this.handleMessage(topic, message);
      },
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async emit(topic: string, message: any) {
    this.logger.log(`Emitting message to topic ${topic}: ${JSON.stringify(message)}`);
    return this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  private async handleMessage(topic: string, message: KafkaMessage) {
    try {
      if (!message.value) {
        throw new Error('Message value is null or undefined');
      }
      const parsedMessage = JSON.parse(message.value.toString());

      if (topic === 'transaction-status-updated') {
        await this.commandBus.execute(
          new UpdateTransactionStatusCommand(
            parsedMessage.id,
            parsedMessage.status as TransactionStatus,
          ),
        );
      }
    } catch (error) {
      this.logger.error(`Error handling message: ${error.message}`, error.stack);
    }
  }
}