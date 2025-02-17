"use client";

import CategorySelector from "@/components/CategorySelector";
import { api } from "@/trpc/react";

export default function Categories() {
  const [categories] = api.category.getAll.useSuspenseQuery();
  return (
    <div>
      <form action="">
        {/* {JSON.stringify(categories)} */}
        <CategorySelector categories={categories} />
        {/* <button type="submit">Search</button> */}
      </form>
    </div>
  );
}
