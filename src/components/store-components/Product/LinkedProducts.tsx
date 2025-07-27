"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";
import { Star } from "@phosphor-icons/react/dist/ssr";
import type { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface LinkedProductsProps {
  products: Product[];
  currentProductId: string;
}

export default function LinkedProducts({
  products,
  currentProductId,
}: LinkedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t pt-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold capitalize leading-[30px] sm:text-[26px] sm:leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
          Other Ton Variants
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Available in different ton capacities
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className={`group block rounded-lg border transition-all hover:shadow-md ${
              product.id === currentProductId
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-primary/50"
            }`}
          >
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              <Image
                src={product.images[0] ?? "/images/product/1000x1000.png"}
                alt={product.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {product.id === currentProductId && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-white">
                    Current
                  </span>
                </div>
              )}
              {product.sale && (
                <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                  Sale
                </div>
              )}
              {product.new && (
                <div className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
                  New
                </div>
              )}
            </div>

            <div className="p-4">
              <h4 className="mb-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium leading-tight group-hover:text-primary">
                {product.title}
              </h4>

              {product.defaultTon && (
                <div className="mb-2 text-xs text-gray-600">
                  Ton: {product.defaultTon}
                </div>
              )}

              <div className="mb-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    weight="fill"
                    className="text-yellow-400"
                  />
                ))}
                <span className="ml-1 text-xs text-gray-600">(5.0)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.discountedPrice &&
                    product.discountedPrice < product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.discountedPrice)}
                      </span>
                    )}
                </div>

                <Button
                  size="sm"
                  variant={
                    product.id === currentProductId ? "secondary" : "default"
                  }
                  className="text-xs"
                  onClick={(e) => {
                    if (product.id === currentProductId) {
                      e.preventDefault();
                    }
                  }}
                >
                  {product.id === currentProductId ? "Current" : "View"}
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
