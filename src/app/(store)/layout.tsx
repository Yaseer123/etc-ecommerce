import "@/styles/styles.css";
import AnalyticsScript from "@/components/ga-pixel-script/AnalyticsScript";
import Footer from "@/components/store-components/Footer";
import Menu from "@/components/store-components/Menu";
import ModalCart from "@/components/store-components/Modal/ModalCart";
import ModalWishlist from "@/components/store-components/Modal/ModalWishlist";
import TopNav from "@/components/store-components/TopNav";
import GlobalProvider from "@/providers/GlobalProvider";
import type CountdownTimeType from "@/types/CountdownType";
import { countdownTime } from "@/utils/countdownTime";
import React from "react";
import ModalQuickview from "@/components/store-components/Modal/ModalQuickview";
const serverTimeLeft: CountdownTimeType = countdownTime();
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnalyticsScript />
      <GlobalProvider>
        <TopNav
          props="style-one bg-black_custom"
          slogan="New customers save 10% with the code GET10"
        />
        <Menu />
        {children}
        <Footer />
        <ModalCart serverTimeLeft={serverTimeLeft} />
        <ModalWishlist />
        {/* <ModalSearch /> */}
        <ModalQuickview />
        {/* <ModalCompare /> */}
      </GlobalProvider>
    </>
  );
}
