import React from "react";
import Categories from "./Categories";
import { cookies } from "next/headers";
import { buildClient } from "@/api/buildClient";
import ProductsList from "./ProductsList";

const Products = async () => {
  let userId: string | null = null;

  try {
    const client = buildClient();
    const { data } = await client.get(
      `https://soundio.onrender.com/api/users/currentuser`
    );
    userId = data?.currentUser?.id || null;
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Featured Sounds</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover our curated collection of premium audio files perfect for
          relaxation, focus, and creative projects.
        </p>
      </div>

      {/* Categories */}
      <Categories isUser={!!userId} />

      {/* Products  */}
      <ProductsList />
    </div>
  );
};

export default Products;
