"use client"
import React from 'react'
import { signOut } from "next-auth/react";

const LogoutSecurity = () => {
  return (
    <div>
      You Sure you wanna log out (Logout Security)?
      <br />

      <button className='border' onClick={() => signOut({ callbackUrl: "/" })}>
                    Logout
                  </button>
    </div>
  )
}

export default LogoutSecurity
