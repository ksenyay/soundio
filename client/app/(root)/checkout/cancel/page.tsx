"use client";

import { buildClient } from "@/api/buildClient";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CancelPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [productId, setProductId] = useState();
  const cookie = document.cookie;
  const client = buildClient(cookie);

  async function handleCancelledCase() {
    const res = await client.post(
      `https://payment-service-itru.onrender.com/api/payments/cancelled`,
      {
        sessionId,
      },
      { withCredentials: true }
    );

    setProductId(res.data.productId);
  }

  useEffect(() => {
    handleCancelledCase();
  });
  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white/5 rounded-2xl border border-white/10 shadow-lg text-center">
      <h2 className="text-2xl font-bold text-red-500 mb-6">
        Payment Cancelled
      </h2>
      <p className="text-gray-400">
        Your payment was not completed. You can try again or return to the
        product page.
      </p>
      {productId ? (
        <Link href={`/product/${productId}`}>Go back</Link>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default CancelPage;
