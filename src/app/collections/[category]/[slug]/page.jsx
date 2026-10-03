import { supabase } from "@/app/lib/supabase";
import ProductDetailsClient from "./ProductDetailsClient";
import { getRelatedSarees } from "@/app/lib/sarees";

export default async function ProductDetailsPage({ params }) {
  const { category, slug } = await params;

  const { data: saree, error } = await supabase()
    .from("sarees")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;

  if (!saree) {
    return (
      <p className="text-center text-gray-600 py-20">Product not found.</p>
    );
  }

  // Fetch related sarees
  const relatedSarees = await getRelatedSarees(category, slug);

  return <ProductDetailsClient saree={saree} relatedSarees={relatedSarees} />;
}
