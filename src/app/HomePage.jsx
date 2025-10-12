import Link from "next/link";
import SlidingBanner from "../../components/SlidingBanner";
import SareeSection from "../../components/SareeSection"; // Client component
import { getHomepageSarees } from "@/app/lib/sarees";

export const dynamic = "force-dynamic"; // ensures SSR

export default async function HomePage() {
  // Server fetch for initial render
  const { bestSellers, newArrivals } = await getHomepageSarees(5);

  return (
    <main>
      <SlidingBanner />

      {/* Best Sellers */}
      <SareeSection
        title="BEST SELLERS"
        viewAllLink="/collections/best-sellers"
        initialData={bestSellers}
      />

      {/* New Arrivals */}
      <SareeSection
        title="NEW ARRIVALS"
        viewAllLink="/collections/new-arrivals"
        initialData={newArrivals}
        bg="bg-grey-light"
      />

      {/* Leave a Review Section */}
      <section className="bg-white py-12 text-center">
        <h2 className="text-2xl font-bold text-[#B22222] mb-4">
          Share Your Experience
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Loved your experience with Soundarya&apos;s Boutique? We&apos;d love
          to hear from you! Your feedback helps us grow.
        </p>
        <Link
          href="/review-page"
          className="bg-[#A52A2A] text-white font-medium py-3 px-8 rounded-md hover:bg-[#8B0000] transition-colors duration-200"
        >
          Leave a Review
        </Link>
      </section>
    </main>
  );
}
