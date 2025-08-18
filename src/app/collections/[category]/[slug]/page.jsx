"use client";
import { useEffect, useState } from "react";
import ProductPage from "../../../../../components/ProductPage";

export default function ProductSlugPage({ params }) {
  const { category, slug } = params;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/sarees/category/${category}/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    }
    fetchProduct();
  }, [category, slug]);

  if (!product) return <p className="p-8">Loading...</p>;

  return <ProductPage product={product} />;
}
