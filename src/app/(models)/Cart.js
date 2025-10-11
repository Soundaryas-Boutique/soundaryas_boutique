import mongoose, { Schema } from 'mongoose';

const cartItemSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Saree',
    required: true,
  },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  selectedColor: { type: String },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);