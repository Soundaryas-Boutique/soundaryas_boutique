"use client"
import React from 'react'
import { signOut } from "next-auth/react";

const LogoutSecurity = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <p className='relative -top-20'>You Sure you wanna log out (Logout Security)?</p>
      <br />



      <div className=''>
      <button className=' border p-3  relative  -top-20 ' onClick={() => signOut({ callbackUrl: "/" })}>
        Logout
      </button>
      </div>
    </div>
  )
}

export default LogoutSecurity
