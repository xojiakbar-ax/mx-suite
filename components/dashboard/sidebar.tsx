'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUserProfile } from '@/hooks/use-user-profile'
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
  ChevronLeft,
  GraduationCap as Logo,
  User,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'
import { DollarSign } from 'lucide-react'
import { Info } from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles: string[]
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { profile } = useUserProfile()

  const navItems: NavItem[] = [
    { label: 'Bosh sahifa', href: '/dashboard', icon: LayoutDashboard, roles: ['director', 'cto', 'academic_director', 'academic_manager', 'marketing_manager', 'administrator'] },
    { label: 'Samaradorlik', href: '/dashboard/performance', icon: BarChart3, roles: ['director', 'cto'] },
    { label: 'Xodimlar', href: '/dashboard/employees', icon: Users, roles: ['director', 'cto'] },
    { label: 'Foydalanuvchilar', href: '/admin/users', icon: Users, roles: ['director', 'cto'] },
    { label: 'O‘quv anjomlari', href: '/dashboard/books', icon: BookOpen, roles: ['director', 'administrator'] },
    { label: 'Vazifalar', href: '/dashboard/tasks', icon: ListTodo, roles: ['director', 'cto', 'academic_director', 'academic_manager', 'marketing_manager', 'administrator'] },
    {
      label: 'Platforma haqida',
      href: '/dashboard/about',
      icon: Info, // lucide-react dan
      roles: ['director', 'cto', 'academic_director', 'academic_manager', 'marketing_manager', 'administrator']
    },
    { label: 'Attendance', href: '/dashboard/attendance', icon: UserCheck, roles: ['director', 'cto'] },
    { label: 'Maosh', href: '/dashboard/salary', icon: Wallet, roles: ['director', 'cto', 'academic_director', 'academic_manager', 'marketing_manager', 'administrator'] },
    { label: 'Byudjet', href: '/dashboard/budget', icon: DollarSign, roles: ['director', 'cto', 'academic_director', 'academic_manager', 'marketing_manager', 'administrator'] },
    { label: "Qo'llab-quvvatlash", href: '/dashboard/support', icon: LifeBuoy, roles: ['director', 'cto', 'academic_director', 'academic_manager', 'marketing_manager', 'administrator'] },
    { label: 'Profil', href: '/dashboard/profile', icon: User, roles: ['director', 'cto', 'academic_director', 'academic_manager', 'marketing_manager', 'administrator'] },
    { label: 'Sozlamalar', href: '/dashboard/settings', icon: Settings, roles: ['director', 'cto', 'academic_director', 'academic_manager', 'marketing_manager', 'administrator'] },
  ]

  // 🔥 FIXED FILTER
  const filteredItems = navItems.filter(item => {
    if (!profile?.role) return false
    return item.roles.includes(profile.role)
  })

  // 🔥 DEBUG (keyin o‘chirsa ham bo‘ladi)
  console.log('USER ROLE:', profile?.role)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'h-16 flex items-center border-b border-sidebar-border px-4',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Logo className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-bold text-xl text-sidebar-foreground">MX SUITE</span>
          )}
        </Link>

        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'hover:bg-sidebar-accent',
                collapsed && 'justify-center'
              )}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Collapse */}
      {collapsed && (
        <div className="p-3 border-t">
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </Button>
        </div>
      )}
    </aside>
  )
}