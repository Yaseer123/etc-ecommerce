"use client";
import type { FC, ReactNode } from "react";
import ImageProvider from "./context/ImageProvider";

interface Props {
  children: ReactNode;
}

const Providers: FC<Props> = ({ children }) => {
  return <ImageProvider>{children}</ImageProvider>;
};

export default Providers;
