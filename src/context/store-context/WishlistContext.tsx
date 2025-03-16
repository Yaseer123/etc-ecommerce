// wishlistStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type ProductType } from "@/types/ProductType";

interface WishlistState {
  wishlistArray: ProductType[];
  addToWishlist: (item: ProductType) => void;
  removeFromWishlist: (itemId: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      wishlistArray: [],
      
      addToWishlist: (item: ProductType) => 
        set((state) => ({
          wishlistArray: [...state.wishlistArray, { ...item }]
        })),
      
      removeFromWishlist: (itemId: string) => 
        set((state) => ({
          wishlistArray: state.wishlistArray.filter(item => item.id !== itemId)
        })),
    }),
    {
      name: 'wishlist-storage', // unique name for localStorage
    }
  )
);