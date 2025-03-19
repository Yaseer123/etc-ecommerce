import React from "react";
import Link from "next/link";
import { type ProductType } from "@/types/ProductType";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";

interface Props {
  data: ProductType;
}

const BreadcrumbProduct: React.FC<Props> = ({ data }) => {
  return (
    <>
      <div>
        <div className="bg-surface bg-[linear-gradient(87deg,#f9f1f0_4.3%,#faf7f1_95.7%)] bg-no-repeat pt-12 pb-8">
          <div className="mx-auto flex w-full !max-w-[1322px] flex-wrap items-center justify-between gap-3 px-4">
            <div className="left flex items-center gap-1">
              <Link
                href={"/"}
                className="text-base font-normal leading-[22] text-secondary2 hover:underline md:text-[13px] md:leading-5"
              >
                Homepage
              </Link>
              <CaretRight size={12} className="text-secondary2" />
              <div className="text-base font-normal leading-[22] text-secondary2 md:text-[13px] md:leading-5">
                Product
              </div>
              <CaretRight size={12} className="text-secondary2" />
              <div className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5">{`Product ${data.brand}`}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BreadcrumbProduct;
