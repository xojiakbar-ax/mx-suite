'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useStore, type UserRole } from '@/lib/store'
import { useTranslations } from '@/hooks/use-translations'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  CalendarDays,
  CreditCard,
  Target,
  Megaphone,
  ListTodo,
  TrendingUp,
  Wallet,
  PiggyBank,
  LifeBuoy,
  Settings,
  X,
  GraduationCap as Logo,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles: UserRole[]
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname()
  const t = useTranslations()
  const user = useStore((state) => state.user)

  const navItems: NavItem[] = [
    { label: t.dashboard, href: '/dashboard', icon: LayoutDashboard, roles: ['director', 'cto', 'academic_manager', 'marketing_manager', 'administrator'] },
    { label: t.employees, href: '/dashboard/employees', icon: Users, roles: ['director', 'cto'] },
    { label: t.students, href: '/dashboard/students', icon: GraduationCap, roles: ['director', 'cto', 'academic_manager', 'administrator'] },
    { label: t.teachers, href: '/dashboard/teachers', icon: UserCheck, roles: ['director', 'cto', 'academic_manager'] },
    { label: t.groups, href: '/dashboard/groups', icon: CalendarDays, roles: ['director', 'cto', 'academic_manager', 'administrator'] },
    { label: t.payments, href: '/dashboard/payments', icon: CreditCard, roles: ['director', 'cto', 'administrator'] },
    { label: t.leads, href: '/dashboard/leads', icon: Target, roles: ['director', 'cto', 'marketing_manager', 'administrator'] },
    { label: t.campaigns, href: '/dashboard/campaigns', icon: Megaphone, roles: ['director', 'cto', 'marketing_manager'] },
    { label: t.tasks, href: '/dashboard/tasks', icon: ListTodo, roles: ['director', 'cto', 'academic_manager', 'marketing_manager', 'administrator'] },
    { label: t.kpi, href: '/dashboard/kpi', icon: TrendingUp, roles: ['director', 'cto', 'academic_manager', 'marketing_manager', 'administrator'] },
    { label: t.salary, href: '/dashboard/salary', icon: Wallet, roles: ['director', 'cto'] },
    { label: t.budget, href: '/dashboard/budget', icon: PiggyBank, roles: ['director', 'cto', 'academic_manager', 'marketing_manager', 'administrator'] },
    { label: t.support, href: '/dashboard/support', icon: LifeBuoy, roles: ['director', 'cto', 'academic_manager', 'marketing_manager', 'administrator'] },
    { label: t.settings, href: '/dashboard/settings', icon: Settings, roles: ['director', 'cto'] },
  ]

  const filteredItems = navItems.filter(item => user && item.roles.includes(user.role))

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-72 bg-sidebar border-r border-sidebar-border lg:hidden flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Logo className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-sidebar-foreground">MX SUITE</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-xl text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-sidebar-primary-foreground')} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
