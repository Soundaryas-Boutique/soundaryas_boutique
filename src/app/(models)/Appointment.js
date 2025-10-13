import mongoose, { Schema } from 'mongoose';

const appointmentSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    appointmentType: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    guestCount: { type: String },
    occasion: { type: String },
    stylePreferences: { type: String },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending', // New appointments will automatically be 'Pending'
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default Appointment;