import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderSchema } from '../db/order.schema';
import { ProductSchema } from '../db/product.schema';
import { CurrentUserMiddleware, RequireAuthMiddleware } from './middleware';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'ORDER_RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URL!],
          queue: 'order_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware, RequireAuthMiddleware)
      .forRoutes(
        { path: '/api/orders', method: RequestMethod.GET },
        { path: '/api/orders/:id', method: RequestMethod.GET },
        { path: '/api/orders', method: RequestMethod.POST },
        { path: '/api/orders/:id', method: RequestMethod.PATCH },
        { path: '/api/orders/users/:id', method: RequestMethod.GET },
      );
  }
}
