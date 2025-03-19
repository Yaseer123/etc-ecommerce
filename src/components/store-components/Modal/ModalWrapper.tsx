"use client";

import React from "react";
import dynamic from "next/dynamic";
import type CountdownTimeType from "@/types/CountdownType";

// Dynamically import modals
const ModalCart = dynamic(() => import("./ModalCart"), { ssr: false });
const ModalWishlist = dynamic(() => import("./ModalWishlist"), { ssr: false });
const ModalQuickView = dynamic(() => import("./ModalQuickView"), {
  ssr: false,
});

interface ModalWrapperProps {
  serverTimeLeft: CountdownTimeType;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ serverTimeLeft }) => {
  return (
    <>
      <ModalCart serverTimeLeft={serverTimeLeft} />
      <ModalWishlist />
      <ModalQuickView />
    </>
  );
};

export default ModalWrapper;
