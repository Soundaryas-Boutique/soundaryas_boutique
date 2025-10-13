"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Send, Loader, CheckCircle, Ruler, ChevronLeft, User, Mail, Sparkles, Pencil } from 'lucide-react';

export default function CustomTailoringPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  
  // --- Form State ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [garmentType, setGarmentType] = useState('Saree Blouse');
  const [measurements, setMeasurements] = useState({
    bust: '', waist: '', hips: '', shoulder: '', sleeveLength: '', armhole: '', blouseLength: '', frontNeck: '', backNeck: ''
  });
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [unit, setUnit] = useState('inches');

  // --- UI State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // Auto-fill user data when session is available
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setMeasurements(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      name, email, orderId, garmentType, measurements, specialInstructions, unit
    };

    // --- Backend Integration Point ---
    try {
      const res = await fetch('/api/tailoring-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit measurements");
      }
      
      console.log("Measurement Form Submitted:", formData);
      setSubmissionStatus('success');
    } catch (error) {
      console.error("Submission Error:", error);
      setSubmissionStatus('error');
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sessionStatus === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (sessionStatus === "unauthenticated") {
    router.push('/signin');
    return null;
  }
  
  if (submissionStatus === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg text-center bg-white p-12 rounded-2xl shadow-lg">
          <CheckCircle className="mx-auto text-green-500" size={60} />
          <h1 className="text-3xl font-bold text-gray-800 mt-6">Thank You, {name}!</h1>
          <p className="text-gray-600 mt-3">
            Your measurements for order <span className="font-semibold">{orderId}</span> have been received. We will begin crafting your custom garment shortly.
          </p>
          <button onClick={() => router.push('/Profile/tailoring-progress')} className="mt-8 px-6 py-2 bg-[#B22222] text-white rounded-lg font-semibold">
            Track Progress
          </button>
        </div>
      </div>
    );
  }

  const MeasurementInput = ({ name, label }) => (
    <div>
        <label className="form-label">{label}</label>
        <input 
            type="number" 
            name={name} 
            value={measurements[name]} 
            onChange={handleMeasurementChange}
            className="form-input" 
            placeholder="0.0"
            step="0.1"
            required
        />
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 font-sans p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition flex items-center gap-2 shadow-sm border">
          <ChevronLeft size={18} /> Back
        </button>

        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg">
          <div className="text-center mb-10">
            <Ruler className="mx-auto text-[#B22222]" size={40}/>
            <h1 className="text-4xl font-bold text-gray-800 mt-4">Custom Tailoring Measurements</h1>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Please provide your precise measurements below to ensure the perfect fit for your custom garment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* --- Section 1: User & Order Info --- */}
            <div className="space-y-5">
                <h2 className="form-section-header"><User size={22} /> Your Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="form-label">Name</label>
                        <input type="text" value={name} className="form-input bg-slate-100 cursor-not-allowed" readOnly />
                    </div>
                    <div>
                        <label className="form-label">Email</label>
                        <input type="email" value={email} className="form-input bg-slate-100 cursor-not-allowed" readOnly />
                    </div>
                </div>
                 {/* --- CHANGE: This field is now required --- */}
                 <div>
                    <label className="form-label">Appointment or Order ID *</label>
                    <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} className="form-input" placeholder="e.g., APPT-12345 or ORD-67890" required />
                </div>
            </div>

            {/* --- Section 2: Measurements --- */}
            <div>
              <h2 className="form-section-header"><Sparkles size={22}/> Garment & Measurements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 mb-8">
                  <div>
                        <label className="form-label">Garment Type *</label>
                        <select value={garmentType} onChange={(e) => setGarmentType(e.target.value)} className="form-input" required>
                            <option>Saree Blouse</option>
                            <option>Salwar Kameez</option>
                            <option>Lehenga Choli</option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Measurement Unit *</label>
                        <div className="flex gap-2">
                            <label className={`radio-label ${unit === 'inches' ? 'radio-label-selected' : ''}`}><input type="radio" name="unit" value="inches" checked={unit === 'inches'} onChange={e => setUnit(e.target.value)} className="sr-only" />Inches</label>
                            <label className={`radio-label ${unit === 'cm' ? 'radio-label-selected' : ''}`}><input type="radio" name="unit" value="cm" checked={unit === 'cm'} onChange={e => setUnit(e.target.value)} className="sr-only" />Centimeters</label>
                        </div>
                    </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
                <MeasurementInput name="bust" label="Bust *" />
                <MeasurementInput name="waist" label="Waist *" />
                <MeasurementInput name="hips" label="Hips *" />
                <MeasurementInput name="shoulder" label="Shoulder *" />
                <MeasurementInput name="sleeveLength" label="Sleeve Length *" />
                <MeasurementInput name="armhole" label="Armhole *" />
                <MeasurementInput name="blouseLength" label="Blouse/Top Length *" />
                <MeasurementInput name="frontNeck" label="Front Neck Depth *" />
                <MeasurementInput name="backNeck" label="Back Neck Depth *" />
              </div>
            </div>

            {/* --- Section 3: Special Instructions --- */}
             <div>
                <h2 className="form-section-header"><Pencil size={22} /> Special Instructions</h2>
                <div className="mt-4">
                    <textarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} rows={4} className="form-input" placeholder="e.g., Add padded cups, prefer a side zipper, make the back neck deep..." />
                </div>
            </div>

            {/* --- Submission Button --- */}
            <div className="pt-6 border-t text-center">
                <button type="submit" disabled={isSubmitting} className="w-full max-w-xs mx-auto flex items-center justify-center gap-3 bg-[#B22222] text-white font-bold text-lg py-3 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-[#B22222]/40 hover:bg-[#8B0000] hover:shadow-xl hover:-translate-y-1 disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0">
                  <Send size={20}/>
                  {isSubmitting ? 'Submitting...' : 'Submit Measurements'}
                </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .form-section-header { font-size: 1.25rem; font-weight: 600; color: #4b5563; border-bottom-width: 1px; padding-bottom: 0.75rem; display: flex; align-items: center; gap: 0.75rem; }
        .form-label { display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem; }
        .form-input { width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; transition: all 0.2s; background-color: #f9fafb; }
        .form-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(178, 34, 34, 0.3); border-color: #B22222; background-color: #fff; }
        select.form-input { appearance: none; background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>'); background-position: right 0.75rem center; background-repeat: no-repeat; background-size: 1.25em 1.25em; padding-right: 2.5rem; }
        .radio-label { flex: 1; text-align: center; padding: 0.5rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; cursor: pointer; font-weight: 500; color: #4b5563; transition: all 0.2s; }
        .radio-label:hover { border-color: #B22222; }
        .radio-label-selected { border-color: #B22222; background-color: #FEECEB; color: #B22222; font-weight: 700; }
      `}</style>
    </main>
  );
}

