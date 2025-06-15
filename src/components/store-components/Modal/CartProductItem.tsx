"use client";

import { useCartStore } from "@/context/store-context/CartContext";
import Image from "next/image";

interface CartItemProp {
  price: number;
  quantity: number;
  id: string;
  name: string;
  coverImage: string;
  discountedPrice?: number;
}

interface CartProductItemProps {
  item: CartItemProp;
}

export default function CartProductItem({ item }: CartProductItemProps) {
  const { removeFromCart } = useCartStore();
  return (
    <div className="w-full items-center gap-3">
      <div className="bg-img aspect-square w-[100px] flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={item.coverImage ?? "/images/placeholder-image.png"}
          width={300}
          height={300}
          alt={item.name}
          className="h-full w-full"
        />
      </div>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <div className="name text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
            {item.name}
          </div>
          <div
            className="cursor-pointer text-base font-semibold leading-[22] text-red-500 underline md:text-[13px] md:leading-5"
            onClick={() => removeFromCart(item.id)}
          >
            Remove
          </div>
        </div>
        {/* <div className="mt-3 flex w-full items-center justify-between gap-2">
          <div className="flex items-center capitalize text-secondary2">
            {item.selectedSize || item.sizes[0]}/
            {item.selectedColor || item.variation[0].color}
          </div>
          <div className="item-price text-title">৳{item.discountedPrice ?? item.price}.00</div>
        </div> */}
      </div>
    </div>
  );
}
