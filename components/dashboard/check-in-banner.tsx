'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useTranslations } from '@/hooks/use-translations'
import { Button } from '@/components/ui/button'
import { CameraCheckIn } from './camera-check-in'
import { Clock, LogOut, AlertTriangle, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CheckInBanner() {
  const t = useTranslations()
  const [showCamera, setShowCamera] = useState(false)

  const { todayCheckIn, checkOut, user } = useStore()

  // ❗ director ko‘rmaydi
  if (user?.role === 'director') return null
  const lateMinutes = (() => {
    if (!todayCheckIn?.checkInTime) return 0

    const [h, m] = todayCheckIn.checkInTime.split(':').map(Number)

    const checkInTotal = h * 60 + m
    const deadline = 8 * 60 // 08:00

    return checkInTotal > deadline ? checkInTotal - deadline : 0
  })()
  // 🔴 CHECK-IN YO‘Q (SAFE VERSION)
  if (!todayCheckIn) {
    return (
      <>
        <div className="bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20 rounded-2xl p-4 md:p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-warning/20 to-warning/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-warning" />
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  {t('checkInRequired')}
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  ❗ Avval check-in qiling
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowCamera(true)}
              className="bg-primary hover:bg-primary/90 rounded-xl gap-2"
            >
              <Camera className="w-4 h-4" />
              {t('checkIn')}
            </Button>

          </div>
        </div>

        <CameraCheckIn
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
        />
      </>
    )
  }

  // 🔵 ISH TUGAGAN
  if (todayCheckIn.checkOutTime) {
    return (
      <div className="bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-2xl p-4 md:p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-4">

          <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center">
            <Clock className="w-7 h-7 text-muted-foreground" />
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              {t('workEnded')}
            </h3>

            <p className="text-sm text-muted-foreground mt-1">
              Kirish: {todayCheckIn.checkInTime} | Chiqish: {todayCheckIn.checkOutTime}
            </p>
          </div>

        </div>
      </div>
    )
  }

  // 🟢 ISH BOSHLANGAN
  return (
    <div
      className={cn(
        // BASE
        'relative rounded-2xl p-5 md:p-6 mb-6 overflow-hidden',
        'flex items-center justify-between gap-4 flex-wrap',
        'border shadow-sm hover:shadow-lg transition-all duration-300',

        // 🔥 LATE (RED MODE)
        lateMinutes > 0
          ? [
            'bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent',
            'border-red-500/30',
            'hover:shadow-red-500/20',
          ]

          // 🟢 NORMAL (GREEN MODE)
          : [
            'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent',
            'border-emerald-500/30',
            'hover:shadow-emerald-500/20',
          ]
      )}
    >
      {/* Glow effect */}
      <div
        className={cn(
          'absolute left-0 top-0 h-full w-1.5 rounded-l-2xl',
          lateMinutes > 0
            ? 'bg-red-500'
            : 'bg-emerald-500'
        )}
      />
      {/* LEFT */}
      <div className="flex items-center gap-4">

        <div
          className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center',
            lateMinutes > 0
              ? 'bg-destructive/20'
              : 'bg-emerald-500/20'
          )}
        >
          <Clock
            className={cn(
              'w-7 h-7',
              lateMinutes > 0 ? 'text-destructive' : 'text-emerald-600'
            )}
          />
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            {t('workStarted')} — {todayCheckIn.checkInTime}

            {lateMinutes > 0 && (
              <span className="ml-2 text-sm text-destructive font-medium">
                ⏱ {lateMinutes} min kechikish
              </span>
            )}
          </h3>

          <p className="text-sm text-muted-foreground mt-1">
            Ish boshlagan vaqt: {todayCheckIn.checkInTime}
          </p>
        </div>

      </div>

      {/* RIGHT */}
      <Button
        onClick={checkOut}
        className="bg-destructive hover:bg-destructive/90 text-white rounded-xl gap-2 px-4"
      >
        <LogOut className="w-4 h-4" />
        {t('checkOut')}
      </Button>

    </div>
  )
}