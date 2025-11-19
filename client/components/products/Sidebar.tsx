"use client";

import { Clock, FileAudio, HardDrive, Shield } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { buildClient } from "@/api/buildClient";

const Sidebar = ({
  product,
  isLoggedIn,
  isPurchased,
}: {
  product: {
    id: string;
    price: number;
    duration: string;
    size: string;
    fileUrl: string;
  };
  isLoggedIn: boolean;
  isPurchased: boolean;
}) => {
  const router = useRouter();

  const client = buildClient();

  async function handlePurchase(id: string) {
    if (isLoggedIn) {
      const order = await client.post(
        `https://soundio-nfng.onrender.com/api/orders`,
        {
          productId: id,
        }
      );
      console.log(order.data);

      if (order) {
        router.push(`/checkout/${order.data.id}`);
      }
    } else {
      router.push("/auth/login");
    }
  }

  return (
    <div className="space-y-6">
      {/* Purchase Card */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 sticky top-6">
        <div className="space-y-6">
          {/* Price */}
          <div className="text-center pb-4 border-b border-white/10">
            <div className="text-3xl font-bold text-primary mb-2">
              ${product.price}
            </div>
            <p className="text-sm text-gray-400">One-time purchase</p>
          </div>

          {/* Technical Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Technical Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Duration</span>
                </div>
                <span className="font-medium">{product.duration}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <HardDrive className="w-4 h-4" />
                  <span>File Size</span>
                </div>
                <span className="font-medium">{product.size}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <FileAudio className="w-4 h-4" />
                  <span>Format</span>
                </div>
                <span className="font-medium">
                  {product.fileUrl.slice(-3).toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span>License</span>
                </div>
                <span className="font-medium text-green-400">Commercial</span>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90 font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-102"
            onClick={() => handlePurchase(product.id)}
            disabled={isPurchased}
          >
            {isPurchased ? "In Library" : "Purchase"}
          </Button>

          {/* License Info */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="font-medium text-green-400">
                Commercial License
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Use in any project without attribution requirements. Perfect for
              commercial use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
