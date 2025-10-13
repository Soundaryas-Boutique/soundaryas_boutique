"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { 
  Star, MessageSquare, ChevronLeft, CheckSquare, X,
  Award, Sofa, Tag, ThumbsUp, Feather
} from "lucide-react";

// --- HELPER COMPONENTS ---

// 1. Star Rating Display
const StarRatingDisplay = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={16} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} fill="currentColor" />
    ))}
  </div>
);

// 2. Poll Analysis Modal
const pollCategories = {
  quality: { label: 'Quality', icon: Award, color: 'text-blue-500' },
  comfort: { label: 'Comfort', icon: Sofa, color: 'text-green-500' },
  price: { label: 'Price', icon: Tag, color: 'text-purple-500' },
  recommend: { label: 'Recommend', icon: ThumbsUp, color: 'text-red-500' },
  overall: { label: 'Overall', icon: Star, color: 'text-yellow-500' },
};

function PollAnalysisModal({ isOpen, onClose, reviews }) {
  if (!isOpen) return null;

  const reviewsWithPollData = reviews.filter(review => review.poll);
  const pollCount = reviewsWithPollData.length;

  const averageScores = Object.keys(pollCategories).reduce((acc, key) => {
    // Add a safety check in case a review's poll object is missing a key
    const sum = reviewsWithPollData.reduce((total, review) => total + (review.poll[key] || 0), 0);
    acc[key] = pollCount > 0 ? (sum / pollCount) : 0;
    return acc;
  }, {});

  const radarChartData = Object.keys(pollCategories).map(key => ({
    subject: pollCategories[key].label,
    score: parseFloat(averageScores[key].toFixed(2)),
    fullMark: 5,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Feedback Poll Analysis</h2>
        <p className="text-sm text-gray-500 mb-6">Based on {pollCount} poll submissions.</p>

        {pollCount > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6} />
                  <Radar name="Avg Score" dataKey="score" stroke="#B22222" fill="#B22222" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(pollCategories).map(key => {
                const Icon = pollCategories[key].icon;
                const score = averageScores[key];
                return (
                  <div key={key} className="bg-slate-50 p-4 rounded-xl border">
                    <div className="flex items-center gap-3"><Icon size={20} className={pollCategories[key].color} /><h3 className="font-semibold text-gray-600">{pollCategories[key].label}</h3></div>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{score.toFixed(1)}<span className="text-lg text-gray-400">/5</span></p>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">No poll data has been submitted yet.</p>
        )}
      </div>
    </div>
  );
}


// --- MAIN DASHBOARD COMPONENT ---

export default function ReviewsDashboardPage() {
  const router = useRouter();
  
  // --- CHANGE: State now manages live data and loading status ---
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);

  // --- CHANGE: Fetch data from the API when the component mounts ---
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/site-reviews');
        if (!res.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []); // Empty array ensures this runs once on page load

  // --- Process General Review Data (now uses 'reviews' state) ---
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews) : 0;
  const pollSubmissionCount = reviews.filter(r => r.poll).length;

  const ratingCounts = reviews.reduce((acc, r) => { acc[r.rating] = (acc[r.rating] || 0) + 1; return acc; }, {});
  const ratingDistributionData = Object.keys(ratingCounts).map(key => ({ name: `${key} Star${parseInt(key) > 1 ? 's' : ''}`, value: ratingCounts[key] })).sort((a, b) => parseInt(b.name) - parseInt(a.name));
  
  const COLORS = { rating: ["#22c55e", "#84cc16", "#facc15", "#fb923c", "#ef4444"] };

  // --- CHANGE: Render a loading state while fetching data ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-500">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="mb-6 px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition flex items-center gap-2 shadow-sm border">
            <ChevronLeft size={18} /> Back
          </button>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Product Reviews Dashboard</h1>
          <p className="text-gray-500 mb-8">An overview of all customer feedback and ratings.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-5">
              <div className="bg-blue-100 p-4 rounded-full"><MessageSquare className="text-blue-600" size={28}/></div>
              <div><p className="text-sm text-gray-500">Total Reviews</p><p className="text-3xl font-bold text-gray-800">{totalReviews}</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-5">
              <div className="bg-yellow-100 p-4 rounded-full"><Star className="text-yellow-500" size={28}/></div>
              <div><p className="text-sm text-gray-500">Average Rating</p><p className="text-3xl font-bold text-gray-800">{averageRating.toFixed(1)} / 5.0</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
              <div className="flex items-center gap-5">
                <div className="bg-green-100 p-4 rounded-full"><CheckSquare className="text-green-600" size={28}/></div>
                <div><p className="text-sm text-gray-500">Poll Submissions</p><p className="text-3xl font-bold text-gray-800">{pollSubmissionCount}</p></div>
              </div>
              <button 
                onClick={() => setIsPollModalOpen(true)}
                className="w-full mt-4 text-sm font-semibold bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition"
              >
                View Poll Analysis
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Overall Rating Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={ratingDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} fill="#8884d8" label={({ name, value }) => `${name}: ${value}`}>
                  {ratingDistributionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS.rating[index % COLORS.rating.length]} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Customer Feedback</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-gray-600">Author</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Rating</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Comment</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <tr key={review._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="p-3 font-medium text-gray-800">{review.name}</td>
                        <td className="p-3"><StarRatingDisplay rating={review.rating} /></td>
                        <td className="p-3 text-gray-600 text-sm italic">"{review.comment}"</td>
                        <td className="p-3 text-gray-500 text-sm">{new Date(review.date).toLocaleDateString("en-GB")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-gray-500">
                          <Feather size={32} className="mx-auto text-gray-400 mb-2"/>
                          No reviews have been submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <PollAnalysisModal 
        isOpen={isPollModalOpen} 
        onClose={() => setIsPollModalOpen(false)} 
        reviews={reviews} 
      />
    </>
  );
}
