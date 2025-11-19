"use client";

import React, { useEffect, useState } from "react";
import Card from "./Card";
import Pagination from "./Pagination";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/types";
import { buildClient } from "@/api/buildClient";

type ProductsListProps = {
  userId: string | null;
};

const ProductsList = ({ userId }: ProductsListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const showPurchased = searchParams.get("purchased") === "true";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 8;

  const client = buildClient();

  async function fetchProducts() {
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };
      if (category && category.toLowerCase() !== "all categories")
        params.category = category.toLowerCase();
      if (search) params.search = search.toLowerCase();

      const resProducts = await client.get(
        `https://product-service-fsp5.onrender.com/api/products`,
        { params }
      );
      let allProducts = resProducts.data.products;
      let total = resProducts.data.totalPages;

      if (showPurchased && userId) {
        const resOrders = await client.get(
          `https://soundio-nfng.onrender.com/api/orders/users/${userId}`
        );
        const purchasedIds = resOrders.data.map(
          (order: { product: Product }) => order.product.id
        );
        allProducts = allProducts.filter((product: Product) =>
          purchasedIds.includes(product.id)
        );
        total = 1;
      }

      setProducts(allProducts);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [category, search, showPurchased, page, userId]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
        {products && products.length !== 0 ? (
          products.map((product) => <Card key={product.id} card={product} />)
        ) : (
          <div className="col-span-full text-center text-gray-400 py-20 md:py-40">
            No products found.
          </div>
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} />
    </>
  );
};

export default ProductsList;
