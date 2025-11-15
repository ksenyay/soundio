"use client";

import React, { useEffect, useState } from "react";
import { CurrentUser, Product } from "@/types/types";
import Profile from "@/components/user/Profile";
import { useRouter } from "next/navigation";
import axios from "axios";

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await axios.get(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/api/users/currentuser`,
          { withCredentials: true }
        );
        const user = userRes.data.currentUser;
        setCurrentUser(user);
        if (!user) {
          router.push("/auth/login");
          return;
        }
        const productsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_PRODUCT_URL}/api/products/my-products/${user.id}`,
          { withCredentials: true }
        );
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Error fetching user or products:", error);
        setCurrentUser(null);
        setProducts([]);
      }
    }
    fetchData();
  }, [router]);

  return <Profile products={products} />;
};

export default ProfilePage;
