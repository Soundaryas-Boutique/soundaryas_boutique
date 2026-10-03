import { supabase } from "@/app/lib/supabase";
import ProductsList from "../../../components/ProductsList";

export const metadata = {
  title: "Collections | Soundarya's Boutique",
  description: "Explore our complete collection of exquisite handwoven sarees.",
};

export default async function AllCollectionsPage() {
  // No try/catch: the Supabase client returns an error rather than throwing,
  // and wrapping JSX in a try block cannot catch render errors anyway -- React
  // renders the elements after this function has already returned.
  const { data: sarees, error } = await supabase().from("sarees").select("*");

  if (error) {
    console.error("Error fetching all sarees:", error);
    return (
      <p role="alert" className="text-center text-gray-600 py-20">
        Failed to load the collections.
      </p>
    );
  }

  return (
    <main className="bg-white">
      <div className="container-page py-8 lg:py-12">
        {/* Simplified Header */}
        <div className="flex flex-col items-start mb-8 border-b border-ivory pb-6">
          <h1 className="text-2xl md:text-3xl font-secondary text-primary tracking-tight uppercase">
            All Collections
          </h1>
          <p className="text-eyebrow uppercase tracking-[0.2em] text-grey-medium mt-2">
            Home / <span className="text-secondary">Collections</span>
          </p>
        </div>

        <ProductsList initialSarees={sarees} category="All" />
      </div>
    </main>
  );
}
