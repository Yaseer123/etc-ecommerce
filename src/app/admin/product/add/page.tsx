import AddProductForm from "@/components/admin-components/AddProduct";
import { HydrateClient } from "@/trpc/server";

export default function AddProduct() {
  return (
    <HydrateClient>
      <div className="flex min-h-[80vh] items-center justify-center p-10">
        <AddProductForm />
      </div>
    </HydrateClient>
  );
}
