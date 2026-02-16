import { connectDB } from "@/app/lib/mongoose";
import Saree from "@/app/(models)/Saree";
import ProductsList from "../../../../components/ProductsList";

export default async function ProductsPage({ params }) {
  const { category } = await params;

  try {
    await connectDB();
    let sarees = await Saree.find({ category }).lean();
    sarees = JSON.parse(JSON.stringify(sarees));

    return (
      <main className="max-w-[1440px] mx-auto py-12 lg:py-20 px-6 md:px-12 bg-white">
        {/* Decorative Header Area */}
        <div className="flex flex-col items-center mb-12 lg:mb-16">
          <div className="w-10 h-0.5 bg-secondary/30 mb-4"></div>
          <h1 className="text-3xl md:text-5xl font-secondary text-center text-primary tracking-tight uppercase">
            {category.replace("-", " ")}
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <div className="h-[1px] w-12 lg:w-20 bg-secondary/40"></div>
            <div className="w-2.5 h-2.5 rotate-45 border border-secondary/50"></div>
            <div className="h-[1px] w-12 lg:w-20 bg-secondary/40"></div>
          </div>
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