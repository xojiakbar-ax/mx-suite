'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { GraduationCap, Mail, Lock, AlertCircle, User, Phone } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('administrator')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validation
      if (!name || !email || !password || !confirmPassword) {
        setError('Barcha maydonlarni to\'ldiring')
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Parollar mos kelishi kerak')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak')
        setLoading(false)
        return
      }

      // Sign up with Supabase
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            role,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // Create profile in database
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name,
            phone,
            role,
          })

        if (profileError) {
          console.error('[v0] Profile creation error:', profileError)
        }

        router.push('/auth/sign-up-success')
      }
    } catch (err) {
      console.error('[v0] Sign up error:', err)
      setError('Xato yuz berdi. Iltimos, qayta urinib ko\'ring.')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          {/* Logo & Title */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">MX SUITE</h1>
          </div>

          <p className="text-center text-muted-foreground mb-8">
            Yangi akkaunt yaratish
          </p>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">To&apos;liq ism</label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Sizning ismingiz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Telefon</label>
              <div className="relative mt-2">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="+998 (90) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Rol</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                className="w-full mt-2 px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="administrator">Administrator</option>
                <option value="director">Director</option>
                <option value="cto">CTO</option>
                <option value="academic_manager">Akademik Menejer</option>
                <option value="teacher">O&apos;qituvchi</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Parol</label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Parolni qayta kiriting</label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Allaqachon akkauntingiz bormi?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Kirish
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
