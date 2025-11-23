import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://soundio-1.onrender.com'],
    credentials: true,
  });

  // Allows listening to events
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://mcbsdwbh:fs1vrrrRs6jBvmgL398xGVujan89w273@kebnekaise.lmq.cloudamqp.com/mcbsdwbh',
      ],
      queue: 'order_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.getHttpAdapter().getInstance().set('trust proxy', true);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 4003);
}
bootstrap();
