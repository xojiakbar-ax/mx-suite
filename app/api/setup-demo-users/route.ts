import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const DEMO_USERS = [
  {
    email: 'xojiakbarr.a@gmail.com',
    password: 'cto321',
    name: 'Demo CTO',
    role: 'cto'
  },
  {
    email: 'director@demo.uz',
    password: '123456',
    name: 'Demo Director',
    role: 'director'
  },
]

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    for (const user of DEMO_USERS) {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const userExists = existingUsers?.users?.some((u) => u.email === user.email)

      if (userExists) {
        console.log(`[v0] Demo user ${user.email} already exists`)
        continue
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: {
          name: user.name,
          role: user.role,
        },
        email_confirm: true,
      })

      if (authError) {
        console.error(`[v0] Failed to create user ${user.email}:`, authError)
        continue
      }

      if (authData.user) {
        console.log(`[v0] Created user: ${user.email}`)

        // Verify profile was created, or create it manually
        const { data: profileExists } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', authData.user.id)
          .maybeSingle()

        if (!profileExists) {
          await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              },
            ])
          console.log(`[v0] Created profile for: ${user.email}`)
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Demo users setup complete' })
  } catch (error) {
    console.error('[v0] Error setting up demo users:', error)
    return NextResponse.json({ error: 'Failed to setup demo users' }, { status: 500 })
  }
}
