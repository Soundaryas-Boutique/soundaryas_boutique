import { supabase } from "@/app/lib/supabase";
import ProductsList from "../../../../components/ProductsList";

export default async function ProductsPage({ params }) {
  const { category } = await params;

  try {
    const { data: sarees, error } = await supabase()
      .from("sarees")
      .select("*")
      .eq("category", category);
    if (error) throw error;

    return (
      <main className="max-w-[1440px] mx-auto py-8 lg:py-12 px-6 md:px-12 bg-white">
        {/* Simplified Header */}
        <div className="flex flex-col items-start mb-8 border-b border-ivory pb-6">
          <h1 className="text-2xl md:text-3xl font-secondary text-primary tracking-tight uppercase">
            {category.replace("-", " ")} Collection
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-grey-medium mt-2">
            Home / Collections / <span className="text-secondary">{category}</span>
          </p>
        </div>

        <ProductsList initialSarees={sarees} category={category} />
      </main>
    );
  } catch (err) {
    console.error("Error fetching category sarees:", err);
    return (
      <p className="text-center text-gray-600 py-20">
        Failed to load sarees for this category.
      </p>
    );
  }
}