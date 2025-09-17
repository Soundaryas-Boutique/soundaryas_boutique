"use client";
import React, { Component } from "react";
import { Star, Trash2, Edit } from "lucide-react";

export default class MyReviewsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      editingReview: null,
      updatedComment: "",
      updatedService: "",
      updatedRecommend: "",
      updatedRating: 0,
      hoverRating: 0,
      services: ["Saree","Blouse Stiching","Lehagas","Other"],
      recommendations: ["Yes", "No"],
    };
  }

  componentDidMount() {
    this.fetchMyReviews();
  }

  // Fetch all reviews
  fetchMyReviews = async () => {
    try {
      const res = await fetch("/api/site-reviews");
      const data = await res.json();
      this.setState({ reviews: data });
    } catch (err) {
      console.error("❌ Error fetching reviews:", err);
    }
  };

  // Delete review
  handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/site-reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        this.setState((prev) => ({
          reviews: prev.reviews.filter((r) => r._id !== id),
        }));
      }
    } catch (err) {
      console.error("❌ Error deleting review:", err);
    }
  };

  // Start editing mode
  startEditing = (review) => {
    this.setState({
      editingReview: review._id,
      updatedComment: review.comment || "",
      updatedService: review.service || "",
      updatedRecommend: review.recommend || "",
      updatedRating: review.rating,
    });
  };

  // Update review
  handleUpdate = async (id) => {
    try {
      const { updatedComment, updatedService, updatedRecommend, updatedRating } =
        this.state;

      const res = await fetch(`/api/site-reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: updatedComment,
          service: updatedService,
          recommend: updatedRecommend,
          rating: updatedRating,
        }),
      });

      if (res.ok) {
        await this.fetchMyReviews();
        this.setState({ editingReview: null });
      }
    } catch (err) {
      console.error("❌ Error updating review:", err);
    }
  };

  render() {
    const {
      reviews,
      editingReview,
      updatedComment,
      updatedService,
      updatedRecommend,
      updatedRating,
      hoverRating,
      services,
      recommendations,
    } = this.state;

    return (
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">My Reviews</h1>
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-600">No reviews found.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="border p-4 rounded-md shadow-sm"
              >
                {editingReview === review._id ? (
                  <>
                    {/* Comment */}
                    <input
                      value={updatedComment}
                      onChange={(e) =>
                        this.setState({ updatedComment: e.target.value })
                      }
                      placeholder="Comment"
                      className="w-full p-2 border rounded mb-2"
                    />

                    {/* Service Dropdown */}
                    <select
                      value={updatedService}
                      onChange={(e) =>
                        this.setState({ updatedService: e.target.value })
                      }
                      className="w-full p-2 border rounded mb-2"
                    >
                      <option value="">Select Service</option>
                      {services.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    {/* Recommendation Dropdown */}
                    <select
                      value={updatedRecommend}
                      onChange={(e) =>
                        this.setState({ updatedRecommend: e.target.value })
                      }
                      className="w-full p-2 border rounded mb-2"
                    >
                      <option value="">Recommend?</option>
                      {recommendations.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>

                    {/* Star Rating */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Overall Rating
                      </label>
                      <div className="flex space-x-2">
                        {[...Array(5)].map((_, index) => {
                          const ratingValue = index + 1;
                          return (
                            <Star
                              key={ratingValue}
                              size={28}
                              className="cursor-pointer transition-transform hover:scale-110"
                              onMouseEnter={() =>
                                this.setState({ hoverRating: ratingValue })
                              }
                              onMouseLeave={() => this.setState({ hoverRating: 0 })}
                              onClick={() =>
                                this.setState({ updatedRating: ratingValue })
                              }
                              fill={
                                ratingValue <= (hoverRating || updatedRating)
                                  ? "#FFC107"
                                  : "#e4e5e9"
                              }
                              stroke={
                                ratingValue <= (hoverRating || updatedRating)
                                  ? "#FFC107"
                                  : "#e4e5e9"
                              }
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <button
                      onClick={() => this.handleUpdate(review._id)}
                      className="mr-2 px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => this.setState({ editingReview: null })}
                      className="px-3 py-1 bg-gray-500 text-white rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {/* Read Mode */}
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          fill={i < review.rating ? "#FFC107" : "#e4e5e9"}
                          stroke={i < review.rating ? "#FFC107" : "#e4e5e9"}
                        />
                      ))}
                    </div>
                    <p>
                      <strong>Comment:</strong> {review.comment || "-"}
                    </p>
                    <p>
                      <strong>Service:</strong> {review.service || "-"}
                    </p>
                    <p>
                      <strong>Recommend:</strong> {review.recommend || "-"}
                    </p>

                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => this.startEditing(review)}
                        className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        <Edit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => this.handleDelete(review._id)}
                        className="flex items-center px-3 py-1 bg-red-600 text-white rounded"
                      >
                        <Trash2 className="mr-1" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    );
  }
}
