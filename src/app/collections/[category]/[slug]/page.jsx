import { connectDB } from "@/app/lib/mongoose2";
import Saree from "@/app/(models)/Saree";
import ProductDetailsClient from "./ProductDetailsClient";

export default async function ProductDetailsPage({ params }) {
  const { slug } = params;

  await connectDB();
  const saree = await Saree.findOne({ slug }).lean();

  if (!saree) {
    return (
      <p className="text-center text-gray-600 py-20">Product not found.</p>
    );
  }

  // ✅ Convert the Mongoose object to a plain JavaScript object
  const serializedSaree = JSON.parse(JSON.stringify(saree));

  return <ProductDetailsClient saree={serializedSaree} />;
}
