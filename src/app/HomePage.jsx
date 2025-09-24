"use client";

import { useState } from "react";
import Link from "next/link";
import SlidingBanner from "../../components/SlidingBanner";
import { Star, X } from "lucide-react";

export default function HomePage({ sarees }) {
  // State for the review modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  // Poll fields
  const [service, setService] = useState("");
  const [recommend, setRecommend] = useState("");

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setRating(0);
    setComment("");
    setReviewerName("");
    setHoverRating(0);
    setService("");
    setRecommend("");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (
      rating > 0 &&
      comment.trim() !== "" &&
      reviewerName.trim() !== "" &&
      service.trim() !== "" &&
      recommend.trim() !== ""
    ) {
      const reviewData = {
        author: reviewerName,
        rating,
        comment,
        service,
        recommend,
      };

      try {
        const response = await fetch("/api/site-reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        });

        if (response.ok) {
          alert("Thank you for your feedback!");
          closeModal();
        } else {
          const errorData = await response.json();
          alert(`Submission failed: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Failed to submit site review:", error);
        alert("An error occurred while submitting your feedback.");
      }
    } else {
      alert("Please fill in all fields and select a rating.");
    }
  };

  return (
    <main>
      <SlidingBanner />

      {/* Best Sellers */}
      <section className="max-w-[1440px] mx-auto pt-16 pb-8 px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B22222]">
          BEST SELLERS
        </h2>

        {/* Desktop grid */}
        <div className="grid grid-cols-5 gap-8 hidden md:grid pt-6">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/collections/${saree.category}/${encodeURIComponent(
                saree.slug.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className="bg-white hover:shadow-md transition overflow-hidden block"
            >
              {saree.images && saree.images[0] ? (
                <img
                  src={saree.images[0].url}
                  alt={saree.images[0].alt || saree.productName}
                  className="w-full object-contain"
                />
              ) : (
                "No Image"
              )}
              <div className="p-4">
                <h3 className="text-sm text-center font-bold font-secondary text-gray-700">
                  {saree.productName}
                </h3>
                <p className="text-gray-700 text-sm font-secondary text-center">
                  ₹{saree.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="flex overflow-x-auto md:hidden gap-2 pt-6">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/collections/${saree.category}/${encodeURIComponent(
                saree.slug.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className="bg-white hover:shadow-md transition min-w-[130px] overflow-hidden block"
            >
              {saree.images && saree.images[0] ? (
                <img
                  src={saree.images[0].url}
                  alt={saree.images[0].alt || saree.productName}
                  className="w-full object-contain"
                />
              ) : (
                "No Image"
              )}
              <div className="p-2">
                <h3 className="text-xs text-center font-bold font-secondary text-gray-700">
                  {saree.productName}
                </h3>
                <p className="text-gray-700 text-xs font-secondary text-center">
                  ₹{saree.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All button */}
        <div className="text-center mt-6">
          <Link
            href="/collections/new-arrivals"
            className="font-secondary 
                      px-2 py-1 text-sm
                      sm:px-4 sm:py-1 sm:text-base 
                      text-gray-500 rounded 
                      ring-1 ring-gray-500 
                      hover:ring-2 
                      transition-all duration-300 ease-in-out"
          >
            VIEW ALL
          </Link>
        </div>
      </section>

      {/* New Arrivals (same as above, you can filter by new if needed) */}
      <section className="max-w-[1440px] mx-auto py-8 px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B22222]">
          NEW ARRIVALS
        </h2>

        <div className="grid grid-cols-5 gap-8 hidden md:grid pt-6">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/collections/${saree.category}/${encodeURIComponent(
                saree.slug.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className="bg-white hover:shadow-md transition overflow-hidden relative block"
            >
              {saree.images && saree.images[0] ? (
                <img
                  src={saree.images[0].url}
                  alt={saree.images[0].alt || saree.productName}
                  className="w-full object-contain"
                />
              ) : (
                "No Image"
              )}
              {/* New Tag */}
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-secondary font-bold px-2 py-1">
                New
              </div>
              <div className="p-4">
                <h3 className="text-sm text-center font-bold font-secondary text-gray-700">
                  {saree.productName}
                </h3>
                <p className="text-gray-700 text-sm font-secondary text-center">
                  ₹{saree.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="flex overflow-x-auto md:hidden gap-2 pt-6">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/collections/${saree.category}/${encodeURIComponent(
                saree.slug.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className="bg-white hover:shadow-md transition min-w-[130px] overflow-hidden relative block"
            >
              {saree.images && saree.images[0] ? (
                <img
                  src={saree.images[0].url}
                  alt={saree.images[0].alt || saree.productName}
                  className="w-full object-contain"
                />
              ) : (
                "No Image"
              )}
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-secondary font-bold px-2 py-1">
                New
              </div>
              <div className="p-2">
                <h3 className="text-xs text-center font-bold font-secondary text-gray-700">
                  {saree.productName}
                </h3>
                <p className="text-gray-700 text-xs font-secondary text-center">
                  ₹{saree.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All button */}
        <div className="text-center mt-6">
          <Link
            href="/collections/new-arrivals"
            className="font-secondary 
                      px-2 py-1 text-sm
                      sm:px-4 sm:py-1 sm:text-base 
                      text-gray-500 rounded 
                      ring-1 ring-gray-500 
                      hover:ring-2 
                      transition-all duration-300 ease-in-out"
          >
            VIEW ALL
          </Link>
        </div>
      </section>

      {/* Leave a Review button */}
      <section className="bg-white py-12 text-center">
        <h2 className="text-2xl font-bold text-[#B22222] mb-4">
          Share Your Experience
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Loved your experience with Soundarya&apos;s Boutique? We&apos;d love
          to hear from you! Your feedback helps us grow.
        </p>
        <button
          onClick={openModal}
          className="bg-[#A52A2A] text-white font-medium py-3 px-8 rounded-md hover:bg-[#8B0000] transition-colors duration-200"
        >
          Leave a Review
        </button>
        <Link
          href="/my-reviews"
          className="ml-4 bg-[#A52A2A] text-white font-medium py-3 px-8 rounded-md hover:bg-[#8B0000] transition-colors duration-200"
        >
          View My Reviews
        </Link>
      </section>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="relative w-full max-w-lg mx-4 p-8 rounded-2xl
            bg-white/90 backdrop-blur-xl border border-[#A52A2A]/20 
            shadow-2xl shadow-[#A52A2A]/40 
            transform transition-all duration-300 scale-95 animate-fadeIn"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-[#8B0000] transition"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-semibold text-center text-[#A52A2A] mb-6">
              Feedback Poll
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="reviewerName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="reviewerName"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A52A2A] transition"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which service did you use?
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A52A2A] transition"
                  required
                >
                  <option value="">Select one</option>
                  <option value="Sarees">Sarees</option>
                  <option value="Blouse Stitching">Blouse Stitching</option>
                  <option value="Lehengas">Lehengas</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Would you recommend us to others?
                </label>
                <div className="flex space-x-6 justify-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="recommend"
                      value="Yes"
                      checked={recommend === "Yes"}
                      onChange={() => setRecommend("Yes")}
                      className="accent-[#A52A2A]"
                      required
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="recommend"
                      value="No"
                      checked={recommend === "No"}
                      onChange={() => setRecommend("No")}
                      className="accent-[#A52A2A]"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating
                </label>
                <div className="flex justify-center space-x-2">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <Star
                        key={ratingValue}
                        size={32}
                        className="cursor-pointer transition-transform hover:scale-110"
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(ratingValue)}
                        fill={
                          ratingValue <= (hoverRating || rating)
                            ? "#FFC107"
                            : "#8b8c92ff"
                        }
                        stroke={
                          ratingValue <= (hoverRating || rating)
                            ? "#FFC107"
                            : "#e4e5e9"
                        }
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A52A2A] transition"
                  placeholder="Tell us about your experience..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#A52A2A] to-[#8B0000] 
                  text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
