import { Schema } from "mongoose";

const siteReviewSchema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true }, 
  service: { type: String, trim: true },
  recommend: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

export default siteReviewSchema;
