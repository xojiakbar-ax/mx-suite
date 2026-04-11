'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export function useCheckIns() {
  const { data, error, isLoading, mutate } = useSWR('/api/check-ins', fetcher)
  return { checkIns: data || [], error, isLoading, mutate }
}

export function useTasks() {
  const { data, error, isLoading, mutate } = useSWR('/api/tasks', fetcher)
  return { tasks: data || [], error, isLoading, mutate }
}

export function useNotifications() {
  const { data, error, isLoading, mutate } = useSWR('/api/notifications', fetcher)
  return { notifications: data || [], error, isLoading, mutate }
}

export function useEmployees() {
  const { data, error, isLoading } = useSWR('/api/employees', fetcher)
  return { employees: data || [], error, isLoading }
}

export function useStudents() {
  const { data, error, isLoading } = useSWR('/api/students', fetcher)
  return { students: data || [], error, isLoading }
}

export function useLeads() {
  const { data, error, isLoading } = useSWR('/api/leads', fetcher)
  return { leads: data || [], error, isLoading }
}

export function useBudgetRequests() {
  const { data, error, isLoading } = useSWR('/api/budget-requests', fetcher)
  return { budgetRequests: data || [], error, isLoading }
}

export function useSupportTickets() {
  const { data, error, isLoading } = useSWR('/api/support-tickets', fetcher)
  return { tickets: data || [], error, isLoading }
}

export function useUserProfile() {
  const supabase = createClient()
  const { data, error, isLoading, mutate } = useSWR('user-profile', async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    return profile
  })

  return { profile: data, error, isLoading, mutate }
}
