import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductSchema } from '../db/schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';

import { CurrentUserMiddleware } from './middleware';
import { RequireAuthMiddleware } from './middleware';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StorageService } from '../storage/storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    // Allows emitting events
    ClientsModule.register([
      {
        name: 'PRODUCT_RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URL!],
          queue: 'product_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, StorageService],
})

// Auth middleware
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware, RequireAuthMiddleware)
      .forRoutes(
        { path: 'api/products', method: RequestMethod.POST },
        { path: 'api/products/:id', method: RequestMethod.PATCH },
        { path: 'api/products/:id', method: RequestMethod.DELETE },
        { path: 'api/products/my-products/:id', method: RequestMethod.GET },
        { path: 'api/products/downloads/:id', method: RequestMethod.PATCH },
      );
  }
}
