import { AuroraBackground } from "@/components/shared/AuroraBackground";
import SlideNavbar from "@/components/shared/SlideNavbar";
import Footer from "@/components/store-components/Footer";
import ModalWrapper from "@/components/store-components/Modal/ModalWrapper";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { auth } from "@/server/auth";
import "@/styles/styles.scss";
import { HydrateClient } from "@/trpc/server";
import React from "react";
import NextTopLoader from "nextjs-toploader";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <HydrateClient>
      <SlideNavbar isAuthenticated={!!session?.user} />
      <body>
        <NextTopLoader />
        <AuroraBackground>{children}</AuroraBackground>
        <WhatsAppWidget />
        <Footer />
        <ModalWrapper />
      </body>
    </HydrateClient>
  );
}
