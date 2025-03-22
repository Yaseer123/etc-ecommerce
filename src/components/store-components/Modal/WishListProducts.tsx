import { api } from "@/trpc/react";
import Image from "next/image";

export default function WishListProducts() {
    const [wishList] = api.wishList.getWishList.useSuspenseQuery();
  const utils = api.useUtils();
  const removeFromWishlistMutation =
    api.wishList.removeFromWishList.useMutation({
      onSuccess: async () => {
        await utils.wishList.getWishList.invalidate();
      },
    });
    return (
        <div className="list-product px-6">
            {wishList.map((product) => (
              <div
                key={product.id}
                className="item flex items-center justify-between gap-3 border-b border-line py-5"
              >
                <div className="infor flex items-center gap-5">
                  <div className="bg-img">
                    <Image
                      src={product.images[0] ?? "/images/product/1.png"}
                      width={300}
                      height={300}
                      alt={product.name}
                      className="aspect-square w-[100px] flex-shrink-0 rounded-lg"
                    />
                  </div>
                  <div className="">
                    <div className="name text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                      {product.name}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="product-price text-title">
                        ${product.price}.00
                      </div>
                      <div className="product-origin-price text-title text-secondary2">
                        <del>${product.originPrice}.00</del>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="remove-wishlist-btn cursor-pointer text-base font-semibold leading-[22] text-red underline md:text-[13px] md:leading-5"
                  onClick={() =>
                    removeFromWishlistMutation.mutate({ productId: product.id })
                  }
                >
                  Remove
                </div>
              </div>
            ))}
          </div>
    );
}