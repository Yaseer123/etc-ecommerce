import "@/styles/styles.scss";
import Footer from "@/components/store-components/Footer";
import ModalCart from "@/components/store-components/Modal/ModalCart";
import ModalWishlist from "@/components/store-components/Modal/ModalWishlist";
import type CountdownTimeType from "@/types/CountdownType";
import { countdownTime } from "@/utils/countdownTime";
import React from "react";
import Menu from "@/components/store-components/Menu";
import ModalQuickView from "@/components/store-components/Modal/ModalQuickView";

const serverTimeLeft: CountdownTimeType = countdownTime();
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Menu />
      {children}
      <Footer />
      <ModalCart serverTimeLeft={serverTimeLeft} />
      <ModalWishlist />
      {/* <ModalSearch /> */}
      <ModalQuickView />
    </>
  );
}
