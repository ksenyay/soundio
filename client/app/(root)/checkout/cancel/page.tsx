"use client";

import { buildClient } from "@/api/buildClient";
import { PAYMENT_BASE_URL } from "@/constants/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CancelPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [productId, setProductId] = useState();

  const client = buildClient();

  async function handleCancelledCase() {
    const res = await client.post(`${PAYMENT_BASE_URL}/api/payments/cancel`, {
      sessionId,
    });

    setProductId(res.data.productId);
  }

  useEffect(() => {
    handleCancelledCase();
  }, []);
  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white/5 rounded-2xl border border-white/10 shadow-lg text-center">
      <h2 className="text-2xl font-bold text-red-500 mb-6">
        Payment Cancelled
      </h2>
      <p className="text-gray-400 mb-2">
        Your payment was not completed. You can try again or return to the
        product page.
      </p>
      <div>
        <Link href="/">Go back</Link>
      </div>
    </div>
  );
};

export default CancelPage;
