"use client"

import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='flex items-center justify-center flex-col h-screen'>
      <p>Please Log in to Continue</p>
      <div className=''>
      <Link href="/signin" className=''>
        <button className='text-blue-500'>Sign in</button>
      </Link>
      </div>
    </div>
  )
}

export default page
