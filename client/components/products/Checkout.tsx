"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Product {
  id: string;
  title: string;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  status: string;
  expiresAt?: Date;
  product: Product;
}

const Checkout = ({ id, email }: { id: string; email: string }) => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchOrder() {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_ORDER_URL}/api/orders/${id}`,
        {
          withCredentials: true,
        }
      );
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function cancelOrder() {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_ORDER_URL}/api/orders/${id}`,
      {},
      { withCredentials: true }
    );
    router.back();
  }

  async function handleCheckout() {
    if (!order) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_PAYMENT_URL}/api/payments/checkout`,
        {
          orderId: order.id,
          email,
        },
        { withCredentials: true }
      );
      window.location.href = res.data.url;
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (!order) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white/5 rounded-2xl border border-white/10 shadow-lg">
        <p className="text-center text-gray-400">Loading order...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white/5 rounded-2xl border border-white/10 shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">
        Checkout
      </h2>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Product:</span>
          <span className="text-white font-medium">
            {order.product.title || "Sample Sound"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Price:</span>
          <span className="text-primary font-bold text-lg">
            ${order.product.price.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex mt-8">
        <Button
          variant="outline"
          className="self-start mr-auto rounded-sm"
          onClick={cancelOrder}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCheckout}
          className="ml-auto rounded-sm"
          disabled={loading}
        >
          {loading ? "Redirecting..." : "Pay with Stripe"}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
