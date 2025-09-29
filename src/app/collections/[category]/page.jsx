import { connectDB } from "@/app/lib/mongoose2";
import Saree from "@/app/(models)/Saree";
import ProductsListClient from "../../../../components/ProductsListClient";

export default async function ProductsPage({ params }) {
  const { category } = params;

  try {
    await connectDB();
    let sarees = await Saree.find({ category }).lean();
    sarees = JSON.parse(JSON.stringify(sarees));

    if (!sarees || sarees.length === 0) {
      return (
        <p className="text-center text-gray-600 py-20">
          No sarees found in this category.
        </p>
      );
    }
    return (
      <main className="max-w-[1440px] mx-auto py-8 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-[#B22222] uppercase mb-6">
          {category.replace("-", " ")}
        </h2>
        <ProductsListClient initialSarees={sarees} category={category} />
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