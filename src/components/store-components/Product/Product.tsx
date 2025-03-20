"use client";
import Image from "next/image";
import { type ProductType } from "@/types/ProductType";
import { useRouter } from "next/navigation";
import { Heart, Eye, ShoppingBagOpen } from "@phosphor-icons/react/dist/ssr";
import Rate from "../Rate";
import { api } from "@/trpc/react";
import { useModalCartStore } from "@/context/store-context/ModalCartContext";
import { useModalWishlistStore } from "@/context/store-context/ModalWishlistContext";
import { useModalQuickViewStore } from "@/context/store-context/ModalQuickViewContext";
import { useCartStore } from "@/context/store-context/CartContext";

interface ProductProps {
  data: ProductType;
  type: string;
  style?: string;
}
type WishlistItem = {
  id: string;
  name: string;
};
export default function Product({ data, type }: ProductProps) {
  const { openModalCart } = useModalCartStore();
  const { openModalWishlist } = useModalWishlistStore();
  const { openQuickView } = useModalQuickViewStore();
  const { addToCart } = useCartStore();

  const utils = api.useUtils();

  const [wishlistResponse] = api.wishList.getWishList.useSuspenseQuery();
  const wishlist: WishlistItem[] = wishlistResponse ?? [];

  const addToWishlistMutation = api.wishList.addToWishList.useMutation({
    onSuccess: async () => {
      await utils.wishList.getWishList.invalidate();
    },
  });

  const removeFromWishlistMutation =
    api.wishList.removeFromWishList.useMutation({
      onSuccess: async () => {
        await utils.wishList.getWishList.invalidate();
      },
    });

  // Create a safe check function for wishlist items
  const isInWishlist = (itemId: string): boolean => {
    return wishlist.some((item: { id: string }) => item?.id === itemId);
  };

  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(data);
    openModalCart();
  };

  const handleAddToWishlist = () => {
    if (isInWishlist(data.id)) {
      // **Optimistic UI Update: Remove item immediately**
      utils.wishList.getWishList.setData(
        undefined,
        (old) => old?.filter((item) => item.id !== data.id) ?? [],
      );

      removeFromWishlistMutation.mutate(
        { productId: data.id },
        {
          onError: () => {
            // **Rollback on failure**
            void utils.wishList.getWishList.invalidate();
          },
        },
      );
    } else {
      // **Optimistic UI Update: Add item immediately**
      utils.wishList.getWishList.setData(undefined, (old) => [
        ...(old ?? []),
        data, // Add complete product data
      ]);

      addToWishlistMutation.mutate(
        { productId: data.id },
        {
          onError: () => {
            // **Rollback on failure**
            void utils.wishList.getWishList.invalidate();
          },
        },
      );
    }

    openModalWishlist();
  };

  const handleQuickViewOpen = () => {
    openQuickView(data);
  };

  const handleDetailProduct = (productId: string) => {
    router.push(`/products/${data.slug}?id=${productId}`);
  };

  return (
    <>
      {type === "marketplace" && (
        <div
          className="product-item style-marketplace rounded-2xl border border-line p-4"
          onClick={() => handleDetailProduct(data.id)}
        >
          <div className="bg-img relative w-full">
            <Image
              className="aspect-square w-full"
              width={5000}
              height={5000}
              src={data.images[0] ?? ""}
              alt="img"
            />
            <div className="list-action absolute right-0 top-0 flex flex-col gap-1">
              <span
                className={`add-wishlistState-btn box-shadow-sm flex h-8 w-8 items-center justify-center rounded-full bg-white duration-300 ${isInWishlist(data.id) ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist();
                }}
              >
                {isInWishlist(data.id) ? (
                  <>
                    <Heart size={18} weight="duotone" className="text-black" />
                  </>
                ) : (
                  <>
                    <Heart size={18} />
                  </>
                )}
                <div className="tag-action caption2 rounded-sm bg-black px-1.5 py-0.5 text-white">
                  Add To wishlist
                </div>
              </span>

              <span
                className="quick-view-btn box-shadow-sm flex h-8 w-8 items-center justify-center rounded-full bg-white duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickViewOpen();
                }}
              >
                <Eye />
                <div className="tag-action caption2 rounded-sm bg-black px-1.5 py-0.5 text-white">
                  Quick View
                </div>
              </span>
              <span
                className="add-cart-btn box-shadow-sm flex h-8 w-8 items-center justify-center rounded-full bg-white duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
              >
                <ShoppingBagOpen />
                <div className="tag-action caption2 rounded-sm bg-black px-1.5 py-0.5 text-white">
                  Add To Cart
                </div>
              </span>
            </div>
          </div>
          <div className="product-infor mt-4">
            <span className="text-title">{data.name}</span>
            <div className="mt-1 flex gap-0.5">
              <Rate currentRate={data.rate} size={16} />
            </div>
            <span className="text-title mt-1 inline-block">
              ${data.price}.00
            </span>
          </div>
        </div>
      )}
    </>
  );
}
