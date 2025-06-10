"use client";

import { useCartStore } from "@/context/store-context/CartContext";
import { useModalCartStore } from "@/context/store-context/ModalCartContext";
import { useModalQuickViewStore } from "@/context/store-context/ModalQuickViewContext";
import { useModalWishlistStore } from "@/context/store-context/ModalWishlistContext";
import { api } from "@/trpc/react";
import { Eye, Heart, ShoppingBagOpen } from "@phosphor-icons/react/dist/ssr";
import { type Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface ProductProps {
  data: Product;
  style?: string;
}

export default function Product({ data }: ProductProps) {
  const { openModalCart } = useModalCartStore();
  const { openModalWishlist } = useModalWishlistStore();
  const { openQuickView } = useModalQuickViewStore();
  const { addToCart } = useCartStore();
  const { data: session } = useSession(); // Check if the user is logged in

  const utils = api.useUtils();

  const { data: wishlist = [] } = api.wishList.getWishList.useQuery(undefined, {
    enabled: !!session?.user, // Only fetch wishlist if the user is logged in
  });

  const addToWishlistMutation = api.wishList.addToWishList.useMutation({
    onMutate: async ({ productId }) => {
      // Cancel outgoing refetch to avoid overwriting optimistic update
      await utils.wishList.getWishList.cancel();

      // Get current wishlist data
      const previousWishlist = utils.wishList.getWishList.getData();

      // Check if item already exists to prevent duplicates
      if (!previousWishlist?.some((item) => item.id === productId)) {
        // Optimistically update the wishlist by adding the new item with correct structure
        utils.wishList.getWishList.setData(undefined, (old) => {
          if (!old) return [];
          // Create proper wishlist item structure with product property
          return [
            ...old,
            {
              id: productId,
              product: data,
              userId: session?.user.id ?? "temp-user",
              createdAt: new Date(),
              productId: productId,
            },
          ];
        });
      }

      return { previousWishlist };
    },
    onError: (err, variables, context) => {
      // If mutation fails, revert back to the previous state
      if (context?.previousWishlist) {
        utils.wishList.getWishList.setData(undefined, context.previousWishlist);
      }
    },
    onSettled: async () => {
      // Sync with the server once mutation is settled (success or error)
      await utils.wishList.getWishList.invalidate();
    },
  });

  const removeFromWishlistMutation =
    api.wishList.removeFromWishList.useMutation({
      onMutate: async ({ productId }) => {
        await utils.wishList.getWishList.cancel();
        const previousWishlist = utils.wishList.getWishList.getData();

        // Optimistically update the wishlist by removing the item
        utils.wishList.getWishList.setData(undefined, (old) => {
          if (!old) return [];
          return old.filter((item) => item.id !== productId);
        });

        return { previousWishlist };
      },
      onError: (err, variables, context) => {
        if (context?.previousWishlist) {
          utils.wishList.getWishList.setData(
            undefined,
            context.previousWishlist,
          );
        }
      },
      onSettled: async () => {
        await utils.wishList.getWishList.invalidate();
      },
    });

  const isInWishlist = (itemId: string): boolean => {
    // Make sure we're checking against the correct property based on wishlist structure
    return wishlist.some(
      (item) => item.id === itemId || item.product?.id === itemId,
    );
  };

  const handleAddToCart = () => {
    addToCart(data);
    openModalCart();
  };

  const handleAddToWishlist = () => {
    if (!session?.user) {
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingWishlistProductId", data.id);
        localStorage.setItem("openWishlistModalAfterLogin", "true");
      }
      openModalWishlist();
      return;
    }

    if (isInWishlist(data.id)) {
      removeFromWishlistMutation.mutate({ productId: data.id });
    } else {
      // Check for duplicates before adding
      if (!wishlist.some((item) => item.id === data.id)) {
        addToWishlistMutation.mutate({ productId: data.id });
      }
    }

    openModalWishlist();
  };

  // Add this effect to handle pending wishlist after login
  useEffect(() => {
    if (session?.user && typeof window !== "undefined") {
      const pendingId = localStorage.getItem("pendingWishlistProductId");
      const shouldOpenModal = localStorage.getItem(
        "openWishlistModalAfterLogin",
      );
      if (pendingId) {
        if (!isInWishlist(pendingId)) {
          addToWishlistMutation.mutate({ productId: pendingId });
        }
        localStorage.removeItem("pendingWishlistProductId");
      }
      if (shouldOpenModal === "true") {
        openModalWishlist();
        localStorage.removeItem("openWishlistModalAfterLogin");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  const handleQuickViewOpen = () => {
    openQuickView(data);
  };

  // Calculate discount percentage if discounted price is available
  const discountPercentage = data.discountedPrice
    ? Math.round(((data.price - data.discountedPrice) / data.price) * 100)
    : 0;

  return (
    <div className="product-item style-marketplace h-full rounded-2xl border border-line p-4 transition-all duration-300 hover:shadow-md">
      <div className="bg-img relative w-full">
        {/* Sale badge */}
        {data.discountedPrice && (
          <div className="bg-red-500 absolute left-2 -top-3 z-10 rounded-full px-2 py-1 text-xs font-bold text-white">
            -{discountPercentage}%
          </div>
        )}

        <Link href={`/products/${data.slug}?id=${data.id}`}>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              className="aspect-square w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105"
              width={5000}
              height={5000}
              src={data.images?.[0] ?? "/images/products/1000x1000.png"}
              alt={data.title}
            />
        
          </div>
        </Link>
        <div className="list-action absolute right-1 top-1 flex flex-col gap-2">
          <button
            className={`add-wishlistState-btn box-shadow-sm flex h-9 w-9 items-center justify-center rounded-full bg-white transition-all duration-300 hover:bg-gray-100 ${
              isInWishlist(data.id) ? "active bg-pink-50" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToWishlist();
            }}
          >
            {isInWishlist(data.id) ? (
              <Heart
                size={18}
                weight="fill"
                className="text-red-500 cursor-pointer"
              />
            ) : (
              <Heart size={18} className="cursor-pointer" />
            )}
            <div className="tag-action caption2 invisible absolute right-full mr-2 whitespace-nowrap rounded-sm bg-black px-1.5 py-0.5 text-white opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
              {isInWishlist(data.id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </div>
          </button>

          <button
            className="quick-view-btn box-shadow-sm flex h-9 w-9 items-center justify-center rounded-full bg-white transition-all duration-300 hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickViewOpen();
            }}
          >
            <Eye size={18} />
            <div className="tag-action caption2 invisible absolute right-full mr-2 whitespace-nowrap rounded-sm bg-black px-1.5 py-0.5 text-white opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
              Quick View
            </div>
          </button>
          <button
            className="add-cart-btn box-shadow-sm flex h-9 w-9 items-center justify-center rounded-full bg-white transition-all duration-300 hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            <ShoppingBagOpen size={18} />
            <div className="tag-action caption2 invisible absolute right-full mr-2 whitespace-nowrap rounded-sm bg-black px-1.5 py-0.5 text-white opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
              Add To Cart
            </div>
          </button>
        </div>
      </div>
      <div className="product-info mt-4 flex flex-col">
        <Link
          href={`/products/${data.slug}?id=${data.id}`}
          className="flex-grow"
        >
          <h3 className="text-title line-clamp-2 h-12 cursor-pointer text-sm font-medium hover:underline">
            {data.title}
          </h3>
        </Link>

        <div className="mt-auto flex items-center">
          {data.discountedPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-title discounted-price font-bold">
                ৳{data.discountedPrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ৳{data.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-title font-bold">
              ৳{data.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
