import { buildClient } from "@/api/buildClient";
import ProductPage from "@/components/products/ProductPage";
import { CurrentUser } from "@/types/types";
import { cookies } from "next/headers";

export default async function Home({ params }: { params: { id: string } }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const client = buildClient(sessionCookie);
  let isLoggedIn = false;

  let currentUser: CurrentUser | null = null;

  try {
    const userRes = await client.get(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/api/users/currentuser`,
      { withCredentials: true }
    );
    currentUser = userRes.data.currentUser;

    if (currentUser) {
      isLoggedIn = true;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    currentUser = null;
  }

  return (
    <div className="page-container mt-0">
      <ProductPage
        id={id}
        isLoggedIn={isLoggedIn}
        userId={currentUser?.id ?? null}
      />
    </div>
  );
}
