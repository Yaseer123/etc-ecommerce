// cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ProductType } from "@/types/ProductType";
import { v4 as uuid } from "uuid";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productId: string;
  coverImage: string;
}

interface CartState {
  cartArray: CartItem[];
  addToCart: (item: ProductType) => void;
  removeFromCart: (itemId: string) => void;
  updateCart: (itemId: string, quantity: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartArray: [],

      addToCart: (item: ProductType) =>
        set((state) => ({
          cartArray: [
            ...state.cartArray,
            {
              // ...item,
              quantity: 1,
              id: uuid(),
              productId: item.id,
              name: item.name,
              price: item.price,
              coverImage: item.images[0]!,
            },
          ],
        })),

      removeFromCart: (itemId: string) =>
        set((state) => ({
          cartArray: state.cartArray.filter((item) => item.id !== itemId),
        })),

      updateCart: (itemId: string, quantity: number) =>
        set((state) => ({
          cartArray: state.cartArray.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                }
              : item,
          ),
        })),
    }),
    {
      name: "cart-storage", // unique name for localStorage
    },
  ),
);
