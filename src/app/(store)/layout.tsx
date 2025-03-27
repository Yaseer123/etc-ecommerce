import "@/styles/styles.scss";
import Footer from "@/components/store-components/Footer";
import Menu from "@/components/store-components/Menu";
import React from "react";
import { auth } from "@/server/auth";
import ModalWrapper from "@/components/store-components/Modal/ModalWrapper";
import { HydrateClient } from "@/trpc/server";


export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <HydrateClient>
      <Menu isAuthenticated={!!session?.user} />
      {children}
      <Footer />
      <ModalWrapper />
    </HydrateClient>
  );
}
