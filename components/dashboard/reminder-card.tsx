'use client'

import { useStore } from '@/lib/store'
import { useTranslations } from '@/hooks/use-translations'
import { Lightbulb, Target, Users, CreditCard, BookOpen } from 'lucide-react'

const reminders = [
  { icon: Target, key: 'workWithLeads', roles: ['marketing_manager', 'administrator'] },
  { icon: BookOpen, key: 'checkStudentResults', roles: ['academic_manager', 'director'] },
  { icon: Users, key: 'reviewTeachers', roles: ['academic_manager', 'director'] },
  { icon: CreditCard, key: 'checkPayments', roles: ['administrator', 'cto', 'director'] },
] as const

export function ReminderCard() {
  const t = useTranslations()
  const user = useStore((state) => state.user)

  const userReminders = reminders.filter(r => user && r.roles.includes(user.role as never))

  if (userReminders.length === 0) return null

  return (
    <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-accent" />
        </div>
        <h3 className="font-semibold text-foreground">{t.reminders}</h3>
      </div>
      <div className="space-y-3">
        {userReminders.map((reminder, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <reminder.icon className="w-4 h-4 text-accent" />
            <span className="text-foreground">{t[reminder.key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
