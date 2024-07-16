import { Inter } from 'next/font/google'
import NavBar from '@/components/navbar'
import React from 'react'

export const interFont = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <div style={interFont.style} className='absolute w-full h-full'>
      <NavBar showLogin />
      <h1 className="text-xl mt-3 ml-3">
      </h1>
    </div>
  )
}
