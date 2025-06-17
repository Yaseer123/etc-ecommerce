"use client";

import { useCartStore } from "@/context/store-context/CartContext";
import { useModalCartStore } from "@/context/store-context/ModalCartContext";
import { useModalQuickViewStore } from "@/context/store-context/ModalQuickViewContext";
import { useModalWishlistStore } from "@/context/store-context/ModalWishlistContext";
import { api } from "@/trpc/react";
import type { ProductType, ProductWithCategory } from "@/types/ProductType";
import { Eye, Heart, ShoppingBagOpen } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface ProductProps {
  data: ProductType | ProductWithCategory;
  style?: string;
}

// Helper for stockStatus
// const validStockStatuses = ["IN_STOCK", "OUT_OF_STOCK", "PRE_ORDER"] as const;
// type StockStatus = (typeof validStockStatuses)[number];

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
    onMutate: async ({ productId: _productId }) => {
      // Cancel outgoing refetch to avoid overwriting optimistic update
      await utils.wishList.getWishList.cancel();

      // Get current wishlist data
      const previousWishlist = utils.wishList.getWishList.getData();

      // Check if item already exists to prevent duplicates
      // (No optimistic update for adding, only for removal)

      return { previousWishlist };
    },
    onError: (err: unknown, variables, context) => {
      // If mutation fails, revert back to the previous state
      if (context?.previousWishlist) {
        utils.wishList.getWishList.setData(undefined, context.previousWishlist);
      }
      // Optionally log error safely
      if (err instanceof Error) {
        console.error(err.message);
      }
    },
    onSettled: async () => {
      // Sync with the server once mutation is settled (success or error)
      await utils.wishList.getWishList.invalidate();
    },
  });

  const removeFromWishlistMutation =
    api.wishList.removeFromWishList.useMutation({
      onMutate: async ({ productId: _productId }) => {
        await utils.wishList.getWishList.cancel();
        const previousWishlist = utils.wishList.getWishList.getData();

        // Optimistically update the wishlist by removing the item
        utils.wishList.getWishList.setData(undefined, (old) => {
          if (!old) return [];
          return old.filter((item) => item.id !== _productId);
        });

        return { previousWishlist };
      },
      onError: (err: unknown, variables, context) => {
        if (context?.previousWishlist) {
          utils.wishList.getWishList.setData(
            undefined,
            context.previousWishlist,
          );
        }
        // Optionally log error safely
        if (err instanceof Error) {
          console.error(err.message);
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
    // Map Product to CartItem
    const cartItem = {
      id: data.id,
      productId: data.id,
      name:
        "title" in data && data.title
          ? data.title
          : "name" in data && data.name
            ? data.name
            : "",
      price: data.price,
      discountedPrice:
        "discountedPrice" in data
          ? (data.discountedPrice ?? undefined)
          : undefined,
      quantity: 1,
      coverImage:
        "images" in data && Array.isArray(data.images) && data.images[0]
          ? data.images[0]
          : "",
      sku: "sku" in data ? (data.sku ?? "") : "",
      color: undefined,
      size: undefined,
    };
    addToCart(cartItem);
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
    openQuickView({
      ...data,
      discountedPrice: data.discountedPrice ?? null,
      stock: typeof data.stock === "number" ? data.stock : 0,
      stockStatus: ["IN_STOCK", "OUT_OF_STOCK", "PRE_ORDER"].includes(
        data.stockStatus ?? "",
      )
        ? data.stockStatus
        : "IN_STOCK",
      defaultColor: data.defaultColor ?? null,
      defaultColorHex: data.defaultColorHex ?? null,
      defaultSize: data.defaultSize ?? null,
      estimatedDeliveryTime: data.estimatedDeliveryTime ?? null,
      categoryId: data.categoryId ?? null,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
    });
  };

  // Calculate discount percentage if discounted price is available
  const discountPercentage =
    data.discountedPrice != null
      ? Math.round(((data.price - data.discountedPrice) / data.price) * 100)
      : 0;

  // Calculate amount saved if discounted price is available
  const amountSaved =
    data.discountedPrice != null ? data.price - data.discountedPrice : 0;

  return (
    <div className="product-item style-marketplace h-full min-h-[300px] rounded-[.25rem] border border-[#ddd] bg-white p-4 pt-5 transition-all duration-300 hover:shadow-md focus:border-[#ddd]">
      <div className="bg-img relative w-full pt-6">
        {/* Save badge with amount and percentage */}
        {discountPercentage > 0 && amountSaved > 0 && (
          <div
            className="marks"
            style={{
              fontFamily: '"Trebuchet MS", sans-serif',
              lineHeight: 1.15,
              fontSize: 14,
              position: "absolute",
              top: -12,
              left: -18,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <span
              className="mark"
              style={{
                background: "#F97316",
                color: "#fff",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                padding: "0px 8px",
                fontWeight: 700,
                marginBottom: 2,
                display: "inline-block",
              }}
            >
              Save: {amountSaved.toLocaleString()}৳ (-{discountPercentage}%)
            </span>
          </div>
        )}

        <Link href={`/products/${data.slug}?id=${data.id}`}>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              className="aspect-square w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105"
              width={5000}
              height={5000}
              src={
                typeof data === "object" &&
                "images" in data &&
                Array.isArray(data.images) &&
                typeof data.images[0] === "string" &&
                data.images[0]
                  ? data.images[0]
                  : "/images/products/1000x1000.png"
              }
              alt={"title" in data ? data.title : data.name}
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
                className="cursor-pointer text-red-500"
              />
            ) : (
              <Heart size={18} className="cursor-pointer" />
            )}
            <div className="tag-action caption2 invisible absolute right-full mr-2 whitespace-nowrap rounded-sm bg-black px-1.5 py-0.5 text-white opacity-0 transition-opacity duration-300 hover:bg-black/75 group-hover:visible group-hover:opacity-100">
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
            <div className="tag-action caption2 invisible absolute right-full mr-2 whitespace-nowrap rounded-sm bg-black px-1.5 py-0.5 text-white opacity-0 transition-opacity duration-300 hover:bg-black/75 group-hover:visible group-hover:opacity-100">
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
            <div className="tag-action caption2 invisible absolute right-full mr-2 whitespace-nowrap rounded-sm bg-black px-1.5 py-0.5 text-white opacity-0 transition-opacity duration-300 hover:bg-black/75 group-hover:visible group-hover:opacity-100">
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
            {"title" in data ? data.title : data.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-center">
          {"stockStatus" in data && data.stockStatus === "OUT_OF_STOCK" ? (
            <span className="font-bold text-red-500">Out Of Stock</span>
          ) : data.discountedPrice != null ? (
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
