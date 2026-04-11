'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'

export function useInitializeCheckInState() {
  useEffect(() => {
    // Restore check-in state from localStorage on mount
    const store = useStore.getState()
    if (store.isAuthenticated) {
      store.restoreCheckInState()
    }
  }, [])
}
