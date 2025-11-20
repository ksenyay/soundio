"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { buildClient } from "@/api/buildClient";

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

interface CurrentUser {
  email: string;
}

const Checkout = ({ id }: { id: string }) => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>();

  const client = buildClient();

  async function fetchOrder() {
    try {
      const res = await client.get(
        `https://soundio-nfng.onrender.com/api/orders/${id}`
      );
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchCurrentUser() {
    try {
      const res = await client.get(
        `https://soundio.onrender.com/api/users/currentuser`
      );
      setCurrentUser(res.data.currentUser);
    } catch (err) {
      setCurrentUser(null);
      console.error(err);
    }
  }

  async function cancelOrder() {
    await client.patch(
      `https://soundio-nfng.onrender.com/api/orders/${id}`,
      {}
    );
    router.back();
  }

  async function handleCheckout() {
    if (!order || !currentUser) return;
    try {
      setLoading(true);
      const res = await client.post(
        `https://payment-service-itru.onrender.com/api/payments/checkout`,
        {
          orderId: order.id,
          email: currentUser.email,
        }
      );
      window.location.href = res.data.url;
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrder();
    fetchCurrentUser();
  }, [id]);

  if (!order || !currentUser) {
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
