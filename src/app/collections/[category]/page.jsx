import ProductsPage from "../../../../components/ProductsPage";

export default async function CategoryPage({ params }) {
  // params is async in Next.js App Router, so await it
  const { category } = await params;

  return <ProductsPage category={category} />;
}