// cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type ProductType } from "@/types/ProductType";

interface CartItem extends ProductType {
  quantity: number;
  selectedSize: string;
  selectedColor?: string;
}

interface CartState {
  cartArray: CartItem[];
  addToCart: (item: ProductType) => void;
  removeFromCart: (itemId: string) => void;
  updateCart: (
    itemId: string,
    quantity: number,
    selectedSize: string,
    selectedColor?: string
  ) => void;
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
              ...item,
              quantity: 1,
              selectedSize: "",
              selectedColor: ""
            }
          ]
        })),
      
      removeFromCart: (itemId: string) => 
        set((state) => ({
          cartArray: state.cartArray.filter(item => item.id !== itemId)
        })),
      
      updateCart: (itemId: string, quantity: number, selectedSize: string, selectedColor?: string) => 
        set((state) => ({
          cartArray: state.cartArray.map(item => 
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  selectedSize,
                  selectedColor
                }
              : item
          )
        }))
    }),
    {
      name: 'cart-storage', // unique name for localStorage
    }
  )
);