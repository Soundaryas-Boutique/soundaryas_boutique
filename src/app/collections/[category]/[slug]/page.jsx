import { connectDB } from "@/app/lib/mongoose";
import Saree from "@/app/(models)/Saree";
import ProductDetailsClient from "./ProductDetailsClient";
import { getRelatedSarees } from "@/app/lib/sarees";

export default async function ProductDetailsPage({ params }) {
  const { category, slug } = await params;

  await connectDB();
  const saree = await Saree.findOne({ slug }).lean();

  if (!saree) {
    return (
      <p className="text-center text-gray-600 py-20">Product not found.</p>
    );
  }

  // Fetch related sarees
  const relatedSarees = await getRelatedSarees(category, slug);

  // ✅ Convert the Mongoose object to a plain JavaScript object
  const serializedSaree = JSON.parse(JSON.stringify(saree));

  return <ProductDetailsClient saree={serializedSaree} relatedSarees={relatedSarees} />;
}
