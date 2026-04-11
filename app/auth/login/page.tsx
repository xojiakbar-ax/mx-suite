'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { GraduationCap, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const setUser = useStore((state) => state.setUser) // 🔥 MUHIM
  const logout = useStore((state) => state.logout)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 🔐 LOGIN
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('Email yoki parol noto‘g‘ri')
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('User topilmadi')
        setLoading(false)
        return
      }

      const userId = data.user.id

      // 👤 PROFILE OLISH
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError || !profile) {
        setError('Role topilmadi. Admin bilan bog‘laning.')
        setLoading(false)
        return
      }

      // 🔥 1. eski userni tozalaymiz
      logout()

      // 🔥 2. yangi user qo‘yamiz
      setUser({
        id: profile.id,
        name: profile.name,
        role: profile.role,
        phone: profile.phone || '',
      })
      useStore.getState().restoreCheckInState()

      // 🚀 HAMMA DASHBOARDGA BORADI
      router.replace('/dashboard')

    } catch (err) {
      console.error(err)
      setError('Xatolik yuz berdi')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">MX SUITE</h1>
          </div>

          <p className="text-center text-muted-foreground mb-8">
            Management System
          </p>

          {error && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Parol</label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Kirmoqda...' : 'Kirish'}
            </Button>

          </form>
        </div>
      </Card>
    </div>
  )
}