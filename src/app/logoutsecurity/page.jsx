"use client"
import React from 'react';
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'; // ✅ Import the client-side router
const LogoutSecurity = () => {
  const router = useRouter();

  // Function to handle the cancel click and navigate back to the profile
  const handleCancel = () => {
    router.push("/Profile");
  };
  
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-50'>
      <div >
        <p className='text-xl font-semibold text-gray-800'>Are you sure you want to Logout?</p>
        
        <div className='flex justify-center gap-4 pt-4'>
          {/* ✅ Logout Button (Red, prominent) */}
          <button 
            className='px-6 py-3 font-bold text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 shadow-md' 
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </button>
          
          {/* ✅ Cancel Button (Neutral) */}
          <button 
            className='px-6 py-3 font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 shadow-md' 
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutSecurity