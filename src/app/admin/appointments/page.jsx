"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, MessageSquare, Check, X, Bell, BarChart2, Send } from 'lucide-react';

// --- HELPER COMPONENTS (StatusBadge is unchanged) ---
const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Confirmed: 'bg-green-100 text-green-800 border-green-300',
    Cancelled: 'bg-red-100 text-red-800 border-red-300',
  };
  return <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>{status}</span>;
};

// --- ContactModal is now connected to the backend ---
function ContactModal({ isOpen, onClose, appointment }) {
  if (!isOpen) return null;

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (appointment) {
      const formattedDate = new Date(appointment.preferredDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric' });
      setSubject(`Re: Your Appointment on ${formattedDate}`);
    }
  }, [appointment]);

  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      // This now points to your new email-sending API route
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: appointment.email, subject, message }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send email");
      }
      alert("Message sent successfully!");
      onClose();
    } catch (error) {
      console.error("Contact form error:", error);
      alert(`Error sending message: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Contact {appointment.fullName}</h2>
        <p className="text-sm text-gray-500 mb-6">An email will be sent to <span className="font-semibold">{appointment.email}</span></p>
        <form onSubmit={handleSend} className="space-y-4">
          <div><label className="font-semibold text-gray-700">Subject</label><input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-slate-50" required /></div>
          <div><label className="font-semibold text-gray-700">Message</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="w-full mt-1 p-2 border rounded-md bg-slate-50" placeholder="Type your message here..." required /></div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" disabled={isSending} className="px-5 py-2 text-sm font-semibold text-white bg-[#B22222] rounded-lg hover:bg-[#8B0000] disabled:bg-gray-400 flex items-center gap-2"><Send size={16}/>{isSending ? 'Sending...' : 'Send Message'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminAppointmentsDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest-first');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/appointments');
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const { appointment: updatedAppointment } = await res.json();
      setAppointments(prev => prev.map(app => (app._id === id ? updatedAppointment : app)));
    } catch (error) {
      console.error(error);
      alert("Failed to update status.");
    }
  };

  const openContactModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsContactModalOpen(true);
  };

  const displayedAppointments = (appointments || [])
    .filter(app => activeFilter === 'All' || app.status === activeFilter)
    .sort((a, b) => {
      const dateA = new Date(a.preferredDate);
      const dateB = new Date(b.preferredDate);
      return sortOrder === 'newest-first' ? dateB - dateA : dateA - dateB;
    });

  const pendingCount = appointments.filter(a => a.status === 'Pending').length;

  return (
    <>
      <main className="min-h-screen bg-slate-100 font-sans p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8"><h1 className="text-3xl font-bold text-gray-800">Appointments Dashboard</h1><p className="text-gray-500 mt-1">Manage all customer styling session requests.</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4"><div className="bg-blue-100 p-3 rounded-full"><BarChart2 className="text-blue-600" size={24}/></div><div><p className="text-sm text-gray-500">Total Appointments</p><p className="text-2xl font-bold text-gray-800">{appointments.length}</p></div></div>
            <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4"><div className="bg-yellow-100 p-3 rounded-full"><Bell className="text-yellow-600" size={24}/></div><div><p className="text-sm text-gray-500">Pending Requests</p><p className="text-2xl font-bold text-gray-800">{pendingCount}</p></div></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 mb-6">
              <div className="flex items-center gap-2">
                {['All', 'Pending', 'Confirmed', 'Cancelled'].map(filter => (<button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeFilter === filter ? 'bg-[#B22222] text-white' : 'bg-slate-100 text-gray-600 hover:bg-slate-200'}`}>{filter}</button>))}
              </div>
              <div><select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-3 py-2 text-sm font-semibold bg-slate-100 text-gray-600 border-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B22222]"><option value="newest-first">Sort: Newest to Oldest</option><option value="oldest-first">Sort: Oldest to Newest</option></select></div>
            </div>
            <div className="space-y-6">
              {isLoading ? (<p className="text-center text-gray-500 py-12">Loading appointments...</p>) 
              : displayedAppointments.length > 0 ? (
                displayedAppointments.map(app => (
                  <div key={app._id} className="border border-slate-200 rounded-lg p-5">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4"><h3 className="text-lg font-bold text-[#B22222]">{app.appointmentType}</h3><StatusBadge status={app.status} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div className="space-y-3"><div className="flex items-center gap-3"><User size={16} className="text-gray-400"/><span className="font-semibold text-gray-800">{app.fullName}</span></div><button onClick={() => openContactModal(app)} className="w-full text-sm flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 font-semibold"><Mail size={16}/> Contact Them</button></div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3"><Calendar size={16} className="text-gray-400"/><span className="font-semibold text-gray-800">{new Date(app.preferredDate).toLocaleDateString("en-GB", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                         <div className="flex items-center gap-3"><Clock size={16} className="text-gray-400"/><span className="font-semibold text-gray-800">{app.timeSlot}</span></div>
                         <div className="flex items-start gap-3"><MessageSquare size={16} className="text-gray-400 mt-0.5"/><p className="text-gray-600"><span className="font-semibold">Occasion:</span> {app.occasion}</p></div>
                      </div>
                      <div className="flex items-center justify-start md:justify-end gap-3">
                        {app.status === 'Pending' && (
                          <>
                            <button onClick={() => handleStatusChange(app._id, 'Confirmed')} className="flex items-center gap-2 text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 hover:-translate-y-0.5"><Check size={16}/> Confirm</button>
                            <button onClick={() => handleStatusChange(app._id, 'Cancelled')} className="flex items-center gap-2 text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 hover:-translate-y-0.5"><X size={16}/> Cancel</button>
                          </>
                        )}
                        {app.status !== 'Pending' && <p className="text-sm text-gray-400 text-right">No actions available</p>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-12">No appointments found for the selected criteria.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} appointment={selectedAppointment} />
    </>
  );
}
