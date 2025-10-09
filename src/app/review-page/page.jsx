"use client";

import { useState, useEffect } from "react";
import { Star, Search, Send, Loader, Edit, Trash2, X, ShoppingBag } from "lucide-react";
import Link from 'next/link';

const productData = {
  "Silk Sarees": ["Pure Silk", "Art Silk", "Blended Silk"],
  "Cotton Sarees": ["Pure Cotton", "Cotton Blend", "Linen Cotton"],
  "Kanchipuram": ["Pure Silk", "Silk Cotton"],
  "Banarasi": ["Pure Silk", "Satin Silk", "Organza Silk"],
  "Custom Tailoring": ["Cotton", "Silk", "Linen", "Polyester"]
};

function EditReviewModal({ review, onClose, onUpdate }) {
  if (!review) return null;

  const [formData, setFormData] = useState(review);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating) => {
    setFormData(prev => ({ ...prev, rating: newRating }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdate(formData._id, formData);
      onClose();
    } catch (error) {
      console.error("Failed to update:", error);
      alert("Update failed. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-[#B22222] mb-4">Edit Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div><label className="block font-medium text-gray-700 mb-1">Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required /></div>
          <div><label className="block font-medium text-gray-700 mb-1">Comment</label><textarea name="comment" value={formData.comment} onChange={handleChange} rows={4} className="form-input" /></div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Rating *</label>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return <Star key={starValue} size={28} className="cursor-pointer" onClick={() => handleRatingChange(starValue)} fill={starValue <= formData.rating ? "#FFC107" : "none"} stroke="#B22222" />;
              })}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" disabled={isUpdating} className="px-5 py-2 text-sm font-semibold text-white bg-[#B22222] rounded-lg hover:bg-[#8B0000] disabled:bg-gray-400 flex items-center gap-2">
              {isUpdating && <Loader className="animate-spin" size={16}/>}
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default function ReviewPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState("");
  const [poll, setPoll] = useState({ quality: null, comfort: null, price: null, recommend: null, overall: null });

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest-first");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      // CORRECTED: Ensure all fetch calls use the correct API endpoint
      const res = await fetch('/api/site-reviews');
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please provide an overall rating.");
      return;
    }
    setIsSubmitting(true);
    const reviewData = { name, phone, email, category, material, rating, comment: comments };
    if (Object.values(poll).some(v => v !== null)) {
      reviewData.poll = poll;
    }
    try {
      // CORRECTED: Ensure all fetch calls use the correct API endpoint
      const res = await fetch('/api/site-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (res.ok) {
        setName(''); setPhone(''); setEmail(''); setCategory(''); setMaterial('');
        setRating(0); setComments(''); setPoll({ quality: null, comfort: null, price: null, recommend: null, overall: null });
        await fetchReviews();
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        // CORRECTED: Ensure all fetch calls use the correct API endpoint
        const res = await fetch(`/api/site-reviews/${reviewId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Delete failed");
        setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
      } catch (error) {
        alert("Failed to delete review.");
      }
    }
  };

  const handleUpdateReview = async (reviewId, updatedData) => {
    try {
      // CORRECTED: Ensure all fetch calls use the correct API endpoint
      const res = await fetch(`/api/site-reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Update failed");
      const { review: newReview } = await res.json();
      setReviews(prevReviews => prevReviews.map(review => review._id === reviewId ? newReview : review));
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  };

  const displayedReviews = (reviews || [])
    .filter((review) => {
      const reviewDate = new Date(review.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (end) end.setHours(23, 59, 59, 999);
      const matchesSearch = review.comment && review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = (!start || reviewDate >= start) && (!end || reviewDate <= end);
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date); const dateB = new Date(b.date);
      return sortOrder === "newest-first" ? dateB - dateA : dateA - dateB;
    });

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setMaterial("");
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' });
  const DisplayStars = ({ count }) => ( <div className="flex items-center">{[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < count ? "#FFC107" : "none"} stroke="#B22222" />)}</div> );

  return (
    <>
      <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Customer Reviews</h1>
              <p className="text-gray-500 mt-1">We value your feedback. Share your experience with us!</p>
            </div>
            <Link href="/" passHref>
              <button className="flex items-center gap-2 bg-[#B22222] text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-[#8B0000] hover:-translate-y-0.5 transition-all duration-300">
                <ShoppingBag size={18} />
                Go to Store
              </button>
            </Link>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-[#B22222] mb-2 border-b pb-4">Write a Review</h2>
              <p className="text-sm text-gray-500 mt-2 mb-6">Fields marked with an asterisk (*) are required.</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className="block font-medium text-gray-700 mb-1">Name *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" required /></div>
                  <div><label className="block font-medium text-gray-700 mb-1">Phone *</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" required /></div>
                </div>
                <div><label className="block font-medium text-gray-700 mb-1">Email *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className="block font-medium text-gray-700 mb-1">Category *</label><select value={category} onChange={handleCategoryChange} className="form-input" required><option value="">Select a Category</option>{Object.keys(productData).map((cat) => (<option key={cat} value={cat}>{cat}</option>))}</select></div>
                  <div><label className="block font-medium text-gray-700 mb-1">Material *</label><select value={material} onChange={(e) => setMaterial(e.target.value)} className="form-input" required disabled={!category}><option value="">Select a Material</option>{category && productData[category].map((mat) => (<option key={mat} value={mat}>{mat}</option>))}</select></div>
                </div>
                <div><label className="block font-medium text-gray-700 mb-2">Overall Rating *</label><div className="flex space-x-1">{[...Array(5)].map((_, index) => { const starValue = index + 1; return <Star key={starValue} size={32} className="cursor-pointer transition-transform hover:scale-110" onMouseEnter={() => setHoverRating(starValue)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(starValue)} fill={starValue <= (hoverRating || rating) ? "#FFC107" : "none"} stroke="#B22222" />; })}</div></div>
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-[#B22222]">Quick Feedback (Optional)</h3>
                  <p className="text-sm text-gray-500 mb-4">Rate from 1 (Poor) to 5 (Excellent)</p>
                  <div className="space-y-4">{Object.keys(poll).map((key) => (<div key={key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between"><label className="capitalize font-medium text-gray-600 mb-2 sm:mb-0">{key}?</label><div className="flex items-center space-x-2">{[1, 2, 3, 4, 5].map((num) => (<button type="button" key={num} onClick={() => setPoll({ ...poll, [key]: num })} className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 border ${poll[key] === num ? "bg-[#B22222] text-white border-[#B22222] scale-110" : "bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-[#B22222]"}`}>{num}</button>))}</div></div>))}</div>
                </div>
                <div><label className="block font-medium text-gray-700 mb-1">Comments</label><textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={4} className="form-input" placeholder="Tell us more about your experience..." /></div>
                <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-[#B22222] text-white py-3 rounded-lg font-semibold hover:bg-[#8B0000] transition-colors disabled:bg-gray-400">
                  {isSubmitting ? <Loader className="animate-spin" size={20}/> : <Send size={18} />}
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-[#B22222] mb-4">All Reviews ({displayedReviews.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="relative md:col-span-2"><input type="text" placeholder="Search by comments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input pl-4" /></div>
                  <div><label className="text-sm font-medium text-gray-600">From Date</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-input" /></div>
                  <div><label className="text-sm font-medium text-gray-600">To Date</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-input" /></div>
                  <div className="md:col-span-2"><label className="text-sm font-medium text-gray-600">Sort By</label><select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="form-input bg-white"><option value="newest-first">Newest to Oldest</option><option value="oldest-first">Oldest to Newest</option></select></div>
                </div>
                <div className="space-y-5">
                  {isLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading reviews...</div>
                  ) : displayedReviews.length > 0 ? (
                    displayedReviews.map((rev) => (
                      <div key={rev._id} className="border p-4 rounded-lg shadow-sm bg-gray-50/50">
                        <div className="flex justify-between items-start">
                          <div><h4 className="font-bold text-gray-800">{rev.name}</h4><p className="text-sm text-gray-500 mb-2">Reviewed: <span className="font-medium text-[#B22222]">{rev.category} ({rev.material})</span></p></div>
                          <div className="text-xs text-gray-500 text-right flex-shrink-0">{formatDate(rev.date)}</div>
                        </div>
                        <DisplayStars count={rev.rating} />
                        <p className="mt-3 text-gray-700 text-sm leading-relaxed">{rev.comment}</p>
                        <div className="flex items-center gap-3 mt-4 border-t pt-3">
                          <button onClick={() => setEditingReview(rev)} className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"><Edit size={14}/> Edit</button>
                          <button onClick={() => handleDeleteReview(rev._id)} className="flex items-center gap-1.5 text-xs text-red-600 hover:underline"><Trash2 size={14}/> Delete</button>
                        </div>
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

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onUpdate={handleUpdateReview}
        />
      )}
    </>
  );
}