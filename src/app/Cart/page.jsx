"use client"

import React from 'react'
import { useSession } from "next-auth/react";
import useUserInfo from "@/app/hooks/useUserInfo";
import Link from "next/link";

const page = () => {

  const { data: session, status } = useSession();
    const email = session?.user?.email;
  
    const { userInfo, loading, error } = useUserInfo(email);
  

  if (status === "unauthenticated" ) 
    return(
      <div className="relative items-center justify-center flex flex-col h-screen -top-20">
        <p>Please Login to continue.</p>
        <Link href="/signin">
          <button className="text-blue-500">Sign In</button>
          </Link>
      </div>
    );


  return (
    <div>
      Cart details..
    </div>
  )
}

export default page
