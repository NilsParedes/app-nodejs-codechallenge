import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { AntiFraudService } from '../../application/services/anti-fraud.service';

@Module({
  providers: [KafkaService, AntiFraudService],
  exports: [KafkaService],
})
export class KafkaModule {}