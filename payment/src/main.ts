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

  // Allows listening to events
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_URL!],
      queue: 'order_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

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

  app.getHttpAdapter().getInstance().set('trust proxy', true);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 4003);
}
bootstrap();
