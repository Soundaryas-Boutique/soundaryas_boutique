"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SlidingBanner from "../../components/SlidingBanner";
import { Star, X } from "lucide-react";

export default function HomePage() {
  const [sarees, setSarees] = useState([]);

  // State and functions for the review modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setRating(0);
    setComment("");
    setReviewerName("");
    setHoverRating(0);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating > 0 && comment.trim() !== "" && reviewerName.trim() !== "") {
      const reviewData = {
        rating,
        comment,
        author: reviewerName,
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

  useEffect(() => {
    fetch("/api/sarees")
      .then((res) => res.json())
      .then((data) => setSarees(data))
      .catch((err) => console.error("Error fetching sarees:", err));
  }, []);

  return (
    <main>
      <SlidingBanner />

      {/* Best Sellers */}
      <section className="max-w-[1440px] mx-auto pt-16 pb-8 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center text-[#B22222]">
          BEST SELLERS
        </h2>

        {/* Desktop grid */}
        <div className="grid grid-cols-5 gap-8 hidden md:grid pt-10">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/collections/${saree.category}/${encodeURIComponent(
                saree.productName.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className="bg-white hover:shadow-md transition overflow-hidden block"
            >
              {saree.imgSrc && (
                <img
                  src={saree.imgSrc}
                  alt={saree.productName}
                  className="w-full object-contain"
                />
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
        <div className="flex overflow-x-auto md:hidden gap-2 pt-10">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/collections/${saree.category}/${encodeURIComponent(
                saree.productName.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className="bg-white hover:shadow-md transition min-w-[130px] overflow-hidden block"
            >
              {saree.imgSrc && (
                <img
                  src={saree.imgSrc}
                  alt={saree.productName}
                  className="w-full object-contain"
                />
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
            className="px-4 py-2 font-medium text-gray-500 rounded 
                      ring-1 ring-gray-500 
                      hover:ring-2 
                      transition-all duration-300 ease-in-out"
          >
            View All
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-[1440px] mx-auto py-8 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center text-[#B22222]">
          NEW ARRIVALS
        </h2>

        {/* Desktop grid */}
        <div className="grid grid-cols-5 gap-8 hidden md:grid pt-10">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/collections/${saree.category}/${encodeURIComponent(
                saree.productName.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className="bg-white hover:shadow-md transition overflow-hidden relative block"
            >
              {saree.imgSrc && (
                <img
                  src={saree.imgSrc}
                  alt={saree.productName}
                  className="w-full object-contain"
                />
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
        <div className="flex overflow-x-auto md:hidden gap-2 pt-10">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/collections/${saree.category}/${encodeURIComponent(
                saree.productName.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className="bg-white hover:shadow-md transition min-w-[130px] overflow-hidden relative block"
            >
              {saree.imgSrc && (
                <img
                  src={saree.imgSrc}
                  alt={saree.productName}
                  className="w-full object-contain"
                />
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
            className="px-4 py-2 font-medium text-gray-500 rounded 
                      ring-1 ring-gray-500 
                      hover:ring-2 
                      transition-all duration-300 ease-in-out"
          >
            View All
          </Link>
        </div>
      </section>

      {/* Site Review Section */}
      <section className="bg-white py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#B22222] mb-4">
            Share Your Experience
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Loved your experience with Soundarya's Boutique? We'd love to hear
            from you! Your feedback helps us grow.
          </p>
          <button
            onClick={openModal}
            className="bg-[#A52A2A] text-white font-medium py-3 px-8 rounded-md hover:bg-[#8B0000] transition-colors duration-200"
          >
            Leave a Review
          </button>
        </div>
      </section>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold text-[#A52A2A]">
                How was your experience?
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-[#8B0000]"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
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
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <Star
                        key={ratingValue}
                        size={28}
                        className="cursor-pointer transition-colors"
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(ratingValue)}
                        fill={
                          ratingValue <= (hoverRating || rating)
                            ? "#FFC107"
                            : "#e4e5e9"
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
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  placeholder="Tell us about your experience..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#A52A2A] text-white font-medium rounded-md hover:bg-[#8B0000] transition-colors"
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
