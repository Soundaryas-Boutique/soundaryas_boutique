import { connectDB } from "@/app/lib/mongoose";
import Saree from "@/app/(models)/Saree";
import ProductsList from "../../../components/ProductsList";

export const metadata = {
  title: "Collections | Soundarya's Boutique",
  description: "Explore our complete collection of exquisite handwoven sarees.",
};

export default async function AllCollectionsPage() {
  try {
    await connectDB();
    let sarees = await Saree.find({}).lean();
    sarees = JSON.parse(JSON.stringify(sarees));

    return (
      <main className="max-w-[1440px] mx-auto py-8 lg:py-12 px-6 md:px-12 bg-white">
        {/* Simplified Header */}
        <div className="flex flex-col items-start mb-8 border-b border-ivory pb-6">
          <h1 className="text-2xl md:text-3xl font-secondary text-primary tracking-tight uppercase">
            All Collections
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-grey-medium mt-2">
            Home / <span className="text-secondary">Collections</span>
          </p>
        </div>

        <ProductsList initialSarees={sarees} category="All" />
      </main>
    );
  } catch (err) {
    console.error("Error fetching all sarees:", err);
    return (
      <p className="text-center text-gray-600 py-20">
        Failed to load the collections.
      </p>
    );
  }
}
