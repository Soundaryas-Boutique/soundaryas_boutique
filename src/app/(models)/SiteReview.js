import mongoose, { Schema } from 'mongoose';

const siteReviewSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    category: { type: String, required: true },
    material: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    poll: {
      quality: Number,
      comfort: Number,
      price: Number,
      recommend: Number,
      overall: Number,
    },
  },
  {
    timestamps: { createdAt: 'date' },
  }
);

// Use a consistent name: SiteReview
const SiteReview = mongoose.models.SiteReview || mongoose.model('SiteReview', siteReviewSchema);

export default SiteReview;