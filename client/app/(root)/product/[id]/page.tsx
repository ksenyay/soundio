import { buildClient } from "@/api/buildClient";
import ProductPage from "@/components/products/ProductPage";
import { CurrentUser } from "@/types/types";

const Product = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  const client = buildClient();
  let isLoggedIn = false;

  let currentUser: CurrentUser | null = null;

  try {
    const userRes = await client.get(
      `https://soundio.onrender.com/api/users/currentuser`
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
};

export default Product;
