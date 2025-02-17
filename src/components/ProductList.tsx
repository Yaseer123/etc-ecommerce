"use client";

import { api } from "@/trpc/react";

export default function ProductList() {
  const [products] = api.product.getAll.useSuspenseQuery();
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
