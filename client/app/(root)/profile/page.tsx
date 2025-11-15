import { buildClient } from "@/api/buildClient";
import { CurrentUser } from "@/types/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Product } from "@/types/types";
import Profile from "@/components/user/Profile";

const ProfilePage = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const client = buildClient(sessionCookie);

  let currentUser: CurrentUser | null = null;
  let products: Product[] = [];

  try {
    const userRes = await client.get(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/api/users/currentuser`
    );
    currentUser = userRes.data.currentUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    currentUser = null;
  }

  if (!currentUser) {
    redirect("/auth/login");
  }

  try {
    const productsRes = await client.get(
      `${process.env.NEXT_PUBLIC_PRODUCT_URL}/api/products/my-products/${currentUser.id}`
    );
    products = productsRes.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    products = [];
  }

  return <Profile products={products} />;
};

export default ProfilePage;
