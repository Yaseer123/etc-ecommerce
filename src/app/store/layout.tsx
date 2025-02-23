import GlobalProvider from "@/providers/GlobalProvider";
import React from "react";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalProvider>{children}</GlobalProvider>
    </>
  );
}
