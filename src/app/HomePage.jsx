import Link from "next/link";
import SlidingBanner from "../../components/SlidingBanner";
import SareeSection from "../../components/SareeSection";
import ReviewSection from "../../components/ReviewSection";
import { getHomepageSarees } from "@/app/lib/sarees";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
        bg="bg-ivory/20"
      />

      {/* Review Section */}
      <ReviewSection />
    </main>
  );
}
