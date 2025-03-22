import { api } from "@/trpc/react";
import { type ProductType } from "@/types/ProductType";

interface HandleAddToWishlistParams {
  data: ProductType;
  utils: ReturnType<typeof api.useUtils>;
  removeFromWishlistMutation: ReturnType<
    typeof api.wishList.removeFromWishList.useMutation
  >;
  openModalWishlist: () => void;
}

export function handleAddToWishlist({
  data,
  utils,
  removeFromWishlistMutation,
  openModalWishlist,
}: HandleAddToWishlistParams) {
  const addToWishlistMutation = api.wishList.addToWishList.useMutation({
    onSuccess: async () => {
      await utils.wishList.getWishList.invalidate();
    },
  });

  const isInWishlist = (itemId: string): boolean => {
    const [wishlistResponse] = api.wishList.getWishList.useSuspenseQuery();
    const wishlist = wishlistResponse ?? [];
    return wishlist.some((item: { id: string }) => item?.id === itemId);
  };

  if (isInWishlist(data.id)) {
    utils.wishList.getWishList.setData(
      undefined,
      (old) => old?.filter((item) => item.id !== data.id) ?? [],
    );

    removeFromWishlistMutation.mutate(
      { productId: data.id },
      {
        onError: () => {
          void utils.wishList.getWishList.invalidate();
        },
      },
    );
  } else {
    utils.wishList.getWishList.setData(undefined, (old) => [
      ...(old ?? []),
      data,
    ]);

    addToWishlistMutation.mutate(
      { productId: data.id },
      {
        onError: () => {
          void utils.wishList.getWishList.invalidate();
        },
      },
    );
  }

  openModalWishlist();
}
