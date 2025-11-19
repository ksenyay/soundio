import React from "react";
import Checkout from "@/components/products/Checkout";
import { CurrentUser } from "@/types/types";
import { buildClient } from "@/api/buildClient";

const CheckoutPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const client = buildClient();

  let currentUser: CurrentUser | null = null;

  try {
    const userRes = await client.get(
      `https://soundio.onrender.com/api/users/currentuser`
    );
    currentUser = userRes.data.currentUser;

    if (!currentUser) {
      return;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    currentUser = null;
  }

  return (
    <>
      <Checkout id={id} email={currentUser!.email} />
    </>
  );
};

export default CheckoutPage;
