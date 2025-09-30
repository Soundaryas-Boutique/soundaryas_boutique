"use client";
import React from 'react';
import { FiX } from 'react-icons/fi';

export default function CustomerDetailsModal({ customer, onClose }) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">Customer Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FiX size={24} />
          </button>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
          <p>
            <strong>Address:</strong> {customer.address}, {customer.city}, {customer.state}, {customer.country} - {customer.pincode}
          </p>
        </div>
      </div>
    </div>
  );
}