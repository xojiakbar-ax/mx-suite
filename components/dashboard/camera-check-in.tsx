'use client'

import { useState, useRef, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { useTranslations } from '@/hooks/use-translations'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface CameraCheckInProps {
  isOpen: boolean
  onClose: () => void
}

export function CameraCheckIn({ isOpen, onClose }: CameraCheckInProps) {
  const checkIn = useStore((state) => state.checkIn)
  const checkOut = useStore((state) => state.checkOut)
  const t = useTranslations()
  const supabase = createClient()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const getTime = () => {
    const now = new Date()
    return now.toISOString().slice(11, 16) // 🔥 ENG TO‘G‘RI
  }

  const [caption, setCaption] = useState(getTime())
  // 🎥 CAMERA START
  useEffect(() => {
    if (!isOpen) return

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true)
          }
        }

        streamRef.current = mediaStream
      } catch (error) {
        console.error('Camera error:', error)
        alert('❌ Kamera uchun ruxsat berilmagan')
      }
    }

    startCamera()
    useEffect(() => {
      if (isOpen) {
        setCaption(new Date().toISOString().slice(11, 16))
      }
    }, [isOpen])
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isOpen])

  // 📸 CAPTURE
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const context = canvasRef.current.getContext('2d')
    if (!context) return

    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight

    context.drawImage(videoRef.current, 0, 0)

    const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageData)
  }
  const uploadImage = async (base64: string) => {
    const res = await fetch(base64)
    const blob = await res.blob()

    const fileName = `checkin-${Date.now()}.jpg`

    const file = new File([blob], fileName, {
      type: 'image/jpeg'
    })

    const { error } = await supabase.storage
      .from('attendance-images')
      .upload(fileName, file)

    if (error) {
      console.error('UPLOAD ERROR:', error.message)
      alert(error.message)
      return null
    }

    const { data } = supabase.storage
      .from('attendance-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  }
  const handleCheckIn = async () => {
    if (!capturedImage) {
      alert("❌ Rasm majburiy")
      return
    }

    if (!caption) {
      alert("❌ Izoh yozing")
      return
    }

    // 🔥 VAQT FORMAT CHECK (masalan: 12:30)
    const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/

    if (!timeRegex.test(caption)) {
      alert("⏰ Vaqtni to‘g‘ri kiriting (masalan: 08:30)")
      return
    }

    const imageUrl = await uploadImage(capturedImage)
    if (!imageUrl) return

    checkIn(imageUrl, caption)
    resetAndClose()
  }

  const handleCheckOut = () => {
    checkOut()
    resetAndClose()
  }

  const resetAndClose = () => {
    setCapturedImage(null)
    setIsCameraReady(false)
    setCaption(new Date().toISOString().slice(11, 16))
    onClose()
  }

  const handleRetake = () => {
    setCapturedImage(null)
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {t('checkIn') || 'Check In / Out'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {!capturedImage ? (
            <>
              {/* CAMERA */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              <Button
                onClick={capturePhoto}
                disabled={!isCameraReady}
                className="w-full bg-primary"
              >
                📸 Rasm olish
              </Button>

              <input
                type="time"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border rounded-md p-2"
                required
              />
            </>
          ) : (
            <>
              {/* PREVIEW */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>

              <input
                type="time"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border rounded p-2"
                required
              />

              {/* ACTIONS */}
              <div className="flex gap-2">
                <Button
                  onClick={handleRetake}
                  variant="outline"
                  className="flex-1"
                >
                  Qayta olish
                </Button>

                <Button
                  onClick={handleCheckIn}
                  disabled={!capturedImage || !caption}
                  className="flex-1 bg-green-600 disabled:opacity-50"
                >
                  ✅ Ish boshladim
                </Button>

              </div>
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
}