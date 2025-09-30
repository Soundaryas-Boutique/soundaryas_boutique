"use client";
import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const emailCategories = [
  { value: 'special_offer', label: '🎁 Send Special Offer/Discount' },
  { value: 'new_product', label: '✨ Announce New Products' },
  { value: 'restocked', label: '🛍️ Notify Restocked Items' },
  { value: 'random_buy', label: '💖 Random Mail to Encourage Purchase' },
];

export default function EmailSenderForm() {
  const [category, setCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      setStatusMessage('Please select an email category.');
      setSuccess(false);
      return;
    }
    
    if ((category === 'new_product' || category === 'restocked') && !productName) {
      setStatusMessage('Product name is required for this campaign.');
      setSuccess(false);
      return;
    }

    setLoading(true);
    setStatusMessage('Sending emails...');
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, productName }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setStatusMessage(data.message || data.details || 'An unknown error occurred during sending.');
        setSuccess(false);
      } else {
        setStatusMessage(data.message);
        setSuccess(true);
        setCategory('');
        setProductName('');
      }

    } catch (error) {
      setStatusMessage('Network error. Check your server connection.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">Email Marketing Hub</h1>
      <p className="text-gray-600 mb-6">Create a dynamic email to send to all current subscribers.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-2">
            Select Email Campaign:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setProductName(''); // Clear product name when category changes
            }}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
            required
          >
            <option value="">-- Choose a campaign type --</option>
            {emailCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic input for product name */}
        {(category === 'new_product' || category === 'restocked') && (
          <div>
            <label htmlFor="productName" className="block text-lg font-medium text-gray-700 mb-2">
              Product Name:
            </label>
            <input
              type="text"
              name="productName"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              required
            />
          </div>
        )}

        {/* Simple "send" button for other categories */}
        {category && category !== 'new_product' && category !== 'restocked' && (
          <div>
            <p className="text-gray-600 mb-4">A general email will be sent to subscribers.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !category}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-[#A52A2A] hover:bg-[#8B0000] disabled:bg-gray-400 transition-colors"
        >
          {loading ? (
            'Sending...'
          ) : (
            <>
              <FiSend className="mr-2" /> Send to Subscribers
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