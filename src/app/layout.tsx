import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/sonner";
import AnalyticsScript from "@/components/ga-pixel-script/AnalyticsScript";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta title="Rinors E-commerce" />
        <meta
          name="description"
          content="Your one-stop shop for premium products. Discover our curated collection of quality items with secure shopping and fast delivery."
        />
        <link rel="icon" href="/favicon.ico" />
        <AnalyticsScript />
      </Head>
      <body>
        <SessionProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
