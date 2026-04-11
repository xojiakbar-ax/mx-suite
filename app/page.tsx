'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RootPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // 🔥 FIX: agar hozirgi path allaqachon to‘g‘ri bo‘lsa — redirect qilmaydi
        const currentPath = window.location.pathname

        if (session) {
          if (currentPath !== '/dashboard') {
            router.replace('/dashboard')
          }
        } else {
          if (currentPath !== '/auth/login') {
            router.replace('/auth/login')
          }
        }

      } catch (error) {
        console.error('Auth check failed:', error)
      }
    }

    checkAuth()
  }, [router, supabase])

  return null
}