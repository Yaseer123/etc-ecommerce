import { HydrateClient } from "@/trpc/server";
import ProductDataTable from "./ProductDataTable";

export default function ProductPage() {
  return (
    <HydrateClient>
      <div className="p-4 md:p-10">
        <p className="text-center text-2xl font-semibold">
          Product Information
        </p>
        <ProductDataTable />
      </div>
    </HydrateClient>
  );
}
