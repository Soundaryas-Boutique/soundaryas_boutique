"use client";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useState } from "react";
import { Star, X, MessageSquare, Send, Feather } from 'lucide-react';

// --- MOCK DATA FOR REVIEWS ---
const mockReviews = [
  {
    id: 1,
    author: "Priya S.",
    rating: 5,
    date: "2025-10-01",
    comment: "The color and fabric are even more beautiful in person. Absolutely in love with this saree! The delivery was also very prompt."
  },
  {
    id: 2,
    author: "Anjali M.",
    rating: 4,
    date: "2025-09-28",
    comment: "Excellent quality for the price. It's a little darker than the picture, but still gorgeous. I would recommend it."
  },
];

// --- HELPER COMPONENTS FOR THE REVIEW SECTION (UI IMPROVED) ---

const StarRatingDisplay = ({ rating, size = 20 }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={size} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} fill="currentColor" />
    ))}
  </div>
);

// UI IMPROVEMENT: The form has slightly better spacing and button interaction.
function ProductReviewForm({ isOpen, onClose, product }) {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !name || !comment || !phone || !email) {
      alert("Please fill out all required fields.");
      return;
    }
    console.log("Submitting Review:", { 
      productName: product.productName, 
      material: product.material,
      name, phone, email, rating, comment 
    });
    alert("Thank you for your review!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative transform transition-transform duration-300 scale-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-[#B22222] mb-2">Write a review for</h2>
        <p className="text-lg text-gray-700 mb-6 font-medium">
          {product.productName} <span className="text-gray-500 font-normal">({product.material})</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Your Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Phone No. *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" required />
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Your Rating *</label>
            <div className="flex space-x-1">{[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return ( <Star key={starValue} size={32} className="cursor-pointer transition-transform hover:scale-110" onMouseEnter={() => setHoverRating(starValue)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(starValue)} fill={starValue <= (hoverRating || rating) ? "#FFC107" : "none"} stroke={starValue <= (hoverRating || rating) ? "#FFC107" : "#9ca3af"} /> );
            })}</div>
          </div>
           <div>
            <label className="block font-medium text-gray-700 mb-1">Your Comment *</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="form-input" placeholder="What did you like or dislike?" required />
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#B22222] text-white py-3 rounded-lg font-semibold hover:bg-[#8B0000] transition-all duration-200 hover:-translate-y-0.5">
            <Send size={18} />
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

// UI IMPROVEMENT: This entire section has been redesigned for a cleaner, more modern look.
function ReviewsSection({ reviews, onWriteReviewClick }) {
  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0;

  return (
    <section className="mt-16 pt-10 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
               <p className="text-4xl font-bold text-[#B22222]">{averageRating.toFixed(1)}</p>
               <div>
                 <StarRatingDisplay rating={averageRating} />
                 <p className="text-sm text-gray-500">Based on {reviews.length} reviews</p>
               </div>
            </div>
          )}
        </div>
        <button onClick={onWriteReviewClick} className="mt-4 sm:mt-0 flex items-center gap-2 bg-white text-[#B22222] font-bold py-2 px-5 rounded-full border-2 border-[#B22222] hover:bg-[#FEECEB] transition-transform duration-200 hover:scale-105">
          <MessageSquare size={20} />
          Write a Review
        </button>
      </div>

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="flex items-start gap-4 p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 bg-[#FEECEB] text-[#B22222] font-bold flex items-center justify-center rounded-full text-xl">
                {review.author.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg text-gray-800">{review.author}</h3>
                  <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="mb-2">
                  <StarRatingDisplay rating={review.rating} />
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 px-6 bg-slate-50 rounded-xl border border-dashed">
            <Feather size={40} className="mx-auto text-gray-400"/>
            <h3 className="text-xl font-medium text-gray-700 mt-4">No Reviews Yet</h3>
            <p className="text-gray-500 mt-2">Be the first to share your thoughts on this product!</p>
          </div>
        )}
      </div>
    </section>
  );
}


export default function ProductDetailsClient({ saree }) {
  saree.reviews = mockReviews;
  
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [showBuyToast, setShowBuyToast] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false); 

  const defaultImage = saree.images && saree.images.length > 0 ? saree.images[0]?.url : "/no-image.jpg";
  const [mainImage, setMainImage] = useState(defaultImage);

  const handleAddToCart = () => {
    addToCart(saree);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };
  
  const handleBuyNow = () => {
    console.log("Redirecting to checkout with:", saree.productName);
    setShowBuyToast(true);
    setTimeout(() => setShowBuyToast(false), 2000);
  };

  if (!saree) return null;

  return (
    <>
      <main className="max-w-6xl mx-auto py-12 px-4 md:px-8 bg-white">
        {showToast && <div className="fixed top-20 right-5 z-50 bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow-xl animate-fadeInOut">Product added to cart successfully.</div>}
        {showBuyToast && <div className="fixed top-20 right-5 z-50 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-xl animate-fadeInOut">Initiating secure checkout...</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[550px] mb-6 aspect-square relative border border-gray-200 rounded-xl overflow-hidden">
              <Image src={mainImage} alt={saree.productName} fill sizes="(max-width: 768px) 100vw, 500px" className="object-cover transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="flex gap-3 overflow-x-auto w-full max-w-[550px] p-2">
              {saree.images && saree.images.map((img, index) => (
                <div key={index} className={`relative w-24 h-24 flex-shrink-0 rounded-lg border-2 cursor-pointer transition-all duration-200 ${mainImage === img.url ? 'border-[#B22222] scale-[1.02] shadow-md' : 'border-gray-300 hover:border-gray-500'}`} onClick={() => setMainImage(img.url)}>
                  <Image src={img.url} alt={img.alt || saree.productName} fill sizes="96px" className="object-cover rounded-md" />
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 md:p-0">
            <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">{saree.category}</p>
            <h1 className="text-5xl font-extrabold text-[#B22222] mb-4 leading-tight">{saree.productName}</h1>
            <p className="text-gray-700 mb-6 text-lg border-b pb-6">{saree.description}</p>
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-bold text-gray-900">₹{saree.price.toFixed(2)}</span>
              {saree.discountPrice && <span className="text-2xl text-red-500 line-through opacity-70">₹{saree.discountPrice.toFixed(2)}</span>}
            </div>
            <div className="space-y-3 mb-8 text-base text-gray-700 p-4 bg-gray-50 rounded-lg">
              <p><span className="font-semibold text-[#B22222]">Material:</span> {saree.material}</p>
              {saree.sizes && <p><span className="font-semibold text-[#B22222]">Sizes:</span> {saree.sizes.join(", ")}</p>}
              {saree.colors && <p><span className="font-semibold text-[#B22222]">Colors:</span> {saree.colors.join(", ")}</p>}
              <p className="pt-2 text-sm text-gray-500 border-t mt-4">
                <span className="font-medium">Availability:</span> <span className={`font-bold ${saree.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{saree.stock > 0 ? `${saree.stock} in Stock` : 'Out of Stock'}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
              <button onClick={handleAddToCart} disabled={saree.stock === 0} className="flex-1 bg-[#B22222] text-white font-extrabold text-lg py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-[#B22222]/50 hover:bg-[#8B0000] disabled:bg-gray-400 disabled:shadow-none">Add to Cart</button>
              <button onClick={handleBuyNow} disabled={saree.stock === 0} className="flex-1 bg-white text-[#B22222] font-extrabold text-lg py-3 px-8 rounded-full border-2 border-[#B22222] transition-all duration-300 shadow-md hover:bg-[#FEECEB] disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-300 disabled:shadow-none">Buy Now</button>
            </div>
          </div>
        </div>
        <ReviewsSection 
          reviews={saree.reviews || []} 
          onWriteReviewClick={() => setShowReviewForm(true)}
        />
      </main>
      <ProductReviewForm 
        isOpen={showReviewForm} 
        onClose={() => setShowReviewForm(false)} 
        product={saree}
      />
      <style jsx global>{`
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(178, 34, 34, 0.3);
          border-color: #B22222;
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(-20px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInOut {
          animation: fadeInOut 2s ease-in-out forwards;
        }
      `}</style>
    </>
  );
}