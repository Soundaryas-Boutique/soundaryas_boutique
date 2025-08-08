import SlidingBanner from "../../components/SlidingBanner";

export default function HomePage() {
  return (
    <main>
      <SlidingBanner />

    {/* Best Sellers */}
    <section className="max-w-[1440px] mx-auto py-16 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center text-[#B22222]">BEST SELLERS</h2>
      
      <div className="grid grid-cols-5 gap-8 hidden md:grid pt-10">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="bg-white hover:shadow-md transition overflow-hidden"
          >
            <img
              src={`/sample_product_images/picture${item}.webp`}
              alt={`Best Seller ${item}`}
              className="w-full object-contain"
            />
            <div className="p-4">
              <h3 className="text-lg text-center font-semibold text-[#B22222]">Saree {item}</h3>
              <p className="text-gray-600 text-sm mt-1 text-center">
                Elegant and traditional handwoven saree.
              </p>
              <p className="text-[#B22222] font-bold mt-2 text-center">₹9,999</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex overflow-x-auto md:hidden gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="bg-white hover:shadow-md transition min-w-[130px] overflow-hidden pt-10"
          >
            <img
              src={`/sample_product_images/picture${item}.webp`} // Replace with your actual image paths
              alt={`Best Seller ${item}`}
              className="w-full object-contain"
            />
            <div className="p-4">
              <h3 className="text-lg text-center font-semibold text-[#B22222]">Saree {item}</h3>
              <p className="text-gray-600 text-sm mt-1 text-center">
                Elegant and traditional handwoven saree.
              </p>
              <p className="text-[#B22222] font-bold mt-2 text-center">₹9,999</p>
            </div>
          </div>
        ))}
      </div>

      {/* View All button centered at the bottom */}
      <div className="text-center mt-6">
      <button
        className="px-4 py-2 font-medium text-gray-500 rounded 
                  ring-1 ring-gray-500 
                  hover:ring-2 
                  transition-all duration-300 ease-in-out"
      >
        View All
      </button>
      </div>
    </section>

    </main>
  );
}
