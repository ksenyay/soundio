import React from "react";
import Checkout from "@/components/products/Checkout";

const CheckoutPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <>
      <Checkout id={id} />
    </>
  );
};

export default CheckoutPage;
