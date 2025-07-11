import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  await app.listen(3001);
  logger.log('Anti-fraud service is running on: http://localhost:3001');
}
bootstrap();
