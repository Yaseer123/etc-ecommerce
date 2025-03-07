"use client";

import { type ProductType } from "@/types/ProductType";
// WishlistContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
} from "react";

interface Wishlist {
  wishlistArray: ProductType[];
}

type WishlistAction =
  | { type: "ADD_TO_WISHLIST"; payload: ProductType }
  | { type: "REMOVE_FROM_WISHLIST"; payload: string }
  | { type: "LOAD_WISHLIST"; payload: ProductType[] };

interface WishlistContextProps {
  wishlist: Wishlist;
  addToWishlist: (item: ProductType) => void;
  removeFromWishlist: (itemId: string) => void;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(
  undefined,
);

const WishlistReducer = (
  state: Wishlist,
  action: WishlistAction,
): Wishlist => {
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      const newItem: ProductType = { ...action.payload };
      return {
        ...state,
        wishlistArray: [...state.wishlistArray, newItem],
      };
    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlistArray: state.wishlistArray.filter(
          (item) => item.id !== action.payload,
        ),
      };
    case "LOAD_WISHLIST":
      return {
        ...state,
        wishlistArray: action.payload,
      };
    default:
      return state;
  }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlist, dispatch] = useReducer(WishlistReducer, {
    wishlistArray: [],
  });

  const addToWishlist = (item: ProductType) => {
    dispatch({ type: "ADD_TO_WISHLIST", payload: item });
  };

  const removeFromWishlist = (itemId: string) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: itemId });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
