'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface UserProfile {
  id: string
  email: string
  name: string
  role: 'director' | 'cto' | 'academic_director' | 'academic_manager' | 'marketing_manager' | 'administrator' | 'teacher'
  phone: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export function useUserProfile() {
  // ✅ FIX: stable supabase instance (har renderda o‘zgarmaydi)
  const supabase = useMemo(() => createClient(), [])

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchUserProfile = async () => {
      try {
        // ⚡ FAST AUTH
        const {
          data: { session },
        } = await supabase.auth.getSession()

        const authUser = session?.user

        if (!isMounted) return

        if (!authUser) {
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }

        setUser(authUser)

        // ⚡ PROFILE FETCH (SAFE)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle()

        if (!isMounted) return

        // 🛠 CREATE PROFILE IF NOT EXISTS (SAFE)
        if (!profileData) {
          const newProfile: UserProfile = {
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || 'User',
            phone: authUser.user_metadata?.phone || '',
            role: 'administrator',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile)

          if (insertError) {
            console.warn('[v0] Profile create error:', insertError.message)
          }

          setProfile(newProfile)
        } else {
          setProfile(profileData as UserProfile)
        }

        setLoading(false)
      } catch (err) {
        console.error('[v0] Error fetching profile:', err)

        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load profile')
          setLoading(false)
        }
      }
    }

    fetchUserProfile()

    // 🧹 CLEANUP
    return () => {
      isMounted = false
    }
  }, [supabase]) // ✅ FIX: stable dependency

  return { user, profile, loading, error }
}