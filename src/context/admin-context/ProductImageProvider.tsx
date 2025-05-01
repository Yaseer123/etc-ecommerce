"use client";

import { readAllImages } from "@/app/actions/file";
import { create } from "zustand";

export type ProductImage = {
  id: string;
  src: string;
};

interface ProductImageStore {
  images: ProductImage[];
  loadImages: (filter: string) => Promise<void>;
  setImages: (images: ProductImage[]) => void;
  updateImages: (images: ProductImage[]) => void;
  removeOldImage: (src: string) => void;
}

export const useProductImageStore = create<ProductImageStore>((set) => ({
  images: [],

  loadImages: async (filter: string) => {
    try {
      const response = await readAllImages(filter);
      set({
        images: response.map((image) => ({
          id: image.public_id,
          src: image.secure_url,
        })),
      });
    } catch (error) {
      console.error("Failed to load images:", error);
    }
  },

  setImages: (images: ProductImage[]) => {
    set({ images });
    // Log for debugging image reordering
    console.log(
      "Images order updated:",
      images.map((img) => img.src),
    );
  },

  updateImages: (newImages: ProductImage[]) => {
    set((state) => ({
      images: [...state.images, ...newImages],
    }));
  },

  removeOldImage: (src: string) => {
    set((state) => ({
      images: state.images.filter((img) => img.src !== src),
    }));
  },
}));
