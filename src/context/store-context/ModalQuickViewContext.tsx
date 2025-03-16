// modalQuickViewStore.ts
import { create } from "zustand";
import { type ProductType } from "@/types/ProductType";

interface ModalQuickViewState {
  selectedProduct: ProductType | null;
  openQuickView: (product: ProductType) => void;
  closeQuickView: () => void;
}

export const useModalQuickViewStore = create<ModalQuickViewState>((set) => ({
  selectedProduct: null,
  openQuickView: (product: ProductType) => set({ selectedProduct: product }),
  closeQuickView: () => set({ selectedProduct: null }),
}));
