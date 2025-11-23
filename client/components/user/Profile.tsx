"use client";

import React, { useEffect, useState } from "react";
import Spinner from "../products/Spinner";
import Image from "next/image";
import { CurrentUser, Product } from "@/types/types";
import { useRouter } from "next/navigation";
import { buildClient } from "@/api/buildClient";
import { toast } from "sonner";
import { AUTH_BASE_URL, PRODUCT_BASE_URL } from "@/constants/constants";

const Profile = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const client = buildClient();

  async function handleDelete(id: string) {
    await client.delete(`${PRODUCT_BASE_URL}/api/products/${id}`, {
      withCredentials: true,
    });
    setProductList(productList.filter((p) => p.id !== id));
    toast.success("Sound removed successfully!");
  }

  function handleRedirect(id: string) {
    router.push(`/product/${id}`);
  }

  async function fetchData() {
    setLoading(true);
    try {
      const userRes = await client.get(
        `${AUTH_BASE_URL}/api/users/currentuser`
      );
      const user = userRes.data.currentUser;
      setCurrentUser(user);
      if (!user) {
        router.push("/auth/login");
        setLoading(false);
        return;
      }
      const productsRes = await client.get(
        `${PRODUCT_BASE_URL}/api/products/my-products/${user.id}`
      );
      setProductList(productsRes.data);
    } catch (error) {
      console.error("Error fetching user or products:", error);
      setCurrentUser(null);
      setProductList([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 rounded-2xl border border-white/10 bg-transparent">
      <h2 className="text-2xl font-bold text-primary mb-8 tracking-tight">
        My Sounds
      </h2>
      {loading && <Spinner />}
      <div className="space-y-2">
        {!loading && productList.length !== 0 ? (
          productList.map((product: Product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border-b border-white/10 py-3"
            >
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => handleRedirect(product.id)}
              >
                <Image
                  src={product.imageUrl}
                  alt={`Sound ${product.title}`}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded object-cover border border-white/10 bg-white/10"
                  loading="lazy"
                />
                <span className="text-white font-medium">{product.title}</span>
                <span className="text-xs text-gray-400 ml-2">
                  {product.duration}
                </span>
              </div>
              <button
                className="px-2 py-1 text-gray-400 hover:text-primary border border-white/10 rounded transition-colors text-xs"
                type="button"
                aria-label="Remove sound"
                onClick={() => handleDelete(product.id)}
              >
                Remove
              </button>
            </div>
          ))
        ) : !loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
            <p className="text-lg font-medium mb-5 text-gray-500">
              No sounds added yet
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
