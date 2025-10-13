"use client";

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Building, User, Phone, Mail, Box, Loader, FileText, MapPin } from 'lucide-react';

// --- MOCK DATA (unchanged) ---
const mockSuppliers = [
  {
    _id: "sup1",
    supplierName: "Kanchipuram Weavers Collective",
    contactPerson: "Mr. Ravi Kumar",
    contactNumber: "9876543210",
    email: "contact@kwc.com",
    specialty: "Kanchipuram Silk",
    address: "123 Silk Road, Kanchipuram, Tamil Nadu",
    gstNumber: "33ABCDE1234F1Z5",
  },
  {
    _id: "sup2",
    supplierName: "Banaras Fabric House",
    contactPerson: "Mrs. Sunita Singh",
    contactNumber: "8765432109",
    email: "sales@bfh.in",
    specialty: "Banarasi Silk",
    address: "456 Weaver's Lane, Varanasi, Uttar Pradesh",
    gstNumber: "09KLMNO5678P2Z6",
  },
];
// --- END OF MOCK DATA ---


// --- UI IMPROVED: Form Modal with placeholders ---
function SupplierFormModal({ isOpen, onClose, onSave, supplier }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState(
    supplier || {
      supplierName: '', contactPerson: '', contactNumber: '', email: '',
      specialty: '', address: '', gstNumber: '',
    }
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  // Helper for rendering input fields with icons and placeholders
  const InputField = ({ icon, label, name, value, placeholder, ...props }) => {
    const Icon = icon;
    return (
      <div>
        <label className="form-label">{label}</label>
        <div className="relative">
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input name={name} value={value} onChange={handleChange} placeholder={placeholder} {...props} className="form-input pl-10" />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{supplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
        <p className="text-sm text-gray-500 mb-6">Enter the details of the vendor or artisan below.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
          <div>
            <h3 className="text-lg font-semibold text-[#B22222] border-b pb-2 mb-4">Supplier Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField icon={Building} label="Supplier Name *" name="supplierName" value={formData.supplierName} type="text" placeholder="e.g., Kanchipuram Weavers" required />
              <InputField icon={FileText} label="GST Number" name="gstNumber" value={formData.gstNumber} type="text" placeholder="e.g., 33ABCDE1234F1Z5" />
            </div>
             <div className="mt-5">
              <label className="form-label">Specialty / Main Product</label>
              <div className="relative">
                <Box className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select name="specialty" value={formData.specialty} onChange={handleChange} className="form-input pl-10">
                  <option value="" disabled>Select a specialty...</option>
                  <option>Kanchipuram Silk</option><option>Banarasi Silk</option><option>Raw Cotton Fabric</option><option>Accessories</option><option>Printing & Dyeing</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#B22222] border-b pb-2 mb-4">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField icon={User} label="Contact Person *" name="contactPerson" value={formData.contactPerson} type="text" placeholder="e.g., Mr. Ravi Kumar" required />
              <InputField icon={Phone} label="Contact Number *" name="contactNumber" value={formData.contactNumber} type="tel" placeholder="e.g., 9876543210" required />
            </div>
            <div className="mt-5">
              <InputField icon={Mail} label="Email Address *" name="email" value={formData.email} type="email" placeholder="e.g., contact@weavers.com" required />
            </div>
             <div className="mt-5">
                <label className="form-label">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                  <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="form-input pl-10" placeholder="e.g., 123 Silk Road, Kanchipuram, Tamil Nadu" />
                </div>
              </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-6 border-t mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-6 py-2.5 text-sm font-semibold text-white bg-[#B22222] rounded-lg shadow-md hover:bg-[#8B0000] disabled:bg-gray-400 flex items-center gap-2 transition-transform hover:scale-105">
              {isSaving && <Loader className="animate-spin" size={16}/>}
              {isSaving ? 'Saving...' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// --- MAIN PAGE COMPONENT (unchanged) ---
export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const handleOpenModal = (supplier = null) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setEditingSupplier(null);
    setIsModalOpen(false);
  };
  const handleSaveSupplier = async (formData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s._id === editingSupplier._id ? { ...s, ...formData } : s));
    } else {
      setSuppliers([...suppliers, { ...formData, _id: `sup${Date.now()}` }]);
    }
    handleCloseModal();
  };
  const handleDeleteSupplier = (supplierId) => {
    if (window.confirm("Are you sure you want to delete this supplier? This action cannot be undone.")) {
      setSuppliers(suppliers.filter(s => s._id !== supplierId));
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <main className="min-h-screen bg-slate-100 font-sans p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Supplier Master</h1>
              <p className="text-gray-500 mt-1">Manage your boutique's vendors, weavers, and artisans.</p>
            </div>
            <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#B22222] text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-[#8B0000] hover:-translate-y-0.5 transition-all duration-300">
              <Plus size={20} /> Add New Supplier
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search by supplier name or specialty..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B22222]" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-gray-600">Supplier</th><th className="p-3 text-sm font-semibold text-gray-600">Contact</th><th className="p-3 text-sm font-semibold text-gray-600">Specialty</th><th className="p-3 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((s) => (
                    <tr key={s._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="p-3 font-medium text-gray-800">{s.supplierName}<span className="block text-xs text-gray-500">{s.address}</span></td>
                      <td className="p-3 text-sm text-gray-600">{s.contactPerson}<span className="block text-xs text-blue-600 hover:underline"><a href={`mailto:${s.email}`}>{s.email}</a></span></td>
                      <td className="p-3"><span className="px-2 py-1 text-xs font-semibold bg-slate-200 text-slate-700 rounded-full">{s.specialty}</span></td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleOpenModal(s)} className="text-blue-600 hover:text-blue-800"><Edit size={18}/></button>
                          <button onClick={() => handleDeleteSupplier(s._id)} className="text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredSuppliers.length === 0 && (<p className="text-center text-gray-500 py-10">No suppliers found.</p>)}
            </div>
          </div>
        </div>
      </main>

      <SupplierFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveSupplier} supplier={editingSupplier} />
      
      <style jsx>{`
        .form-label { display: block; font-weight: 500; color: #4b5563; margin-bottom: 0.5rem; font-size: 0.875rem; }
        .form-input { 
          width: 100%; 
          padding: 0.75rem;
          border: 1px solid #9ca3af; 
          border-radius: 0.5rem; 
          transition: all 0.2s; 
          background-color: #f9fafb;
        }
        .form-input::placeholder {
            color: #9ca3af;
        }
        .form-input:focus { 
          outline: none; 
          border-color: #B22222;
          background-color: #fff;
          box-shadow: 0 0 0 3px rgba(178, 34, 34, 0.4); 
        }
        select.form-input {
          appearance: none;
          background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>');
          background-position: right 0.7rem center;
          background-repeat: no-repeat;
          background-size: 1.25em 1.25em;
        }
      `}</style>
    </>
  );
}

