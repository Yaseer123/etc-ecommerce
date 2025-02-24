"use client";

import { create } from "zustand";
import { readAllImages } from "../actions/file";
import { v4 as uuid } from "uuid";

export interface ProductImage {
  id: string;
  src: string;
}

interface ProductImageStore {
  images: ProductImage[];
  loadImages: (filter: string) => Promise<void>; // Load images with optional filter
  setImages: (images: { id: string; src: string }[]) => void;
  updateImages: (images: string[]) => void;
  removeOldImage: (src: string) => void;
}

export const useProductImageStore = create<ProductImageStore>((set) => ({
  images: [],

  // Load images from API (optionally with filter)
  loadImages: async (filter: string) => {
    try {
      const images = await readAllImages(filter);
      images.map((image) => {
        set((state) => ({
          images: [...state.images, { id: uuid(), src: image }],
        }));
      });
      //   set({ images });
    } catch (error) {
      console.error("Failed to load images:", error);
    }
  },

  setImages: (images: ProductImage[]) => {
    set({ images });
  },

  // Add new images
  updateImages: (newImages) => {
    newImages.map((image) => {
      set((state) => ({
        images: [...state.images, { id: uuid(), src: image }],
      }));
    });
    // set((state) => ({ images: [...state.images, ] }));
  },

  // Remove image by source
  removeOldImage: (src) => {
    set((state) => ({
      images: state.images.filter((img) => img.src !== src),
    }));
  },
}));
