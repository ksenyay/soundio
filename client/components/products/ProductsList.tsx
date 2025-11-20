"use client";

import React, { useEffect, useState } from "react";
import Card from "./Card";
import Pagination from "./Pagination";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/types";
import { buildClient } from "@/api/buildClient";
import Spinner from "./Spinner";

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const showPurchased = searchParams.get("purchased") === "true";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 8;

  const client = buildClient();

  const fetchAll = async () => {
    try {
      setLoading(true);

      const userReq = client
        .get("https://soundio.onrender.com/api/users/currentuser")
        .catch(() => null);

      const params: Record<string, string | number> = { page, limit };
      if (category && category.toLowerCase() !== "all categories")
        params.category = category.toLowerCase();
      if (search) params.search = search.toLowerCase();

      const productsReq = client.get(
        "https://product-service-fsp5.onrender.com/api/products",
        { params }
      );

      const [userRes, productsRes] = await Promise.all([userReq, productsReq]);

      const currentUserId = userRes?.data?.currentUser?.id || null;

      let fetchedProducts = productsRes.data.products;
      let fetchedTotalPages = productsRes.data.totalPages;

      if (showPurchased && currentUserId) {
        const ordersRes = await client.get(
          `https://soundio-nfng.onrender.com/api/orders/users/${currentUserId}`
        );

        const purchasedIds = ordersRes.data.map(
          (order: { product: Product }) => order.product.id
        );

        fetchedProducts = fetchedProducts.filter((p: Product) =>
          purchasedIds.includes(p.id)
        );

        fetchedTotalPages = 1;
      }

      setProducts(fetchedProducts);
      setTotalPages(fetchedTotalPages);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [category, search, showPurchased, page]);

  if (loading) return <Spinner />;

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
