'use client'

import { useEffect, useState, useMemo } from 'react'
import { useStore } from '@/lib/store'
import { StatCard } from '@/components/dashboard/stat-card'
import { ReminderCard } from '@/components/dashboard/reminder-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Clock, CheckCircle, TrendingUp } from 'lucide-react'


import {
  BarChart,
  Bar,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

// ================= DATA =================
const revenueData = [
  { month: 'Yan', revenue: 45000000 },
  { month: 'Fev', revenue: 52000000 },
  { month: 'Mar', revenue: 48000000 },
  { month: 'Apr', revenue: 61000000 },
  { month: 'May', revenue: 55000000 },
  { month: 'Iyn', revenue: 67000000 },
]

const leadsData = [
  { day: 'Dush', leads: 12 },
  { day: 'Sesh', leads: 19 },
  { day: 'Chor', leads: 15 },
  { day: 'Pay', leads: 22 },
  { day: 'Jum', leads: 18 },
]

// ================= HELPERS =================
const getTaskStatusLabel = (status: string) => {
  const map: any = {
    pending: 'Kutilmoqda',
    in_progress: 'Jarayonda',
    completed: 'Bajarildi',
  }
  return map[status] || status
}

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-600'
    case 'in_progress': return 'bg-blue-100 text-blue-600'
    case 'completed': return 'bg-green-100 text-green-600'
    default: return ''
  }
}
// ================= COMPONENT =================
export default function DashboardPage() {
  const store = useStore()
  const [loading, setLoading] = useState(true)

  const { fetchEmployees, subscribeEmployees } = useStore()
  const {
    user,
    tasks,
    employees,
    budgetRequests,
    fetchTasks,
    subscribeTasks,
    notifications,
    addNotification // 🔥 SHUNI QO‘SH
  } = useStore()
  const myNotifications = notifications.filter(
    n => n.userId === user?.id
  )
  const { checkTaskNotifications } = useStore()

  useEffect(() => {
    fetchTasks()
    fetchEmployees()

    const unsubTasks = subscribeTasks()
    const unsubEmployees = subscribeEmployees()

    // 🔥 SHU MUHIM QATOR
    checkTaskNotifications()

    return () => {
      unsubTasks()
      unsubEmployees()
    }
  }, [tasks])
  console.log('employees:', employees)

  useEffect(() => {
    const checkDeadlines = () => {
      const now = Date.now()

      tasks.forEach(task => {
        if (!task.deadline) return
        if (task.status === 'completed') return

        const diff = new Date(task.deadline).getTime() - now

        // ❌ SPAMNI OLDINI OLISH
        const exists = notifications.find(n =>
          n.message.includes(task.title)
        )
        if (exists) return

        // 🔥 DEADLINE YAQIN (24 soat)
        if (diff > 0 && diff < 1000 * 60 * 60 * 24) {
          addNotification({
            type: 'reminder',
            title: 'Deadline yaqin ⚠️',
            message: `${task.title} tez orada tugaydi`,
            link: '/dashboard/tasks'
          })
        }

        // 🔥 KECHIKDI
        if (diff <= 0) {
          addNotification({
            type: 'task',
            title: 'Task kechikdi ❌',
            message: `${task.title} muddati o‘tdi`,
            link: '/dashboard/tasks'
          })
        }
      })
    }

    checkDeadlines()

    const interval = setInterval(checkDeadlines, 1000 * 60 * 60) // har 1 soat

    return () => clearInterval(interval)
  }, [tasks])
  // 🔥 ROLE LOGIC
  const visibleTasks = tasks.filter(task => {
    if (user?.role === 'director' || user?.role === 'cto') return true
    return task.assigned_to === user?.id
  })
  const isBoss = ['director', 'cto'].includes(user?.role || '')
  const visibleEmployees = isBoss
    ? employees.filter(emp => emp.id !== user?.id)
    : []

  const pending = visibleTasks.filter(t => t.status === 'pending').length
  const progress = visibleTasks.filter(t => t.status === 'in_progress').length
  const done = visibleTasks.filter(t => t.status === 'completed').length
  const total = visibleTasks.length || 1
  const pendingPercent = Math.round((pending / total) * 100)
  const progressPercent = Math.round((progress / total) * 100)
  const donePercent = Math.round((done / total) * 100)
  const today = new Date().toISOString().split('T')[0]

  const todayTasks = visibleTasks.filter(t =>
    t.deadline?.startsWith(today)
  )
  const urgentTasks = visibleTasks.filter(t => {
    if (!t.deadline) return false

    const diff = new Date(t.deadline).getTime() - Date.now()

    return diff > 0 && diff < 1000 * 60 * 60 * 6
  })
  const pendingBudgetRequests = useMemo(() =>
    budgetRequests.filter(b => b.status === 'pending'),
    [budgetRequests]
  )

  if (!user) return <div>User topilmadi</div>

  // ================= UI =================
  return (
    <div className="space-y-6">

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending" value={pending} icon={<Clock />} />
        <StatCard title="Jarayonda" value={progress} icon={<Target />} />
        <StatCard title="Bajarilgan" value={done} icon={<CheckCircle />} />
        <StatCard title="Progress" value={`${donePercent}%`} icon={<TrendingUp />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          <Card className="rounded-2xl shadow-xl border bg-gradient-to-br from-white via-gray-50 to-gray-100 hover:shadow-2xl transition-all duration-300">            <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Task statistikasi
              <span className="text-xs text-gray-400">
                {total} ta task
              </span>
            </CardTitle>
          </CardHeader>

            <CardContent className="space-y-4">

              {/* Pending */}
              <div>
                <div className="flex justify-between text-sm">
                  <span>Pending</span>
                  <span>{pending}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-2 bg-yellow-400 rounded"
                    style={{ width: `${pendingPercent}%` }} />
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm">
                  <span>Jarayonda</span>
                  <span>{progress}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-2 bg-blue-500 rounded"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Done */}
              <div>
                <div className="flex justify-between text-sm">
                  <span>Bajarilgan</span>
                  <span>{done}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-2 bg-green-500 rounded"
                    style={{ width: `${donePercent}%` }} />
                </div>
              </div>
              {(user?.role === 'director' || user?.role === 'cto') && visibleEmployees.length > 0 && (<div className="mt-6 space-y-3">

                <h4 className="text-sm font-semibold text-gray-500">
                  Xodimlar statistikasi
                </h4>

                {visibleEmployees.map((emp: any) => {
                  const empTasks = tasks.filter(t => t.assigned_to === emp.id)

                  const total = empTasks.length

                  const percent = total
                    ? Math.round(
                      empTasks.reduce((sum, t) => sum + (t.progress || 0), 0) / total
                    )
                    : 0

                  return (
                    <div key={emp.id}>
                      <div className="flex justify-between text-xs">
                        <span>{emp.name || emp.email}</span>
                        <span>{percent}%</span>
                      </div>

                      <div className="h-2 bg-gray-200 rounded overflow-hidden">
                        <div
                          className="h-2 bg-blue-500 rounded transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              )}
            </CardContent>
          </Card>



        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <ReminderCard />
          <div className="space-y-3">

            <h3 className="font-semibold text-lg">🔔 Bildirishnomalar</h3>

            {myNotifications.slice(0, 5).map(n => {

              const color =
                n.type === 'task'
                  ? 'border-red-300 bg-red-50'
                  : n.type === 'reminder'
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-blue-300 bg-blue-50'

              return (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border shadow-sm hover:shadow-md transition ${color}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{n.title}</span>
                  </div>

                  <p className="text-sm text-gray-600">
                    {n.message}
                  </p>
                </div>
              )
            })}

          </div>



        </div>

      </div>
    </div>
  )
}