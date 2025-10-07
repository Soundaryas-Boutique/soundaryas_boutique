"use client";

import { useState } from "react";
import { Star, Search, Send } from "lucide-react";

// Data for the dynamic dropdowns
const productData = {
  "Silk Sarees": ["Pure Silk", "Art Silk", "Blended Silk"],
  "Cotton Sarees": ["Pure Cotton", "Cotton Blend", "Linen Cotton"],
  "Kanchipuram": ["Pure Silk", "Silk Cotton"],
  "Banarasi": ["Pure Silk", "Satin Silk", "Organza Silk"],
  "Custom Tailoring": ["Cotton", "Silk", "Linen", "Polyester"]
};

export default function ReviewPage() {
  // --- Form State ---
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(""); // New state for category
  const [material, setMaterial] = useState("");   // New state for material
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState("");
  const [poll, setPoll] = useState({
    quality: null, comfort: null, price: null, recommend: null, overall: null,
  });

  // --- Review List State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest-first");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const reviews = [
    {
      id: 1, name: "Krishnan", category: "Kanchipuram", material: "Pure Silk", rating: 5,
      comment: "Absolutely stunning saree and the quality is top-notch. The customer service was excellent.",
      date: "2025-09-19",
    },
    {
      id: 2, name: "Anjali Menon", category: "Custom Tailoring", material: "Cotton", rating: 4,
      comment: "The fitting of the blouse was almost perfect. There was a slight delay in delivery, but the craftsmanship is undeniable.",
      date: "2025-09-15",
    },
    {
      id: 3, name: "Priya Sharma", category: "Banarasi", material: "Satin Silk", rating: 5,
      comment: "I am amazed by the attention to detail in the custom suit they made for me. It fits like a dream! The quality is great.",
      date: "2025-09-10",
    },
    {
      id: 4, name: "Ravi Kumar", category: "Cotton Sarees", material: "Pure Cotton", rating: 4,
      comment: "Good collection, but the store was a bit crowded. Found a beautiful piece.",
      date: "2025-08-25",
    },
  ];

  const displayedReviews = reviews
    .filter((review) => {
      const reviewDate = new Date(review.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (end) end.setHours(23, 59, 59, 999);
      const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = (!start || reviewDate >= start) && (!end || reviewDate <= end);
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date); const dateB = new Date(b.date);
      return sortOrder === "newest-first" ? dateB - dateA : dateA - dateB;
    });

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setMaterial(""); // Reset material when category changes
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' });

  const DisplayStars = ({ count }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < count ? "#FFC107" : "none"} stroke="#B22222" />)}
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Customer Reviews</h1>
          <p className="text-gray-500 mt-1">We value your feedback. Share your experience with us!</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-[#B22222] mb-2 border-b pb-4">Write a Review</h2>
            <p className="text-sm text-gray-500 mt-2 mb-6">Fields marked with an asterisk (*) are required.</p>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Phone *</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" required />
                </div>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
              </div>

              {/* --- UPDATED CATEGORY AND MATERIAL FIELDS --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Category *</label>
                  <select value={category} onChange={handleCategoryChange} className="form-input" required>
                    <option value="">Select a Category</option>
                    {Object.keys(productData).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Material *</label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="form-input"
                    required
                    disabled={!category} // Disable if no category is selected
                  >
                    <option value="">Select a Material</option>
                    {category && productData[category].map((mat) => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">Overall Rating *</label>
                <div className="flex space-x-1">{[...Array(5)].map((_, index) => { const starValue = index + 1; return <Star key={starValue} size={32} className="cursor-pointer transition-transform hover:scale-110" onMouseEnter={() => setHoverRating(starValue)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(starValue)} fill={starValue <= (hoverRating || rating) ? "#FFC107" : "none"} stroke="#B22222" />; })}</div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-semibold text-[#B22222]">Quick Feedback (Optional)</h3>
                <p className="text-sm text-gray-500 mb-4">Rate from 1 (Poor) to 5 (Excellent)</p>
                <div className="space-y-4">{Object.keys(poll).map((key) => (<div key={key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between"><label className="capitalize font-medium text-gray-600 mb-2 sm:mb-0">{key}?</label><div className="flex items-center space-x-2">{[1, 2, 3, 4, 5].map((num) => (<button type="button" key={num} onClick={() => setPoll({ ...poll, [key]: num })} className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 border ${poll[key] === num ? "bg-[#B22222] text-white border-[#B22222] scale-110" : "bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-[#B22222]"}`}>{num}</button>))}</div></div>))}</div>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Comments</label>
                <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={4} className="form-input" placeholder="Tell us more about your experience..." />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#B22222] text-white py-3 rounded-lg font-semibold hover:bg-[#8B0000] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B22222]"><Send size={18} />Submit Review</button>
            </form>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-[#B22222] mb-4">All Reviews ({displayedReviews.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative md:col-span-2">
                  
                  <input type="text" placeholder="Search by comments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input pl-10" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">From Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">To Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-input" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Sort By</label>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="form-input bg-white">
                    <option value="newest-first">Newest to Oldest</option>
                    <option value="oldest-first">Oldest to Newest</option>
                  </select>
                </div>
              </div>
              <div className="space-y-5">
                {displayedReviews.length > 0 ? (
                  displayedReviews.map((rev) => (
                    <div key={rev.id} className="border p-4 rounded-lg shadow-sm bg-gray-50/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-800">{rev.name}</h4>
                          {/* --- UPDATED REVIEW DISPLAY --- */}
                          <p className="text-sm text-gray-500 mb-2">Reviewed: <span className="font-medium text-[#B22222]">{rev.category} ({rev.material})</span></p>
                        </div>
                        <div className="text-xs text-gray-500 text-right flex-shrink-0">{formatDate(rev.date)}</div>
                      </div>
                      <DisplayStars count={rev.rating} />
                      <p className="mt-3 text-gray-700 text-sm leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No reviews found for the selected criteria.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .form-input { width: 100%; padding: 0.65rem; border: 1px solid #d1d5db; border-radius: 0.5rem; transition: all 0.2s; margin-top: 4px; appearance: none; background-color: #fff; }
        .form-input:focus { outline: none; box-shadow: 0 0 0 2px #B22222; border-color: #B22222; }
        .form-input:disabled { background-color: #f3f4f6; cursor: not-allowed; }
        select.form-input { background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>'); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; padding-right: 2.5rem; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; }
      `}</style>
    </main>
  );
}