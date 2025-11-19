"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BarChart3 } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import Sidebar from "./Sidebar";
import { buildClient } from "@/api/buildClient";

type Product = {
  id: string;
  description: string;
  title: string;
  imageUrl: string;
  fileUrl: string;
  price: number;
  username: string;
  downloads: number;
  category: string;
  tags: [];
  duration: string;
  size: string;
  userId: string;
};

const ProductPage = ({ id }: { id: string }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const client = buildClient();

  async function fetchData(userId?: string) {
    try {
      if (!product) {
        const response = await client.get(
          `https://product-service-fsp5.onrender.com/api/products/${id}`
        );
        setProduct(response.data);
        return;
      }

      if (userId && product) {
        if (userId === product.userId) {
          setIsPurchased(true);
          return;
        }

        const res = await client.get(
          `https://soundio-nfng.onrender.com/api/orders/users/${userId}`
        );

        const userProducts = res.data;

        setIsPurchased(
          userProducts.some(
            (order: { product: { id: string } }) => order.product.id === id
          )
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function checkAuth() {
    try {
      const userRes = await client.get(
        `https://soundio.onrender.com/api/users/currentuser`
      );

      const currentUser = userRes.data.currentUser;

      setIsLoggedIn(!!currentUser);

      return currentUser ?? null;
    } catch (error) {
      console.error("Error fetching user:", error);
      setIsLoggedIn(false);
      return null;
    }
  }

  useEffect(() => {
    async function load() {
      const user = await checkAuth();
      await fetchData(user?.id);
    }

    load();
  }, [id, product]);

  if (!product) {
    return <div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* Hero Image */}
      <div className="relative w-full mb-8">
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={1200}
          height={400}
          className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />

        <div className="absolute bottom-6 left-6">
          <Breadcrumb>
            <BreadcrumbList className="text-white">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="text-white/80 hover:text-white"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">Product</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {product.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              By{" "}
              <span className="font-semibold text-white">
                {product.username}
              </span>
            </span>

            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>

            <span className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              {product.downloads}
            </span>
          </div>

          <AudioPlayer
            product={{
              id: product.id,
              title: product.title,
              fileUrl: product.fileUrl,
              duration: product.duration,
            }}
            isPurchased={isPurchased}
          />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Description</h2>
            <p className="text-gray-300">{product.description}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar
          isLoggedIn={isLoggedIn}
          product={product}
          isPurchased={isPurchased}
        />
      </div>
    </div>
  );
};

export default ProductPage;
