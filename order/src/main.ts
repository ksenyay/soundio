import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import cookieSession from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://soundio.vercel.app',
    credentials: true,
  });

  if (!(global as any).crypto) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    (global as any).crypto = require('crypto');
  }

  // Allows listening to events
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_URL!],
      queue: 'product_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_URL!],
      queue: 'payment_queue',
      queueOptions: { durable: false },
    },
  });

  app.getHttpAdapter().getInstance().set('trust proxy', true);

  if (process.env.NODE_ENV === 'production') {
    app.use(
      cookieSession({
        signed: false,
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 12 * 60 * 60 * 1000,
      }),
    );
  } else {
    app.use(
      cookieSession({
        signed: false,
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 12 * 60 * 60 * 1000,
      }),
    );
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.startAllMicroservices();
  const port = process.env.PORT || 4002;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
