'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useTranslations } from '@/hooks/use-translations'
import { Button } from '@/components/ui/button'
import { CameraCheckIn } from './camera-check-in'
import { Clock, LogIn, LogOut, AlertTriangle, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CheckInBanner() {
  const t = useTranslations()
  const [showCamera, setShowCamera] = useState(false)

  const now = new Date()
  const currentTime = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
  const { todayCheckIn, checkIn, checkOut, user } = useStore()

  // ❗ faqat user bo‘lsa tekshir
  if (user?.role === 'director') {
    return null
  }
  if (!todayCheckIn) {
    return (
      <>
        <div className="bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20 rounded-2xl p-4 md:p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-warning/20 to-warning/10 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-7 h-7 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">{t('checkInRequired')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Hozirgi vaqt: {currentTime}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowCamera(true)}
                className="bg-primary hover:bg-primary/90 rounded-xl gap-2 flex-1 md:flex-auto"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">{t('checkIn')}</span>
              </Button>
            </div>
          </div>
        </div>
        <CameraCheckIn isOpen={showCamera} onClose={() => setShowCamera(false)} />
      </>
    )
  }

  if (todayCheckIn.checkOutTime) {
    return (
      <div className="bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-2xl p-4 md:p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg">{t('workEnded')}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Kirish: {todayCheckIn.checkInTime} | Chiqish: {todayCheckIn.checkOutTime}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'rounded-2xl p-5 md:p-6 mb-6 border shadow-sm hover:shadow-md transition-all',
          'flex items-center justify-between gap-4 flex-wrap',
          todayCheckIn.isLate
            ? 'bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20'
            : 'bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/20'
        )}
      >
        {/* LEFT */}
        <div className="flex items-center gap-4 min-w-0">

          {/* ICON */}
          <div
            className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm',
              todayCheckIn.isLate
                ? 'bg-destructive/20'
                : 'bg-emerald-500/20'
            )}
          >
            <Clock
              className={cn(
                'w-7 h-7',
                todayCheckIn.isLate ? 'text-destructive' : 'text-emerald-600'
              )}
            />
          </div>

          {/* TEXT */}
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-base md:text-lg truncate">
              {t('workStarted')} — {todayCheckIn.checkInTime}
              {todayCheckIn.isLate && (
                <span className="text-destructive ml-2 text-sm md:text-base">
                  ({t('lateArrival')})
                </span>
              )}
            </h3>

            <p className="text-sm text-muted-foreground mt-1">
              Hozirgi vaqt: {currentTime}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="ml-auto shrink-0">
          <Button
            onClick={checkOut}
            className="bg-destructive hover:bg-destructive/90 text-white rounded-xl gap-2 px-4 py-2 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t('checkOut')}</span>
          </Button>
        </div>
      </div>
    </>
  )
}
