'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUserProfile } from '@/hooks/use-user-profile'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Bell,
  Sun,
  Moon,
  Globe,
  Menu,
  LogOut,
  User,
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const { profile, loading } = useUserProfile()
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('uz')

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setDarkMode(isDark)
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (err) {
      console.error('[v0] Logout error:', err)
    }
  }

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
    setDarkMode(!darkMode)
  }

  const getRoleName = (role?: string) => {
    if (!role) return ''
    const roles: Record<string, string> = {
      director: 'Director',
      cto: 'CTO',
      academic_manager: 'Akademik Menejer',
      marketing_manager: 'Marketing Menejer',
      administrator: 'Administrator',
      teacher: 'O\'qituvchi',
    }
    return roles[role] || role
  }

  if (loading) {
    return (
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden rounded-xl">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>
    )
  }

  const userName = profile?.name || 'User'
  const userRole = profile?.role || 'administrator'

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden rounded-xl"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-foreground">Xush kelibsiz, {userName}!</h1>
          <p className="text-sm text-muted-foreground">{getRoleName(userRole)}</p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLanguage(language === 'uz' ? 'en' : 'uz')}
          className="rounded-xl"
        >
          <Globe className="w-5 h-5" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-xl"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Bell className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="font-semibold">Bildirishnomalar</span>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <div className="px-3 py-6 text-center text-muted-foreground text-sm">
                Bildirishnomalar yo&apos;q
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-xl gap-2 px-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-foreground">
                  {userName.charAt(0)}
                </span>
              </div>
              <span className="hidden sm:inline text-sm font-medium">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
            <div className="px-3 py-2">
              <p className="font-medium">{userName}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-xl cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Chiqish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
