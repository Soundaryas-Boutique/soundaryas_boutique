import React from 'react'
import Link from 'next/link';

const ProfileNav = () => {
  return (
    <div>
        <div className="w-80 border-r h-screen  p-4">
      
      <ul className="space-y-2">
        <li className="hover:bg-gray-100 p-2 rounded">
          <Link href="/Profile">Profile</Link>
        </li>
        <li className="hover:bg-gray-100 p-2 rounded">
          <Link href="/profile/settings">Settings</Link>
        </li>
        <li className="hover:bg-gray-100 p-2 rounded">
          <Link href="Profile/Orders">Orders</Link>
        </li>
      </ul>
    </div>
      
    </div>
  )
}

export default ProfileNav
