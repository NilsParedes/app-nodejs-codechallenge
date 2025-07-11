import { Module } from '@nestjs/common';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { AntiFraudService } from './application/services/anti-fraud.service';

@Module({
  imports: [KafkaModule],
  providers: [AntiFraudService],
})
export class AppModule {}
