"use client";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import { useCartStore } from "@/context/store-context/CartContext";
import { api } from "@/trpc/react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import type { Order } from "@prisma/client";
import { HomeIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

type OrderWithRelations = Order & {
  address?: {
    name: string;
    id: string;
    userId: string | null;
    email: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    isDefault: boolean;
  } | null;
  items?: Array<{
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      title: string;
      // add other product fields as needed
    } | null;
  }>;
};

type OrderSuccessType = Order | OrderWithRelations | null;

const Checkout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const discount = searchParams?.get("discount") ?? "0";
  const ship = searchParams?.get("ship") ?? "0";

  const { cartArray } = useCartStore();
  const [totalCart, setTotalCart] = useState<number>(0);
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccessType>(null);
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
      setOrderError(err.message ?? "Order failed. Please try again.");
    },
  });

  // Coupon code state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [discountValue, setDiscountValue] = useState<number>(Number(discount));

  const validateCouponMutation =
    api.coupon.validateNewsletterCoupon.useMutation();

  React.useEffect(() => {
    const sum = cartArray.reduce(
      (acc, item) => acc + (item.discountedPrice ?? item.price) * item.quantity,
      0,
    );
    setTotalCart(sum);
  }, [cartArray]);

  const breadcrumbItems = [
    {
      label: <HomeIcon size={16} />,
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

  // Coupon apply handler
  const handleApplyCoupon = async () => {
    if (!newAddress.email || !/^\S+@\S+\.\S+$/.test(newAddress.email)) {
      setCouponError(
        "Please enter a valid email address above before applying the coupon.",
      );
      return;
    }
    setCouponError("");
    setAppliedCoupon(null);
    setDiscountValue(0);
    try {
      const res = await validateCouponMutation.mutateAsync({
        email: newAddress.email,
        couponCode: couponCode,
      });
      if (res.valid) {
        const discount = Math.round(totalCart * (res.discount ?? 0));
        setDiscountValue(discount);
        setAppliedCoupon(couponCode);
        setCouponError("");
      } else {
        setCouponError(res.message ?? "Invalid or expired coupon code.");
        setAppliedCoupon(null);
        setDiscountValue(0);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setCouponError(
          err.message ?? "Something went wrong. Please try again.",
        );
      } else {
        setCouponError("Something went wrong. Please try again.");
      }
      setAppliedCoupon(null);
      setDiscountValue(0);
    }
  };

  const renderAddressSection = () => (
    <div className="mt-5">
      {!session && (
        <div className="bg-surface mb-4 flex justify-between rounded-lg px-4 py-3">
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
                className="w-full rounded-lg border-[#ddd] px-4 py-3 focus:border-[#ddd]"
                id="name"
                type="text"
                placeholder="Full Name *"
                value={newAddress.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
              {addressErrors.name && (
                <div className="mt-1 text-xs text-red-500">
                  {addressErrors.name}
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <input
                className="w-full rounded-lg border-[#ddd] px-4 py-3 focus:border-[#ddd]"
                id="email"
                type="email"
                placeholder="Email Address *"
                value={newAddress.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
              {addressErrors.email && (
                <div className="mt-1 text-xs text-red-500">
                  {addressErrors.email}
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <input
                className="w-full rounded-lg border-[#ddd] px-4 py-3 focus:border-[#ddd]"
                id="mobile"
                type="text"
                placeholder="Mobile Number *"
                value={newAddress.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                required
              />
              {addressErrors.mobile && (
                <div className="mt-1 text-xs text-red-500">
                  {addressErrors.mobile}
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <input
                className="w-full rounded-lg border-[#ddd] px-4 py-3 focus:border-[#ddd]"
                id="address"
                type="text"
                placeholder="Address *"
                value={newAddress.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
              />
              {addressErrors.address && (
                <div className="mt-1 text-xs text-red-500">
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
        <div
          className={`bg-surface rounded-lg border border-[#ddd] p-5 focus:border-[#ddd]`}
        >
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
    onSuccess: (data: OrderSuccessType) => {
      setOrderSuccess(data);
      setOrderError("");
      useCartStore.getState().clearCart();
    },
    onError: (err) => {
      setOrderError(err.message ?? "Order failed. Please try again.");
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
          className="mt-4 rounded bg-black px-6 py-2 text-white hover:bg-black/75"
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
                  className="duration-400 hover:bg-green inline-block w-full cursor-pointer rounded-[.25rem] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-black/75 md:rounded-[8px] md:px-4 md:py-2.5 md:text-xs md:leading-4 lg:rounded-[10px] lg:px-6 lg:py-3"
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
                      // Auto-register guest user after order
                      await fetch("/api/auth/auto-register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          email: newAddress.email,
                          name: newAddress.name,
                        }),
                      });
                    }
                  }}
                >
                  Order Now
                </button>
                {orderError && (
                  <div className="mt-2 text-red-500">{orderError}</div>
                )}
              </div>
            </div>
            <div className="right w-5/12">
              <div>
                <div className="pb-3 text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                  Your Order
                </div>
                {/* Coupon code input */}
                <div className="mb-4">
                  <label htmlFor="coupon" className="mb-1 block font-medium">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="coupon"
                      type="text"
                      className="w-full rounded-lg border-[#ddd] px-4 py-2 focus:border-[#ddd]"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                    />
                    <button
                      type="button"
                      className="hover:bg-green rounded bg-black px-4 py-2 font-semibold text-white hover:bg-black/75 disabled:opacity-50"
                      onClick={handleApplyCoupon}
                      disabled={!!appliedCoupon || !couponCode.trim()}
                    >
                      {appliedCoupon ? "Applied" : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <div className="mt-1 text-xs text-red-500">
                      {couponError}
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="mt-1 text-xs text-green-600">
                      Coupon &apos;{appliedCoupon}&apos; applied!
                    </div>
                  )}
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
                        className="mt-5 flex w-full items-center justify-between gap-6 border-b border-[#ddd] pb-5 focus:border-[#ddd]"
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
                <div className="flex justify-between border-b border-[#ddd] py-5 focus:border-[#ddd]">
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    Discounts
                  </div>
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    -৳<span className="discount">{discountValue}</span>
                    <span>.00</span>
                  </div>
                </div>
                <div className="flex justify-between border-b border-[#ddd] py-5 focus:border-[#ddd]">
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
                    ৳{totalCart - discountValue + Number(ship)}.00
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
