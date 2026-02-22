'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/context/auth-context'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" />
    </AuthProvider>
  )
}
