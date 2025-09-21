// src/app/admin/products/edit/[id]/page.jsx

import ProductForm from "../../../../../../components/admin/ProductForm";

export default async function EditProductPage({ params }) {
  // Await params to unwrap them
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return <ProductForm productId={id} />;
}
