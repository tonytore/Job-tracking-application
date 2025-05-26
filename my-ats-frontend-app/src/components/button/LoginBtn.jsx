import { redirect } from 'next/navigation'
import React from 'react'

const LoginBtn = () => {
  return (
    <div>
      <button
        onClick={() => redirect('login')}
        className="px-3 py-1 bg-indigo-500 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-indigo-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hidden md:block"
      >
        Login
      </button>
    </div>
  )
}

export default LoginBtn
