'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GraduationCap, CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">MX Suite</h1>
          </div>

          {/* Success Icon */}
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-6" />

          <h2 className="text-2xl font-bold text-foreground mb-2">Account Created!</h2>
          <p className="text-muted-foreground mb-6">
            Your account has been created successfully. Please check your email to verify your account before logging in.
          </p>

          <Button
            onClick={() => router.push('/auth/login')}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  )
}
