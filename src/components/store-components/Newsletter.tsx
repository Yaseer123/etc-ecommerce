"use client";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { api } from "@/trpc/react";
import { useState } from "react";

interface NewsletterProps {
  variant?: 'default' | 'footer';
}

export default function Newsletter({ variant = 'default' }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const newsletterMutation = api.newsletter.subscribe.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      await newsletterMutation.mutateAsync({ email });
      setSuccess(
        "Thank you for subscribing! Check your email for a discount code.",
      );
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {variant === 'default' ? (
        <div className="newsletter-block bg-green py-7">
          <div className="mx-auto flex w-full !max-w-[1322px] items-center justify-center gap-8 gap-y-4 px-4 max-lg:flex-col lg:justify-between">
            <div className="text-content">
              <div className="text-[36px] font-semibold capitalize leading-[40px] max-lg:text-center md:text-[20px] md:leading-[28px] lg:text-[30px] lg:leading-[38px]">
                Sign up and get 10% off
              </div>
              <div className="mt-2 max-lg:text-center">
                Sign up for early sale access, new in, promotions and more
              </div>
            </div>
            <div className="input-block h-[52px] w-full sm:w-3/5 md:w-1/2 xl:w-5/12">
              <form className="relative h-full w-full" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Enter your e-mail"
                  className="h-full w-full rounded-xl border border-line pl-4 pr-14"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={newsletterMutation.isLoading}
                />
                <button
                  className="absolute right-1 top-1 flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-black"
                  type="submit"
                  disabled={newsletterMutation.isLoading}
                >
                  {newsletterMutation.isLoading ? "..." : "Subscribe"}
                </button>
              </form>
              {success && <div className="text-green-800 mt-2 text-sm">{success}</div>}
              {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="text-button-uppercase">Newsletter</div>
          <div className="caption1 mt-3">
            Sign up for our newsletter and get 10% off your first purchase
          </div>
          <div className="input-block mt-4 h-[52px] w-full">
            <form className="relative h-full w-full" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your e-mail"
                className="caption1 h-full w-full rounded-xl border border-line pl-4 pr-14"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={newsletterMutation.isLoading}
              />
              <button
                className="absolute right-1 top-1 flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-black"
                type="submit"
                disabled={newsletterMutation.isLoading}
              >
                <ArrowRight size={24} color="#fff" />
              </button>
            </form>
            {success && <div className="text-green-800 mt-2 text-sm">{success}</div>}
            {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
          </div>
        </>
      )}
    </>
  );
}
