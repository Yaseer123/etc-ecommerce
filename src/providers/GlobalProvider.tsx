import { CartProvider } from "@/context/store-context/CartContext";
import { CompareProvider } from "@/context/store-context/CompareContext";
import { ModalCartProvider } from "@/context/store-context/ModalCartContext";
import { ModalCompareProvider } from "@/context/store-context/ModalCompareContext";
import { ModalQuickviewProvider } from "@/context/store-context/ModalQuickviewContext";
import { ModalSearchProvider } from "@/context/store-context/ModalSearchContext";
import { ModalWishlistProvider } from "@/context/store-context/ModalWishlistContext";
import { WishlistProvider } from "@/context/store-context/WishlistContext";

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <CartProvider>
      <ModalCartProvider>
        <WishlistProvider>
          <ModalWishlistProvider>
            <CompareProvider>
              <ModalCompareProvider>
                <ModalSearchProvider>
                  <ModalQuickviewProvider>{children}</ModalQuickviewProvider>
                </ModalSearchProvider>
              </ModalCompareProvider>
            </CompareProvider>
          </ModalWishlistProvider>
        </WishlistProvider>
      </ModalCartProvider>
    </CartProvider>
  );
};

export default GlobalProvider;
