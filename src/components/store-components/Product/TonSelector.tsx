"use client";

import { formatPrice } from "@/utils/format";
import type { Product } from "@prisma/client";
import Link from "next/link";

interface TonSelectorProps {
  products: Product[];
  currentProductId: string;
  currentProductTon?: string | null;
}

export default function TonSelector({
  products,
  currentProductId,
  currentProductTon,
}: TonSelectorProps) {
  if (!products || products.length === 0) {
    return null;
  }

  // Group products by ton
  const tonGroups = products.reduce(
    (acc, product) => {
      const ton = product.defaultTon ?? "Standard";
      if (!acc[ton]) {
        acc[ton] = [];
      }
      acc[ton].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  return (
    <div className="mb-6">
      <h4 className="mb-3 text-sm font-medium text-gray-700">
        Available Ton Variants:
      </h4>
      <div className="flex flex-wrap gap-2">
        {Object.entries(tonGroups).map(([ton, tonProducts]) => {
          const currentProduct = tonProducts.find(
            (p) => p.id === currentProductId,
          );
          const isCurrentTon = currentProductTon === ton;

          return (
            <div key={ton} className="flex flex-col">
              <span className="mb-1 text-xs font-medium text-gray-600">
                {ton}
              </span>
              <div className="flex gap-1">
                {tonProducts.map((product) => {
                  const isCurrent = product.id === currentProductId;
                  const isAvailable = product.stock > 0;

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-all ${
                        isCurrent
                          ? "bg-primary text-white"
                          : isAvailable
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "cursor-not-allowed bg-gray-50 text-gray-400"
                      }`}
                      onClick={(e) => {
                        if (isCurrent || !isAvailable) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <span>{formatPrice(product.price)}</span>
                      {!isAvailable && (
                        <span className="text-xs">(Out of Stock)</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
