"use client"


import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'



const page = () => {

    const {data:session, status} = useSession()
    console.log(session)


  return (
    <div>
      Name :


      {session?.user?.name}
    
    </div>
  )
}

export default page
