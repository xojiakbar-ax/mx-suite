'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { GraduationCap, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import Link from 'next/link'

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSetupDemoUsers = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/setup-demo-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to setup demo users')
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('An error occurred while setting up demo users')
      console.error('[v0] Setup error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
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
            Initial Setup
          </p>

          {/* Success Alert */}
          {success && (
            <Alert className="mb-6 border-green-500/50 bg-green-500/10">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Demo users created successfully! You can now login.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div>
              <h2 className="font-semibold text-foreground mb-2">Setup Instructions</h2>
              <p className="text-sm text-muted-foreground mb-4">
                This page will create demo users in your Supabase database so you can login and test the application.
              </p>
              <p className="text-sm text-muted-foreground">
                Click the button below to create demo accounts with the following credentials:
              </p>
            </div>

            <div className="space-y-2 bg-secondary/50 p-4 rounded-lg border border-border">
              <p className="text-sm font-medium text-foreground">CTO Account:</p>
              <p className="text-xs text-muted-foreground">Email: xojiakbarr.a@gmail.com</p>
              <p className="text-xs text-muted-foreground">Password: cto321</p>

              <div className="pt-3 border-t border-border">
                <p className="text-sm font-medium text-foreground">Director Account:</p>
                <p className="text-xs text-muted-foreground">Email: director@demo.uz</p>
                <p className="text-xs text-muted-foreground">Password: 123456</p>
              </div>
            </div>

            <Button
              onClick={handleSetupDemoUsers}
              disabled={loading || success}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              {success ? 'Setup Complete' : loading ? 'Setting up...' : 'Create Demo Users'}
            </Button>

            {success && (
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <Link href="/auth/login">Go to Login</Link>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
