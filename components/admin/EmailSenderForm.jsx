"use client";
import React, { useState, useEffect } from 'react';
import { FiSend, FiEye } from 'react-icons/fi';
import CustomDropdown from './CustomDropdown'; // ✅ Import the new component

const emailCategories = [
  { value: 'special_offer', label: '🎁 Send Special Offer/Discount' },
  { value: 'new_product', label: '✨ Announce New Products' },
  { value: 'restocked', label: '🛍️ Notify Restocked Items' },
  { value: 'random_buy', label: '💖 Random Mail to Encourage Purchase' },
];

const generatePreviewContent = (category, productName) => {
  switch (category) {
    case 'special_offer':
      return {
        subject: "🎉 Exclusive Sale Alert! 20% Off All Silk Sarees!",
        body: "Hello Subscriber,\n\nDon't miss out! For a limited time, enjoy 20% off our entire collection of exquisite Silk Sarees. Use code SILK20 at checkout.\n\nShop now: [Link to your site]",
      };
    case 'new_product':
      return {
        subject: `✨ New Product: ${productName} Just Dropped!`,
        body: `Hello Subscriber,\n\nWe've just updated our collection with the beautiful new product: ${productName}. Be the first to see it!\n\nView Collection: [Link to your new products page]`,
      };
    case 'restocked':
      return {
        subject: `🛍️ Back in Stock! Your Favorite, ${productName}, Is Here!`,
        body: `Hello Subscriber,\n\nGreat news! The highly requested item, ${productName}, is back in stock. Quantities are limited, so grab yours before it sells out again!\n\nCheck availability: [Link to product page]`,
      };
    case 'random_buy':
      return {
        subject: "💌 A Little Something Just For You...",
        body: "Hello Subscriber,\n\nWe hope you're having a wonderful week. Remember to treat yourself! We offer the finest traditional wear with modern flair.\n\nBrowse now: [Link to your site]",
      };
    default:
      return { subject: "Newsletter Update", body: "A general update from Soundarya's Boutique." };
  }
};


export default function EmailSenderForm() {
  const [category, setCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [success, setSuccess] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);

  useEffect(() => {
    if (category) {
      const content = generatePreviewContent(category, productName || '[Product Name]');
      setPreviewContent(content);
    } else {
      setPreviewContent(null);
    }
  }, [category, productName]);

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
          <CustomDropdown // ✅ This is the custom dropdown
            options={emailCategories}
            value={category}
            onChange={setCategory}
            placeholder="-- Choose a campaign type --"
            className="w-full"
          />
        </div>

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

      {previewContent && (
        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-inner">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FiEye className="mr-2" /> Email Preview
          </h3>
          <div className="space-y-4 p-4 border border-gray-300 rounded-lg bg-white">
            <p className="text-lg font-semibold border-b pb-2 text-[#A52A2A]">{previewContent.subject}</p>
            <p className="whitespace-pre-line text-sm text-gray-700">{previewContent.body}</p>
          </div>
        </div>
      )}
    </div>
  );
}