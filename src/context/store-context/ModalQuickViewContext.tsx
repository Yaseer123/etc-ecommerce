"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { type ProductType } from "@/types/ProductType";

interface ModalQuickViewContextProps {
  children: ReactNode;
}

interface ModalQuickViewContextValue {
  selectedProduct: ProductType | null;
  openQuickView: (product: ProductType) => void;
  closeQuickView: () => void;
}

const ModalQuickViewContext = createContext<
  ModalQuickViewContextValue | undefined
>(undefined);

export const ModalQuickViewProvider: React.FC<ModalQuickViewContextProps> = ({
  children,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );

  const openQuickView = (product: ProductType) => {
    setSelectedProduct(product);
  };

  const closeQuickView = () => {
    setSelectedProduct(null);
  };

  return (
    <ModalQuickViewContext.Provider
      value={{ selectedProduct, openQuickView, closeQuickView }}
    >
      {children}
    </ModalQuickViewContext.Provider>
  );
};

export const useModalQuickViewContext = () => {
  const context = useContext(ModalQuickViewContext);
  if (!context) {
    throw new Error(
      "useModalQuickViewContext must be used within a ModalQuickViewProvider",
    );
  }
  return context;
};
