"use client";
import Newsletter from "./Newsletter";

const NewsletterSection = () => {
  return (
    <section className="bg-gray-100 p-8 md:p-16 rounded-xl text-center shadow-lg my-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-[#A52A2A] mb-4">
        Stay Connected with Soundarya's Boutique
      </h2>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
        Be the first to know about new arrivals, exclusive offers, and special events. Join our community today!
      </p>
      {/* ✅ Now rendering the Newsletter form directly */}
      <Newsletter />
    </section>
  );
};

export default NewsletterSection;