import React from "react";
import Checkout from "@/components/products/Checkout";
import { CurrentUser } from "@/types/types";
import { cookies } from "next/headers";
import { buildClient } from "@/api/buildClient";

const CheckoutPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const client = buildClient(sessionCookie);

  let currentUser: CurrentUser | null = null;

  try {
    const userRes = await client.get(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/api/users/currentuser`,
      { withCredentials: true }
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
