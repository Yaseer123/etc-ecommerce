"use client";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import { useCartStore } from "@/context/store-context/CartContext";
import { api } from "@/trpc/react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import type { Order } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const Checkout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const discount = searchParams?.get("discount") ?? "0";
  const ship = searchParams?.get("ship") ?? "0";

  const { cartArray } = useCartStore();
  const [totalCart, setTotalCart] = useState<number>(0);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState("");

  const [newAddress, setNewAddress] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [addressErrors, setAddressErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });

  const createAddressMutation = api.address.createAddress.useMutation();
  const createGuestAddressMutation =
    api.address.createGuestAddress.useMutation();

  const placeGuestOrder = api.order.placeGuestOrder.useMutation({
    onSuccess: (data) => {
      setOrderSuccess(data);
      setOrderError("");
      useCartStore.getState().clearCart();
    },
    onError: (err) => {
      setOrderError(err.message || "Order failed. Please try again.");
    },
  });

  React.useEffect(() => {
    const sum = cartArray.reduce(
      (acc, item) => acc + (item.discountedPrice ?? item.price) * item.quantity,
      0,
    );
    setTotalCart(sum);
  }, [cartArray]);

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Checkout",
    },
  ];

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "name":
        return value.trim() === "" ? "Full Name is required" : "";
      case "email":
        return value.trim() === ""
          ? "Email is required"
          : !/^\S+@\S+\.\S+$/.test(value)
            ? "Invalid email address"
            : "";
      case "mobile":
        return value.trim() === ""
          ? "Mobile number is required"
          : !/^\+?\d{7,15}$/.test(value)
            ? "Invalid mobile number"
            : "";
      case "address":
        return value.trim() === "" ? "Address is required" : "";
      default:
        return "";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
    setAddressErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const renderAddressSection = () => (
    <div className="mt-5">
      {!session && (
        <div className="mb-4 flex justify-between rounded-lg bg-surface px-4 py-3">
          <div className="flex items-center">
            <span className="pr-4">Already have an account? </span>
            <Link
              href="/login"
              className="cursor-pointer text-base font-semibold capitalize leading-[26px] hover:underline md:text-base md:leading-6"
            >
              Login
            </Link>
          </div>
          <div>
            <CaretDown className="cursor-pointer" />
          </div>
        </div>
      )}
      <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
        Shipping Information
      </div>
      <div className="mt-5">
        <form>
          <div className="grid flex-wrap gap-4 gap-y-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <input
                className="w-full rounded-lg border-line px-4 py-3"
                id="name"
                type="text"
                placeholder="Full Name *"
                value={newAddress.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
              {addressErrors.name && (
                <div className="text-red-500 mt-1 text-xs">
                  {addressErrors.name}
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <input
                className="w-full rounded-lg border-line px-4 py-3"
                id="email"
                type="email"
                placeholder="Email Address *"
                value={newAddress.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
              {addressErrors.email && (
                <div className="text-red-500 mt-1 text-xs">
                  {addressErrors.email}
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <input
                className="w-full rounded-lg border-line px-4 py-3"
                id="mobile"
                type="text"
                placeholder="Mobile Number *"
                value={newAddress.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                required
              />
              {addressErrors.mobile && (
                <div className="text-red-500 mt-1 text-xs">
                  {addressErrors.mobile}
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <input
                className="w-full rounded-lg border-line px-4 py-3"
                id="address"
                type="text"
                placeholder="Address *"
                value={newAddress.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
              />
              {addressErrors.address && (
                <div className="text-red-500 mt-1 text-xs">
                  {addressErrors.address}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );

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

  if (status === "loading") {
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
                  onClick={async () => {
                    if (cartArray.length === 0) {
                      setOrderError("Your cart is empty.");
                      return;
                    }
                    let addressId = undefined;
                    try {
                      if (session) {
                        const created = await createAddressMutation.mutateAsync(
                          {
                            name: newAddress.name,
                            email: newAddress.email,
                            phone: newAddress.mobile,
                            street: newAddress.address,
                            city: "",
                            state: "",
                            zipCode: "",
                          },
                        );
                        addressId = created.id;
                      } else {
                        const created =
                          await createGuestAddressMutation.mutateAsync({
                            name: newAddress.name,
                            email: newAddress.email,
                            phone: newAddress.mobile,
                            street: newAddress.address,
                            city: "",
                            state: "",
                            zipCode: "",
                          });
                        addressId = created.id;
                      }
                    } catch (err) {
                      console.error("Failed to save address:", err);
                      setOrderError(
                        "Failed to save address. Please try again.",
                      );
                      return;
                    }
                    if (!addressId) {
                      setOrderError(
                        "No address found. Please enter your address.",
                      );
                      return;
                    }
                    if (session) {
                      placeOrder.mutate({
                        cartItems: cartArray.map((item) => ({
                          productId: item.id,
                          quantity: item.quantity,
                        })),
                        addressId,
                      });
                    } else {
                      placeGuestOrder.mutate({
                        cartItems: cartArray.map((item) => ({
                          productId: item.id,
                          quantity: item.quantity,
                        })),
                        addressId,
                      });
                    }
                  }}
                >
                  Order Now
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
                            <span className="discounted-price">
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
