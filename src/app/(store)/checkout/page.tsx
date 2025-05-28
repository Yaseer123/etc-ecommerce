"use client";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import { useCartStore } from "@/context/store-context/CartContext";
import { api } from "@/trpc/react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import type { Order } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const Checkout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [useExistingAddress, setUseExistingAddress] = useState(true);

  // Get user's address
  const { data: userAddress, isLoading: addressLoading } =
    api.user.getAddress.useQuery(undefined, {
      enabled: status === "authenticated",
    });

  const searchParams = useSearchParams();
  const discount = searchParams?.get("discount") ?? "0";
  const ship = searchParams?.get("ship") ?? "0";

  const { cartArray } = useCartStore();
  const [totalCart, setTotalCart] = useState<number>(0);
  const [activePayment, setActivePayment] = useState<string>("credit-card");
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState("");

  React.useEffect(() => {
    const sum = cartArray.reduce(
      (acc, item) => acc + (item.discountedPrice ?? item.price) * item.quantity,
      0,
    );
    setTotalCart(sum);
  }, [cartArray]);

  const handlePayment = (item: string) => {
    setActivePayment(item);
  };

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Checkout",
    },
  ];

  const renderAddressSection = () => {
    if (!session) {
      return (
        <div className="flex justify-between rounded-lg bg-surface px-4 py-3">
          <div className="flex items-center">
            <span className="pr-4">Already have an account? </span>
            <span className="cursor-pointer text-base font-semibold capitalize leading-[26px] hover:underline md:text-base md:leading-6">
              Login
            </span>
          </div>
          <div>
            <CaretDown className="cursor-pointer" />
          </div>
        </div>
      );
    }

    return (
      <div className="mt-5">
        <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
          Shipping Information
        </div>
        {userAddress && useExistingAddress ? (
          <div className="mt-5 rounded-lg border border-line p-5">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">Saved Address</div>
              <button
                onClick={() => setUseExistingAddress(false)}
                className="text-sm text-blue-600 hover:underline"
              >
                Use Different Address
              </button>
            </div>
            <div className="mt-4 space-y-2">
              <p>{userAddress.email}</p>
              <p>{userAddress.phone}</p>
              <p>{userAddress.street}</p>
              <p>
                {userAddress.city}, {userAddress.state} {userAddress.zipCode}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
              Information
            </div>
            <div className="mt-5">
              <form>
                <div className="grid flex-wrap gap-4 gap-y-5 sm:grid-cols-2">
                  <div className="">
                    <input
                      className="w-full rounded-lg border-line px-4 py-3"
                      id="firstName"
                      type="text"
                      placeholder="First Name *"
                      required
                    />
                  </div>
                  <div className="">
                    <input
                      className="w-full rounded-lg border-line px-4 py-3"
                      id="lastName"
                      type="text"
                      placeholder="Last Name *"
                      required
                    />
                  </div>
                  <div className="">
                    <input
                      className="w-full rounded-lg border-line px-4 py-3"
                      id="email"
                      type="email"
                      placeholder="Email Address *"
                      required
                    />
                  </div>
                  <div className="">
                    <input
                      className="w-full rounded-lg border-line px-4 py-3"
                      id="phoneNumber"
                      type="number"
                      placeholder="Phone Numbers *"
                      required
                    />
                  </div>
                  <div className="relative col-span-full">
                    <select
                      className="w-full rounded-lg border border-line px-4 py-3"
                      id="region"
                      name="region"
                      defaultValue={"default"}
                    >
                      <option value="default" disabled>
                        Choose Country/Region
                      </option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="India">India</option>
                      <option value="France">France</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                    <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                  <div className="">
                    <input
                      className="w-full rounded-lg border-line px-4 py-3"
                      id="city"
                      type="text"
                      placeholder="Town/City *"
                      required
                    />
                  </div>
                  <div className="">
                    <input
                      className="w-full rounded-lg border-line px-4 py-3"
                      id="apartment"
                      type="text"
                      placeholder="Street,..."
                      required
                    />
                  </div>
                  <div className="relative">
                    <select
                      className="w-full rounded-lg border border-line px-4 py-3"
                      id="country"
                      name="country"
                      defaultValue={"default"}
                    >
                      <option value="default" disabled>
                        Choose State
                      </option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="India">India</option>
                      <option value="France">France</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                    <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                  <div className="">
                    <input
                      className="w-full rounded-lg border-line px-4 py-3"
                      id="postal"
                      type="text"
                      placeholder="Postal Code *"
                      required
                    />
                  </div>
                  <div className="col-span-full">
                    <textarea
                      className="w-full rounded-lg border border-line px-4 py-3"
                      id="note"
                      name="note"
                      placeholder="Write note..."
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPaymentSection = () => (
    <div className="mt-6 md:mt-10">
      <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
        Choose payment Option:
      </div>
      <div className="mt-5">
        <div className={`rounded-lg border border-line bg-surface p-5`}>
          <input
            className="cursor-pointer"
            type="radio"
            id="delivery"
            name="payment"
            checked={true}
            readOnly
          />
          <label
            className="cursor-pointer pl-2 text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6"
            htmlFor="delivery"
          >
            Cash on delivery
          </label>
          <div className="visible max-h-[1000px] opacity-100">
            <div className="pt-4">
              You will pay in cash when your order is delivered to your address.
              Please ensure your shipping information is correct.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const placeOrder = api.order.placeOrder.useMutation({
    onSuccess: (data) => {
      setOrderSuccess(data);
      setOrderError("");
      useCartStore.getState().clearCart();
    },
    onError: (err) => {
      setOrderError(err.message || "Order failed. Please try again.");
    },
  });

  if (status === "unauthenticated") {
    router.push("/login?redirect=/checkout");
    return null;
  }

  if (status === "loading" || addressLoading) {
    return <div>Loading...</div>;
  }

  if (orderSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">Order Completed!</h2>
        <p className="mb-2">Thank you for your order.</p>
        <p className="mb-2">Your Invoice/Order Number:</p>
        <div className="mb-4 rounded bg-gray-100 px-4 py-2 font-mono text-lg">
          {orderSuccess.id}
        </div>
        <button
          className="mt-4 rounded bg-black px-6 py-2 text-white"
          onClick={() => router.push("/my-account")}
        >
          Go to My Orders
        </button>
      </div>
    );
  }

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb items={breadcrumbItems} pageTitle="Checkout" />
      </div>
      <div className="py-10 md:py-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="flex justify-between md:overflow-x-auto">
            <div className="w-1/2">
              {renderAddressSection()}
              {renderPaymentSection()}
              <div className="mt-6 md:mt-10">
                <button
                  className="duration-400 inline-block w-full cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:text-xs md:leading-4 lg:rounded-[10px] lg:px-6 lg:py-3"
                  onClick={() => {
                    if (!session) {
                      router.push("/login?redirect=/checkout");
                      return;
                    }
                    if (cartArray.length === 0) {
                      setOrderError("Your cart is empty.");
                      return;
                    }
                    // Use saved address or collect from form (expand as needed)
                    const addressId = userAddress?.id;
                    placeOrder.mutate({
                      cartItems: cartArray.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                      })),
                      addressId,
                    });
                  }}
                >
                  {session ? "Order Now" : "Login to Continue"}
                </button>
                {orderError && (
                  <div className="text-red-500 mt-2">{orderError}</div>
                )}
              </div>
            </div>
            <div className="right w-5/12">
              <div>
                <div className="pb-3 text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                  Your Order
                </div>
                <div>
                  {cartArray.length < 1 ? (
                    <p className="pt-3 text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                      No product in cart
                    </p>
                  ) : (
                    cartArray.map((product) => (
                      <div
                        key={product.id}
                        className="mt-5 flex w-full items-center justify-between gap-6 border-b border-line pb-5"
                      >
                        <div className="bg-img aspect-square w-[100px] flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={
                              product.coverImage ??
                              "/images/product/1000x1000.png"
                            }
                            width={500}
                            height={500}
                            alt="img"
                            className="h-full w-full"
                          />
                        </div>
                        <div className="flex w-full items-center justify-between">
                          <div>
                            <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                              {product.name}
                            </div>
                          </div>
                          <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                            <span className="quantity">{product.quantity}</span>
                            <span className="px-1">x</span>
                            <span>
                              ৳{product.discountedPrice ?? product.price}.00
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex justify-between border-b border-line py-5">
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    Discounts
                  </div>
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    -৳<span className="discount">{discount}</span>
                    <span>.00</span>
                  </div>
                </div>
                <div className="flex justify-between border-b border-line py-5">
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    Shipping
                  </div>
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    {Number(ship) === 0 ? "Free" : `৳${ship}.00`}
                  </div>
                </div>
                <div className="flex justify-between pt-5">
                  <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                    Total
                  </div>
                  <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                    ৳{totalCart - Number(discount) + Number(ship)}.00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
