import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}