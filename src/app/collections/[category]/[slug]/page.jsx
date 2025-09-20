import ProductPageClient from "../../../../../components/ProductPageClient.jsx";
import { notFound } from "next/navigation";
import { connectDB } from "@/app/lib/mongoose2";
import Saree from "@/app/(models)/Saree";

export default async function ProductSlugPage({ params }) {
  const { category, slug } = await params;

  try {
    await connectDB();

    // Fetch product from DB
    let product = await Saree.findOne({
      category: category.trim(),
      slug: slug.trim(),
    }).lean();

    // Convert _id to string for client-safe props
    product._id = product._id.toString();

    return <ProductPageClient product={product} />;
  } catch (err) {
    console.error("Error fetching product:", err);
    return <p className="p-8">Failed to load product.</p>;
  }
}
