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
import axios from "axios";

type ProductPageProps = {
  id: string;
  isLoggedIn: boolean;
  userId: string | null;
};

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

const ProductPage = ({ id, isLoggedIn, userId }: ProductPageProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);

  async function fetchData() {
    try {
      if (!product) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_PRODUCT_URL}/api/products/${id}`,
          { withCredentials: true }
        );
        setProduct(response.data);
        return;
      }

      if (userId && product) {
        if (userId === product.userId) {
          setIsPurchased(true);
          return;
        }
        const res = await axios.get(
          `https://soundio.onrender.com/api/orders/users/${userId}`,
          { withCredentials: true }
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

  useEffect(() => {
    fetchData();
  }, [userId, id, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-5">
        <h1 className="text-lg text-neutral-500">Product not found.</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* Hero Image */}
      <div className="relative w-full mb-8">
        <Image
          src={product.imageUrl}
          alt="Waterfall sounds"
          width={1200}
          height={400}
          className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />

        {/* Breadcrumb overlay */}
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
          {/* Product Header */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-start">
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
              {(() => {
                const categoryColors: Record<
                  string,
                  { bg: string; text: string }
                > = {
                  Nature: { bg: "bg-green-500/20", text: "text-green-400" },
                  Urban: { bg: "bg-blue-500/20", text: "text-blue-400" },
                  Noise: { bg: "bg-red-500/20", text: "text-red-400" },
                  Seasonal: { bg: "bg-orange-500/20", text: "text-orange-400" },
                  Meditation: {
                    bg: "bg-purple-500/20",
                    text: "text-purple-400",
                  },
                  Ambient: { bg: "bg-teal-500/20", text: "text-teal-400" },
                };
                const cat = product.category
                  ? product.category.charAt(0).toUpperCase() +
                    product.category.slice(1)
                  : "";
                const color = categoryColors[cat];
                if (!color) return null;
                return (
                  <span
                    className={`${color.bg} ${color.text} px-3 py-1 rounded-full text-xs font-medium`}
                  >
                    {cat}
                  </span>
                );
              })()}
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                {product.downloads}
              </span>
            </div>
          </div>

          {/* Audio Player */}
          <AudioPlayer
            product={{
              id: product.id,
              title: product.title,
              fileUrl: product.fileUrl,
              duration: product.duration,
            }}
            isPurchased={isPurchased}
          />

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Description</h2>
            <p className="text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors"
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
