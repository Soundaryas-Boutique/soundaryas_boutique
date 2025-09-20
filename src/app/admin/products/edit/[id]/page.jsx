// src/app/admin/products/edit/[id]/page.jsx
"use client";

import ProductForm from "../../../../../../components/admin/ProductForm";

export default function EditProductPage({ params }) {
  const { id } = params; // product id from the route

  return <ProductForm productId={id} />;
}
