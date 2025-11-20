import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from '../db/order.schema';
import { CurrentUserMiddleware, RequireAuthMiddleware } from './middleware';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentSchema } from '../db/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'Payment', schema: PaymentSchema },
    ]),
    ClientsModule.register([
      {
        name: 'PAYMENT_RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://ibglnivy:2lagOO2N7brPbJvN03h9_VmqkLMKojNH@kebnekaise.lmq.cloudamqp.com/ibglnivy',
          ],
          queue: 'payment_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware, RequireAuthMiddleware)
      .forRoutes({ path: '/api/payments', method: RequestMethod.POST });
  }
}
