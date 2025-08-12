import React from "react";
import ProductPage from "../../../../components/ProductPage";

export const metadata = {
  title: "Product Details - Soundarya's Boutique",
};

export default function ProductPageRoute({ params }) {
  const { id } = params;

  return <ProductPage productId={id} />;
}