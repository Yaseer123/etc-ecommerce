import Footer from "@/components/store-components/Footer";
import TopNav from "@/components/store-components/TopNav";
import GlobalProvider from "@/providers/GlobalProvider";
import React from "react";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalProvider>
        <TopNav
          props="style-one bg-black"
          slogan="New customers save 10% with the code GET10"
        />
        {children}
        <Footer />
      </GlobalProvider>
    </>
  );
}
