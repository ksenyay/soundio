import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../db/order.schema';
import { Payment, PaymentDocument } from '../db/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { stripe } from '../stripe/stripe';
import { ClientProxy } from '@nestjs/microservices';
import { OrderStatus } from '../types/types';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Order.name) private orders: Model<OrderDocument>,
    @InjectModel(Payment.name) private payments: Model<PaymentDocument>,
    @Inject('PAYMENT_RABBITMQ_SERVICE')
    private readonly paymentClient: ClientProxy,
  ) {}

  async handleCheckoutSession(payload: CreatePaymentDto) {
    console.log('received payment', payload);
    const { orderId, email } = payload;

    const order = await this.orders.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    if (order.status === OrderStatus.Cancelled)
      throw new Error('Order is cancelled');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: order.title },
            unit_amount: Math.round(order.price * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      client_reference_id: order.id,
      metadata: { orderId: order.id },
      success_url: `https://soundio-1.onrender.com/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://soundio-1.onrender.com/checkout/cancel`,
    });

    return { url: session.url };
  }

  async markOrderAsPaid(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('stripe session', session);

    if (!session) {
      throw new NotFoundException();
    }
    const orderId = session.metadata?.orderId;
    const stripeId = session.id;

    const order = await this.orders.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    order.status = OrderStatus.Complete;
    await order.save();

    this.paymentClient.emit('payment.complete', { orderId: order.id });

    await this.payments.create({ orderId, stripeId });

    return { productId: order.productId };
  }

  async markOrderAsCancelled(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      throw new NotFoundException();
    }
    const orderId = session.metadata?.orderId;

    const order = await this.orders.findById(orderId).exec();

    if (!order) throw new NotFoundException('Order not found');

    order.status = OrderStatus.Cancelled;

    await order.save();

    this.paymentClient.emit('payment.cancelled', { orderId: order.id });

    return { productId: order.productId };
  }
}
