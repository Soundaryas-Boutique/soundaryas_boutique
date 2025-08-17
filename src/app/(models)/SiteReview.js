import mongoose, { Schema } from 'mongoose';

const siteReviewSchema = new Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SiteReview = mongoose.models.SiteReview || mongoose.model('SiteReview', siteReviewSchema);

export default SiteReview;
