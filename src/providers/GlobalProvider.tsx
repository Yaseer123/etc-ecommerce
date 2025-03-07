import { CartProvider } from "@/context/store-context/CartContext";
import { ModalCartProvider } from "@/context/store-context/ModalCartContext";
import { ModalQuickViewProvider } from "@/context/store-context/ModalQuickViewContext";
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
            <ModalSearchProvider>
              <ModalQuickViewProvider>{children}</ModalQuickViewProvider>
            </ModalSearchProvider>
          </ModalWishlistProvider>
        </WishlistProvider>
      </ModalCartProvider>
    </CartProvider>
  );
};

export default GlobalProvider;
