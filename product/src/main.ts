import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import cookieSession from 'cookie-session';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/api/products/uploads', express.static(join('/', 'uploads')));

  app.getHttpAdapter().getInstance().set('trust proxy', true);

  app.enableCors({
    origin: 'https://soundio.vercel.app',
    credentials: true,
  });

  app.use(
    cookieSession({
      signed: false,
      secure: true,
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 4001);
}
bootstrap();
