import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer, KafkaMessage } from 'kafkajs';
import { AntiFraudService } from '../../application/services/anti-fraud.service';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly consumer: Consumer;
  private readonly logger = new Logger(KafkaService.name);

  constructor(private antiFraudService: AntiFraudService) {
    this.kafka = new Kafka({
      clientId: 'anti-fraud-service',
      brokers: ['localhost:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'anti-fraud-service-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();

    await this.consumer.subscribe({
      topics: ['transaction-created'],
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
      if (!message.value) throw new Error('Message value is null');
      const parsedMessage = JSON.parse(message.value.toString());

      if (topic === 'transaction-created') {
        this.logger.log(`Processing transaction: ${JSON.stringify(parsedMessage)}`);
        const result = this.antiFraudService.validateTransaction(parsedMessage);

        await this.emit('transaction-status-updated', {
          id: parsedMessage.id,
          status: result
        });
      }
    } catch (error) {
      this.logger.error(`Error handling message: ${error.message}`, error.stack);
    }
  }
}