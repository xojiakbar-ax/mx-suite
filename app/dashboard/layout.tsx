'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/lib/store'
import { Sidebar } from '@/components/dashboard/sidebar'
import { MobileSidebar } from '@/components/dashboard/mobile-sidebar'
import { Header } from '@/components/dashboard/header'
import { CheckInBanner } from '@/components/dashboard/check-in-banner'
import { CameraCheckIn } from '@/components/dashboard/camera-check-in'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false) // 🔥 FIX

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const { todayCheckIn, user: storeUser, isHydrated, isCheckInLoaded } = useStore()
  const { restoreCheckInState } = useStore()
  useEffect(() => {
    setMounted(true) // 🔥 SSR → CSR fix

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession()

        // 🔥 session yo‘q bo‘lsa faqat redirect
        if (!data.session) {
          router.replace('/auth/login')
          return
        }

        setUser(data.session.user)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [supabase, router])
  useEffect(() => {
    if (storeUser) {
      restoreCheckInState()
    }
  }, [storeUser])
  useEffect(() => {
    if (
      storeUser &&
      storeUser.role !== 'director' &&
      isCheckInLoaded && // 🔥 ENG MUHIM
      !todayCheckIn
    ) {
      setCheckInOpen(true)
    }
  }, [storeUser, todayCheckIn, isCheckInLoaded])
  // 🔥 hydration fix
  if (!mounted) return null

  // ⏳ loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Yuklanmoqda...
      </div>
    )
  }

  // ❌ auth yo‘q
  if (!user) return null
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Yuklanmoqda...
      </div>
    )
  }
  // 🔥 FORCE CHECK-IN (SAFE)


  // ✅ NORMAL DASHBOARD
  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="p-4 lg:p-6">
          <CheckInBanner />
          {children}
          <CameraCheckIn
            isOpen={checkInOpen}
            onClose={() => setCheckInOpen(false)}
          />
        </main>
      </div>
    </div>
  )
}