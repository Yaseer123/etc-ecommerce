import React from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";

interface Pros {
  heading: string;
  subHeading: string;
}

const Breadcrumb: React.FC<Pros> = ({ heading, subHeading }) => {
  return (
    <>
      <div className="breadcrumb-block style-shared">
        <div className="breadcrumb-main bg-linear overflow-hidden">
          <div className="container relative pb-10 pt-24 lg:pt-[134px]">
            <div className="main-content relative z-[1] flex h-full w-full flex-col items-center justify-center">
              <div className="text-content">
                <div className="heading2 text-center">{heading}</div>
                <div className="link caption1 mt-3 flex items-center justify-center gap-1">
                  <Link href={"/"}>Homepage</Link>
                  <Icon.CaretRight size={14} className="text-secondary2" />
                  <div className="capitalize text-secondary2">{subHeading}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Breadcrumb;
