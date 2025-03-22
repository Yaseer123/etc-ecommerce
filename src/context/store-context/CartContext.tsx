// cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ProductType } from "@/types/ProductType";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  id: string;
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
        set((state) => {
          const existingItem = state.cartArray.find((cartItem) => cartItem.id === item.id);
          if (existingItem) {
            return state; // Return unchanged state if item exists
          }
          return {
            cartArray: [
              ...state.cartArray,
              {
                quantity: 1,
                id: item.id,
                name: item.name,
                price: item.price,
                coverImage: item.images[0]!,
              },
            ],
          };
        }),

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
