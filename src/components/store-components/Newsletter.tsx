"use client";
import { api } from "@/trpc/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface NewsletterProps {
  variant?: "default" | "footer";
}

export default function Newsletter({ variant = "default" }: NewsletterProps) {
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
      toast.success(
        "Thank you for subscribing! Check your email for a discount code.",
      );
      setEmail("");
    } catch (err: unknown) {
      let message = "Something went wrong. Please try again.";
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as any).message === "string"
      ) {
        message = (err as any).message;
      }
      toast.error(message);
    }
  };

  return (
    <>
      {variant === "default" ? (
        <div className="newsletter-block bg-green-300 mb-5 py-7">
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
                  className="border-[#ddd] focus:border-[#ddd] h-full w-full rounded-xl border pl-4 pr-14"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={newsletterMutation.isPending}
                />
                <Button
                  variant="default"
                  className="absolute right-1 top-1 flex h-[44px] w-[100px] items-center justify-center rounded-xl bg-black text-white hover:bg-black/75"
                  type="submit"
                  disabled={newsletterMutation.isPending}
                >
                  {newsletterMutation.isPending ? "..." : "Subscribe"}
                </Button>
              </form>
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
                className="caption1 border-[#ddd] focus:border-[#ddd] h-full w-full rounded-xl border pl-4 pr-14"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={newsletterMutation.isPending}
              />
              <button
                className="absolute right-1 top-1 flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-black hover:bg-black/75"
                type="submit"
                disabled={newsletterMutation.isPending}
              >
                <ArrowRight size={24} color="#fff" />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
