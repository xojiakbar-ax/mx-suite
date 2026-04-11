import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const DEMO_ACCOUNTS = [
  { name: 'Demo Director', phone: '998901111111', password: '123456', role: 'director' },
  { name: 'Demo CTO', phone: '998902222222', password: '123456', role: 'cto' },
  { name: 'Demo Manager', phone: '998903333333', password: '123456', role: 'academic_manager' },
]

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    for (const account of DEMO_ACCOUNTS) {
      const email = account.phone + '@demo.educenter.uz'

      // Check if user already exists in auth
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const userExists = existingUsers?.users?.some((u) => u.email === email)

      if (userExists) {
        console.log(`[v0] Demo user ${email} already exists in auth`)
        continue
      }

      // Create auth user using admin API (service role)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: account.password,
        user_metadata: {
          name: account.name,
          phone: account.phone,
          role: account.role,
        },
        email_confirm: true, // Auto-confirm demo accounts
      })

      if (authError) {
        console.error(`[v0] Failed to create demo user ${email}:`, authError)
        continue
      }

      if (authData.user) {
        console.log(`[v0] Created demo user in auth: ${email}`)

        // Verify profile was created by trigger, or create it manually
        const { data: profileExists } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', authData.user.id)
          .maybeSingle()

        if (!profileExists) {
          // Create profile manually if trigger didn't work
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                name: account.name,
                email: email,
                phone: account.phone,
                role: account.role,
              },
            ])

          if (profileError) {
            console.error(`[v0] Failed to create profile for ${email}:`, profileError)
          } else {
            console.log(`[v0] Created profile for: ${email}`)
          }
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Demo users seeded' })
  } catch (error) {
    console.error('[v0] Error seeding demo users:', error)
    return NextResponse.json({ error: 'Failed to seed demo users' }, { status: 500 })
  }
}
