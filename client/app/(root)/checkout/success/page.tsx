"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { buildClient } from "@/api/buildClient";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [productId, setProductId] = useState();

  const client = buildClient();

  async function handleSuccessCase() {
    console.log(sessionId);
    const res = await client.post(
      `https://payment-service-itru.onrender.com/api/payments/success`,
      {
        sessionId,
      }
    );

    setProductId(res.data.productId);
  }

  useEffect(() => {
    handleSuccessCase();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white/5 rounded-2xl border border-white/10 shadow-lg text-center">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Payment Successful!
      </h2>
      <p className="text-gray-400 mb-4">Thank you for your purchase.</p>
      {productId ? (
        <Link href={`/product/${productId}`}>Go back</Link>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default SuccessPage;
