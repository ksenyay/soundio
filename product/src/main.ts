import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import cookieSession from 'cookie-session';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://soundio.vercel.app', 'https://soundio-rx70.onrender.com'],
    credentials: true,
  });

  app.use('/api/products/uploads', express.static(join('/', 'uploads')));

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

  await app.listen(process.env.PORT ?? 4001);
}
bootstrap();
