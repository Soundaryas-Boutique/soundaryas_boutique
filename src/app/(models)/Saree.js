import mongoose from "mongoose";

const sareeSchema = new mongoose.Schema({
  productName: String,
  price: Number,
  imgSrc: String,
  category: String,
  slug: String
});

export default mongoose.models.Saree || mongoose.model("Saree", sareeSchema, "sarees");
