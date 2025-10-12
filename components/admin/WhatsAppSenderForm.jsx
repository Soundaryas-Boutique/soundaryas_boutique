"use client";
import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import CustomDropdown from './CustomDropdown'; // ✅ Import the CustomDropdown component

const professionCategories = [
  { value: "all", label: "All Subscribers" },
  { value: "Doctor", label: "Doctors" },
  { value: "Teacher", label: "Teachers" },
  { value: "Engineer", label: "Engineers" },
  { value: "Student", label: "Students" },
  { value: "Other", label: "Other Professions" },
];

export default function WhatsAppSenderForm() {
  const [messageContent, setMessageContent] = useState('');
  const [professionTarget, setProfessionTarget] = useState('all'); // ✅ New state for profession
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageContent) {
      setStatusMessage('Message content is required.');
      setSuccess(false);
      return;
    }

    setLoading(true);
    setStatusMessage('Sending WhatsApp messages...');
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageContent, professionTarget }), // ✅ Pass professionTarget to API
      });

      const data = await res.json();
      
      if (!res.ok) {
        setStatusMessage(data.message || data.details || 'An unknown error occurred.');
        setSuccess(false);
      } else {
        setStatusMessage(data.message);
        setSuccess(true);
        setMessageContent('');
        setProfessionTarget('all');
      }

    } catch (error) {
      setStatusMessage('Network error. Check your Twilio connection.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">WhatsApp Marketing</h1>
      <p className="text-gray-600 mb-6">Send a bulk message to all subscribers with a phone number.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="messageContent" className="block text-lg font-medium text-gray-700 mb-2">
            Your WhatsApp Message:
          </label>
          <textarea
            id="messageContent"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Enter your message here..."
            rows="6"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Target Profession:
          </label>
          <CustomDropdown 
            options={professionCategories}
            value={professionTarget}
            onChange={setProfessionTarget}
            placeholder="-- Choose a profession to target --"
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !messageContent}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-[#A52A2A] hover:bg-[#8B0000] disabled:bg-gray-400 transition-colors"
        >
          {loading ? (
            'Sending...'
          ) : (
            <>
              <FiSend className="mr-2" /> Send via WhatsApp
            </>
          )}
        </button>
      </form>

      {statusMessage && (
        <div className={`mt-6 p-4 rounded-lg text-center font-medium ${
          success === true ? 'bg-green-100 text-green-800' : 
          success === false ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}