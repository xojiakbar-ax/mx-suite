'use client'

import { useEffect, useRef } from 'react'

export function useSeedDemoUsers() {
  const seedAttempted = useRef(false)

  useEffect(() => {
    // Only seed once per session
    if (seedAttempted.current) return

    const seedDemoUsers = async () => {
      try {
        const response = await fetch('/api/seed-demo-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (response.ok) {
          console.log('[v0] Demo users seeded successfully')
        }
      } catch (error) {
        console.error('[v0] Error seeding demo users:', error)
      }
    }


    seedDemoUsers()
    seedAttempted.current = true
  }, [])
}
