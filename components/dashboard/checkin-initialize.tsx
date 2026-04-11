'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'

export function CheckInInitializer() {
    useEffect(() => {
        useStore.getState().restoreCheckInState()
    }, [])

    return null
}