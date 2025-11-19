"use client";

import React, { useEffect, useState } from "react";
import { CurrentUser, Product } from "@/types/types";
import Profile from "@/components/user/Profile";
import { useRouter } from "next/navigation";
import { buildClient } from "@/api/buildClient";

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  const client = buildClient();

  async function fetchData() {
    try {
      const userRes = await client.get(
        `https://soundio.onrender.com/api/users/currentuser`
      );
      const user = userRes.data.currentUser;
      setCurrentUser(user);
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const productsRes = await client.get(
        `https://product-service-fsp5.onrender.com/api/products/my-products/${user.id}`
      );
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Error fetching user or products:", error);
      setCurrentUser(null);
      setProducts([]);
    }
  }

  useEffect(() => {
    fetchData();
  }, [router]);

  return <Profile products={products} />;
};

export default ProfilePage;
