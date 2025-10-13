import mongoose, { Schema } from 'mongoose';

// A nested schema for the measurements object
const measurementSchema = new Schema({
  bust: { type: String, required: true },
  waist: { type: String, required: true },
  hips: { type: String, required: true },
  shoulder: { type: String, required: true },
  sleeveLength: { type: String, required: true },
  armhole: { type: String, required: true },
  blouseLength: { type: String, required: true },
  frontNeck: { type: String, required: true },
  backNeck: { type: String, required: true },
}, { _id: false }); // Prevents creating a separate ID for the measurements sub-document

const tailoringOrderSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    orderId: { type: String },
    garmentType: { type: String, required: true },
    measurements: { type: measurementSchema, required: true },
    specialInstructions: { type: String },
    unit: { type: String, required: true, enum: ['inches', 'cm'], default: 'inches' },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Alterations', 'Ready'],
      default: 'Pending',
    },
  },
  {
    timestamps: { createdAt: 'submittedDate' }, // Use 'submittedDate' as the creation timestamp
  }
);

const TailoringOrder = mongoose.models.TailoringOrder || mongoose.model('TailoringOrder', tailoringOrderSchema);

export default TailoringOrder;