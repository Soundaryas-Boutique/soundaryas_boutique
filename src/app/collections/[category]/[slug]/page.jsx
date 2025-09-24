import { connectDB } from "@/app/lib/mongoose2";
import Saree from "@/app/(models)/Saree";
import ProductDetailsClient from "./ProductDetailsClient"; // A new client component

// This is a server component to fetch data
export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;

  await connectDB();
  const saree = await Saree.findOne({ slug: slug }).lean();

  if (!saree) {
    return (
      <p className="text-center text-gray-600 py-20">Product not found.</p>
    );
  }

  const serializedSaree = JSON.parse(JSON.stringify(saree));

  return <ProductDetailsClient saree={serializedSaree} />;
}