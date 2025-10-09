// --- To make this page work, create it at a path like `src/app/appointment/page.jsx` ---

"use client";

import { useState } from 'react';
import { User, Mail, Phone, Clock, Calendar, Users, Sparkles, PartyPopper, Send, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AppointmentPage() {
  // State for all form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [occasion, setOccasion] = useState('');
  const [stylePreferences, setStylePreferences] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // State for form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("Please confirm you understand this is a request form.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    const formData = {
      fullName, email, phone, appointmentType,
      preferredDate, timeSlot, guestCount,
      occasion, stylePreferences
    };

    // --- Backend Integration Point ---
    // In a real application, you would send `formData` to your API endpoint here.
    // For now, we'll simulate a network request.
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate 1.5 second delay
      console.log("Form Submitted Successfully:", formData);
      setSubmissionStatus('success');
      // Optionally reset form fields here
    } catch (error) {
      console.error("Submission Error:", error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If form is successfully submitted, show a thank you message instead of the form
  if (submissionStatus === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg text-center bg-white p-12 rounded-2xl shadow-lg">
          <CheckCircle className="mx-auto text-green-500" size={60} />
          <h1 className="text-3xl font-bold text-gray-800 mt-6">Thank You, {fullName}!</h1>
          <p className="text-gray-600 mt-3">
            Your appointment request has been received. We will contact you at <span className="font-semibold">{email}</span> or <span className="font-semibold">{phone}</span> within 24 hours to confirm the final details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white p-8 sm:p-12 rounded-2xl shadow-lg">
        {/* Form Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#B22222]">Book Your Personal Styling Appointment</h1>
          <p className="text-gray-500 mt-3">
            We can't wait to help you find the perfect look. Please fill out the details below to request a session.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Contact Details */}
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-3 flex items-center gap-3">
              <User size={22} className="text-[#B22222]" /> Your Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Full Name *</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-input" placeholder="e.g., Priya Sharma" required />
              </div>
              <div>
                <label className="form-label">Phone Number *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" placeholder="e.g., 98765 43210" required />
              </div>
            </div>
            <div>
              <label className="form-label">Email Address *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="e.g., priya.sharma@example.com" required />
            </div>
          </div>

          {/* Section 2: Appointment Details */}
          <div className="space-y-5">
             <h2 className="text-xl font-semibold text-gray-700 border-b pb-3 flex items-center gap-3">
              <Calendar size={22} className="text-[#B22222]" /> Appointment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Type of Appointment *</label>
                <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} className="form-input" required>
                  <option value="" disabled>Select a service...</option>
                  <option value="Bridal Consultation">Bridal Consultation (90 mins)</option>
                  <option value="Special Occasion Styling">Special Occasion Styling (60 mins)</option>
                  <option value="Wardrobe Refresh">Wardrobe Refresh (45 mins)</option>
                  <option value="Custom Tailoring">Custom Tailoring & Fitting (30 mins)</option>
                </select>
              </div>
              <div>
                 <label className="form-label">Preferred Date *</label>
                <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="form-input" required min={new Date().toISOString().split("T")[0]} />
              </div>
            </div>
            <div>
              <label className="form-label">Preferred Time Slot *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {['Morning (10am-1pm)', 'Afternoon (2pm-5pm)', 'Evening (5pm-7pm)'].map(slot => (
                  <label key={slot} className={`radio-label ${timeSlot === slot ? 'radio-label-selected' : ''}`}>
                    <input type="radio" name="timeSlot" value={slot} checked={timeSlot === slot} onChange={(e) => setTimeSlot(e.target.value)} className="sr-only" />
                    <Clock size={16} />
                    <span>{slot}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Section 3: Help Us Prepare */}
          <div className="space-y-5">
             <h2 className="text-xl font-semibold text-gray-700 border-b pb-3 flex items-center gap-3">
              <Sparkles size={22} className="text-[#B22222]" /> Help Us Prepare
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">What is the occasion?</label>
                <input type="text" value={occasion} onChange={(e) => setOccasion(e.target.value)} className="form-input" placeholder="e.g., My sister's wedding" />
              </div>
              <div>
                <label className="form-label">Number of Guests</label>
                <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="form-input">
                  <option value="1">Just Me</option>
                  <option value="2">Me + 1</option>
                  <option value="3">Me + 2</option>
                  <option value="4">3+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Your Style & Preferences</label>
              <textarea value={stylePreferences} onChange={(e) => setStylePreferences(e.target.value)} rows={4} className="form-input" placeholder="Tell us about what you're looking for! Feel free to share links to a Pinterest board or Instagram inspiration." />
            </div>
          </div>

          {/* Submission */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-start">
              <input id="terms" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="h-5 w-5 mt-0.5 rounded border-gray-300 text-[#B22222] focus:ring-[#B22222]" />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                I understand this is a request and the boutique will contact me to confirm the final date and time. *
              </label>
            </div>
            
            {submissionStatus === 'error' && (
              <div className="flex items-center gap-3 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertTriangle size={20} />
                <p className="text-sm font-medium">Something went wrong. Please try again.</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-3 bg-[#B22222] text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-[#B22222]/40 hover:bg-[#8B0000] hover:shadow-xl hover:-translate-y-1 disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed">
              <Send size={20}/>
              {isSubmitting ? 'Submitting Request...' : 'Request My Appointment'}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .form-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          transition: all 0.2s;
          background-color: #f9fafb;
        }
        .form-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(178, 34, 34, 0.3);
          border-color: #B22222;
          background-color: #fff;
        }
        select.form-input {
          appearance: none;
          background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>');
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1.25em 1.25em;
          padding-right: 2.5rem;
        }
        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          cursor: pointer;
          font-weight: 500;
          color: #4b5563;
          transition: all 0.2s;
        }
        .radio-label:hover {
          border-color: #B22222;
        }
        .radio-label-selected {
          border-color: #B22222;
          background-color: #FEECEB;
          color: #B22222;
          font-weight: 700;
        }
      `}</style>
    </main>
  );
}