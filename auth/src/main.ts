import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://soundio.vercel.app',
      'https://soundio-rx70.onrender.com',
      'https://soundio-1.onrender.com',
    ],
    credentials: true,
  });

  app.getHttpAdapter().getInstance().set('trust proxy', true); // Trust proxy for secure cookies behind proxies/load balancers

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  console.log('Starting up Auth...');
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
