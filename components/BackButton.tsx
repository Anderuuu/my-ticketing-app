'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()

  return (
    <button 
      onClick={() => router.back()}
      className="absolute top-6 left-6 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-gray-200 shadow-sm text-gray-800 px-4 py-2 rounded-full hover:bg-gray-100 transition font-medium"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  )
}