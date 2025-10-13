"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Check, ChevronLeft, ClipboardList, Scissors, Shirt, Wrench, Edit, X, Loader } from 'lucide-react';

// --- Helper Component for the Visual Status Tracker ---
function StatusTracker({ currentStatus }) {
  const steps = [
    { name: 'Pending', icon: ClipboardList, description: 'Measurements Submitted' },
    { name: 'In Progress', icon: Scissors, description: 'Cutting & Stitching' },
    { name: 'Alterations', icon: Wrench, description: 'Final Fittings' },
    { name: 'Ready', icon: Shirt, description: 'Ready for Pickup' },
  ];

  const currentStepIndex = steps.findIndex(step => step.name === currentStatus);

  return (
    <div className="flex items-center justify-between mt-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const Icon = step.icon;
        
        return (
          <div key={step.name} className="flex flex-col items-center text-center w-1/4 px-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
              ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
              ${isCurrent ? 'bg-[#B22222] border-[#B22222] text-white scale-110 shadow-lg' : ''}
              ${!isCompleted && !isCurrent ? 'bg-slate-100 border-slate-300 text-slate-400' : ''}
            `}>
              {isCompleted ? <Check size={20} /> : <Icon size={20} />}
            </div>
            <p className={`mt-2 text-xs font-semibold ${isCurrent ? 'text-[#B22222]' : 'text-gray-600'}`}>
              {step.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}


// --- Helper Component: Modal for Updating Instructions ---
function UpdateInstructionsModal({ isOpen, onClose, order, onUpdate }) {
  if (!isOpen) return null;

  const [instructions, setInstructions] = useState(order.specialInstructions || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(order._id, { specialInstructions: instructions });
      onClose();
    } catch (error) {
      alert("Failed to update instructions. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Update Instructions</h2>
        <p className="text-sm text-gray-500 mb-6">For Order ID: <span className="font-semibold">{order.orderId || order._id}</span></p>
        
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Special Instructions</label>
          <textarea 
            value={instructions} 
            onChange={(e) => setInstructions(e.target.value)}
            rows={5} 
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Add padded cups, prefer a side zipper..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
          <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 text-sm font-semibold text-white bg-[#B22222] rounded-lg hover:bg-[#8B0000] disabled:bg-gray-400 flex items-center gap-2">
            {isSaving && <Loader className="animate-spin" size={16}/>}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}


// --- Main Page Component ---
export default function TailoringProgressPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user?.email) {
      const fetchOrders = async () => {
        try {
          // --- THIS IS THE CORRECTED API PATH ---
          const res = await fetch(`/api/tailoring-orders/user/${session.user.email}`);
          if (!res.ok) throw new Error("Failed to fetch orders");
          const data = await res.json();
          setOrders(data.orders || []);
        } catch (error) {
          console.error("Fetch tailoring orders error:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    } else if (sessionStatus === 'unauthenticated') {
      router.push('/signin');
    }
  }, [session, sessionStatus, router]);

  const handleUpdate = async (orderId, updatedData) => {
    try {
      const res = await fetch(`/api/tailoring-orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error("Update failed");
      
      const { order: updatedOrder } = await res.json();
      setOrders(prevOrders => 
        prevOrders.map(o => o._id === orderId ? updatedOrder : o)
      );
    } catch (error) {
      console.error("Update error:", error);
      throw error; // Re-throw to be caught by the modal
    }
  };

  if (sessionStatus === "loading" || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading your orders...</div>;
  }

  return (
    <>
      <main className="min-h-screen bg-slate-100 font-sans p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.back()} 
            className="mb-6 px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition flex items-center gap-2 shadow-sm border"
          >
            <ChevronLeft size={18} /> Back to Profile
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Your Custom Tailoring Orders</h1>
            <p className="text-gray-500 mt-1">Track the progress of your custom-stitched garments below.</p>
          </div>

          <div className="space-y-6">
            {orders.length > 0 ? (
              orders.map(order => (
                <div key={order._id} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-mono font-semibold text-[#B22222]">{order.orderId || order._id}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-left sm:text-right">
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="font-semibold text-gray-700">
                        {new Date(order.submittedDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Garment</p>
                      <p className="text-lg font-bold text-gray-800">{order.garmentType}</p>
                    </div>
                    {order.status === 'Pending' && (
                      <button 
                        onClick={() => setEditingOrder(order)}
                        className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-semibold"
                      >
                        <Edit size={14}/> Update Instructions
                      </button>
                    )}
                  </div>

                  <StatusTracker currentStatus={order.status} />

                </div>
              ))
            ) : (
              <div className="text-center py-20 px-6 bg-white rounded-xl shadow-lg">
                <h3 className="text-2xl font-medium text-gray-700">No Tailoring Orders Found</h3>
                <p className="text-gray-500 mt-2">
                  Once you submit your measurements for a custom garment, you can track its progress here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <UpdateInstructionsModal 
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        order={editingOrder}
        onUpdate={handleUpdate}
      />
    </>
  );
}

