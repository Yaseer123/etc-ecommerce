"use client";

import { readAllImages } from "@/app/actions/file";
import { type CartItem, type Product } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CartItemProp extends CartItem {
  product: Product;
}

interface CartProductItemProps {
  item: CartItemProp;
  removeFromCart: () => void;
}

export default function CartProductItem({
  item,
  removeFromCart,
}: CartProductItemProps) {
  const [productImage, setProductImage] = useState<string | null>(null);
  const product = item.product;
  useEffect(() => {
    readAllImages(product.imageId)
      .then((res) => {
        setProductImage(res[0]?.secure_url ?? null);
      })
      .catch((err) => console.log(err));
  }, [product.imageId]);

  console.log(productImage);

  return (
    <div className="infor flex w-full items-center gap-3">
      <div className="bg-img aspect-square w-[100px] flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={productImage ?? "/images/placeholder-image.png"}
          width={300}
          height={300}
          alt={product.title}
          className="h-full w-full"
        />
      </div>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <div className="name text-button">{product.title}</div>
          <div
            className="remove-cart-btn caption1 cursor-pointer font-semibold text-red underline"
            onClick={() => removeFromCart()}
          >
            Remove
          </div>
        </div>
        {/* <div className="mt-3 flex w-full items-center justify-between gap-2">
          <div className="flex items-center capitalize text-secondary2">
            {product.selectedSize || product.sizes[0]}/
            {product.selectedColor || product.variation[0].color}
          </div>
          <div className="product-price text-title">${product.price}.00</div>
        </div> */}
      </div>
    </div>
  );
}
