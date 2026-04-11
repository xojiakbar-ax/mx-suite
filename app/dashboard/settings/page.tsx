'use client'

import { useStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Globe, Bell, BellOff } from 'lucide-react'

export default function SettingsPage() {
  const darkMode = useStore((state) => state.darkMode)
  const toggleDarkMode = useStore((state) => state.toggleDarkMode)
  const language = useStore((state) => state.language)
  const setLanguage = useStore((state) => state.setLanguage)
  const notificationsEnabled = useStore((state) => state.notificationsEnabled)
  const toggleNotifications = useStore((state) => state.toggleNotifications)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Sozlamalar</h1>
          <p className="text-sm text-muted-foreground">O'z tajribangizni sozlang</p>
        </div>

        {/* Theme */}
        <Card className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {darkMode ? <Moon /> : <Sun />}
            <div>
              <h3 className="font-bold">Tema</h3>
              <p className="text-sm text-muted-foreground">
                {darkMode ? 'Dark mode yoqilgan' : 'Light mode yoqilgan'}
              </p>
            </div>
          </div>

          <Button onClick={toggleDarkMode}>
            {darkMode ? 'Light ga o‘tish' : 'Dark ga o‘tish'}
          </Button>
        </Card>

        {/* Language */}
        <Card className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Globe />
            <div>
              <h3 className="font-bold">Til</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'uz' ? "O'zbekcha" : 'English'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setLanguage('uz')}>UZ</Button>
            <Button onClick={() => setLanguage('en')}>EN</Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {notificationsEnabled ? <Bell /> : <BellOff />}
            <div>
              <h3 className="font-bold">Bildirishnomalar</h3>
              <p className="text-sm text-muted-foreground">
                {notificationsEnabled ? 'Yoqilgan' : 'O‘chirilgan'}
              </p>
            </div>
          </div>

          <Button onClick={toggleNotifications}>
            {notificationsEnabled ? 'O‘chirish' : 'Yoqish'}
          </Button>
        </Card>

      </div>
    </div>
  )
}