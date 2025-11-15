import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import cookieSession from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (!(global as any).crypto) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    (global as any).crypto = require('crypto');
  }

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Allows listening to events
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: 'product_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: 'payment_queue',
      queueOptions: { durable: false },
    },
  });

  app.getHttpAdapter().getInstance().set('trust proxy', true);

  app.use(
    cookieSession({
      signed: false,
      secure: true,
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.startAllMicroservices();
  const port = process.env.PORT || 4002;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
