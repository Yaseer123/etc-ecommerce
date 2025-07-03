"use client";

import { useCartStore } from "@/context/store-context/CartContext";
import { useModalCartStore } from "@/context/store-context/ModalCartContext";
import { useModalQuickViewStore } from "@/context/store-context/ModalQuickViewContext";
import { useModalWishlistStore } from "@/context/store-context/ModalWishlistContext";
import { api } from "@/trpc/react";
import type {
  JsonValue,
  ProductType,
  ProductWithCategory,
} from "@/types/ProductType";
import { StockStatus } from "@/types/ProductType";
import { Eye, Heart, ShoppingBagOpen } from "@phosphor-icons/react/dist/ssr";
import type { Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { formatPrice } from "../../../utils/format";

interface ProductProps {
  data: ProductType | ProductWithCategory;
  style?: string;
}

// Helper for stockStatus
// const validStockStatuses = ["IN_STOCK", "OUT_OF_STOCK", "PRE_ORDER"] as const;
// type StockStatus = (typeof validStockStatuses)[number];

type WishlistItem = {
  id: string;
  productId: string;
  userId: string;
  createdAt: Date;
  product: Product;
};

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
    onError: (
      err: unknown,
      variables: unknown,
      context?: { previousWishlist?: WishlistItem[] },
    ) => {
      if (context?.previousWishlist) {
        utils.wishList.getWishList.setData(undefined, context.previousWishlist);
      }
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
        utils.wishList.getWishList.setData(
          undefined,
          (old: WishlistItem[] | undefined) => {
            if (!old) return [];
            return old.filter((item) => item.id !== _productId);
          },
        );

        return { previousWishlist };
      },
      onError: (
        err: unknown,
        variables: unknown,
        context?: { previousWishlist?: WishlistItem[] },
      ) => {
        if (context?.previousWishlist) {
          utils.wishList.getWishList.setData(
            undefined,
            context.previousWishlist,
          );
        }
        if (err instanceof Error) {
          console.error(err.message);
        }
      },
      onSettled: async () => {
        await utils.wishList.getWishList.invalidate();
      },
    });

  const isInWishlist = (itemId: string): boolean => {
    return wishlist.some(
      (item: WishlistItem) => item.id === itemId || item.product?.id === itemId,
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
      sku: typeof data.sku === "string" ? data.sku : "",
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
      if (!wishlist.some((item: WishlistItem) => item.id === data.id)) {
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
    // Type guard for ProductType | ProductWithCategory
    const getString = (field: keyof (ProductType | ProductWithCategory)) => {
      return typeof data[field] === "string" ? (data[field] as string) : "";
    };
    const getBoolean = (field: keyof (ProductType | ProductWithCategory)) => {
      return typeof data[field] === "boolean"
        ? (data[field] as boolean)
        : false;
    };
    const getNumber = (field: keyof (ProductType | ProductWithCategory)) => {
      return typeof data[field] === "number" ? (data[field] as number) : 0;
    };
    const productForQuickView: Product = {
      ...data,
      id: typeof data.id === "string" ? data.id : "",
      title: getString("title"),
      new: getBoolean("new"),
      sale: getBoolean("sale"),
      featured: getBoolean("featured"),
      slug: getString("slug"),
      shortDescription: getString("shortDescription"),
      description:
        typeof data.description === "string" ? data.description : null,
      published: getBoolean("published"),
      price: getNumber("price"),
      discountedPrice:
        typeof data.discountedPrice === "number" ? data.discountedPrice : null,
      stock: typeof data.stock === "number" ? data.stock : 0,
      stockStatus: ["IN_STOCK", "OUT_OF_STOCK", "PRE_ORDER"].includes(
        data.stockStatus ?? "IN_STOCK",
      )
        ? (data.stockStatus! as StockStatus)
        : StockStatus.IN_STOCK,
      defaultColor:
        typeof data.defaultColor === "string" ? data.defaultColor : null,
      defaultColorHex:
        typeof data.defaultColorHex === "string" ? data.defaultColorHex : null,
      defaultSize:
        typeof data.defaultSize === "string" ? data.defaultSize : null,
      estimatedDeliveryTime:
        typeof data.estimatedDeliveryTime === "number"
          ? data.estimatedDeliveryTime
          : null,
      categoryId: typeof data.categoryId === "string" ? data.categoryId : null,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
      imageId: typeof data.imageId === "string" ? data.imageId : "",
      descriptionImageId:
        typeof data.descriptionImageId === "string"
          ? data.descriptionImageId
          : null,
      allSkus:
        "allSkus" in data &&
        Array.isArray((data as { allSkus?: unknown }).allSkus)
          ? (data as { allSkus: unknown[] }).allSkus.filter(
              (sku): sku is string => typeof sku === "string",
            )
          : [],
      categoryAttributes: data.categoryAttributes ?? {},
      position: typeof data.position === "number" ? data.position : 0,
      deletedAt:
        typeof data.deletedAt === "object" || data.deletedAt === null
          ? (data.deletedAt ?? null)
          : null,
      variants:
        "variants" in data &&
        (Array.isArray((data as { variants?: unknown }).variants) ||
          typeof (data as { variants?: unknown }).variants === "string")
          ? ((data as { variants?: JsonValue }).variants ?? null)
          : null,
      sku: typeof data.sku === "string" ? data.sku : "",
    };
    openQuickView(productForQuickView);
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
    <div className="product-item style-marketplace min-h-[300px] rounded-lg border border-gray-200 bg-white p-4 pt-5 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900 lg:h-full">
      <div className="bg-img relative w-full pt-6">
        {discountPercentage > 0 && amountSaved > 0 && (
          <div className="absolute left-2 top-2 z-10 rounded-r-md bg-[#f27115] px-2 py-0.5 text-sm font-bold text-white shadow-md transition-all duration-300">
            Save: {formatPrice(amountSaved, "৳", false)} (-{discountPercentage}
            %)
          </div>
        )}

        <Link href={`/products/${data.slug}`}>
          <div className="relative overflow-hidden rounded-xl">
            <Image
              className="aspect-square w-full cursor-pointer object-cover transition-transform duration-500 ease-in-out hover:scale-105"
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
              alt={
                "title" in data && typeof data.title === "string"
                  ? data.title
                  : "name" in data && typeof data.name === "string"
                    ? data.name
                    : ""
              }
            />
          </div>
        </Link>

        <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
          {[
            {
              Icon: Heart,
              isActive: isInWishlist(data.id),
              action: handleAddToWishlist,
              tooltip: isInWishlist(data.id)
                ? "Remove from Wishlist"
                : "Add to Wishlist",
            },
            {
              Icon: Eye,
              action: handleQuickViewOpen,
              tooltip: "Quick View",
            },
            {
              Icon: ShoppingBagOpen,
              action: handleAddToCart,
              tooltip: "Add To Cart",
            },
          ].map(({ Icon, action, isActive = false, tooltip }, idx) => (
            <div key={idx} className="group relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  action();
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/70 text-gray-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 dark:border-gray-600 dark:bg-white dark:text-black ${
                  isActive ? "bg-pink-100 dark:bg-pink-200" : ""
                }`}
              >
                <Icon
                  size={18}
                  weight={isActive ? "fill" : "regular"}
                  className={isActive ? "text-red-500" : ""}
                />
              </button>

              {/* Tooltip */}
              <div className="absolute right-full top-1/2 mr-3 -translate-y-1/2 scale-90 transform rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 dark:bg-white dark:text-black">
                {tooltip}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="product-info mt-4 flex flex-col">
        <Link href={`/products/${data.slug}`} className="flex-grow">
          <h3 className="line-clamp-3 min-h-[4.5rem] cursor-pointer text-base font-medium text-gray-900 transition-colors duration-300 hover:underline dark:text-white">
            {"title" in data && typeof data.title === "string"
              ? data.title
              : "name" in data && typeof data.name === "string"
                ? data.name
                : ""}
          </h3>
        </Link>

        <div className="mt-auto flex items-center">
          {"stockStatus" in data && data.stockStatus === "OUT_OF_STOCK" ? (
            <span className="font-bold text-red-500">Out Of Stock</span>
          ) : data.discountedPrice != null ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white">
                {formatPrice(data.discountedPrice)}
              </span>
              <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                {formatPrice(data.price)}
              </span>
            </div>
          ) : (
            <span className="font-bold text-gray-900 dark:text-white">
              {formatPrice(data.price)}
            </span>
          )}
        </div>

        {(!("stockStatus" in data) || data.stockStatus !== "OUT_OF_STOCK") && (
          <button
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-100 px-4 py-2 font-semibold text-blue-700 shadow-sm transition-all duration-300 ease-in-out hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800"
            onClick={() => handleAddToCart()}
          >
            <ShoppingBagOpen size={20} />
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
}
