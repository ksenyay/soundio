"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/types";
import { useRouter } from "next/navigation";
import { buildClient } from "@/api/buildClient";

const Profile = ({ products }: { products: Product[] }) => {
  const [productList, setProductList] = useState(products);
  const router = useRouter();

  const client = buildClient();

  async function handleDelete(id: string) {
    await client.delete(
      `https://product-service-fsp5.onrender.com/api/products/${id}`,
      {
        withCredentials: true,
      }
    );
    setProductList(productList.filter((p) => p.id !== id));
  }

  function handleRedirect(id: string) {
    router.push(`/product/${id}`);
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 rounded-2xl border border-white/10 bg-transparent">
      <h2 className="text-2xl font-bold text-primary mb-8 tracking-tight">
        My Sounds
      </h2>
      <div className="space-y-2">
        {productList.length !== 0 ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
            <p className="text-lg font-medium mb-5 text-gray-500">
              No sounds added yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
