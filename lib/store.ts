import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language } from './translations'
import { createClient } from '@/lib/supabase/client'

export type UserRole = 'director' | 'cto' | 'academic_director' | 'academic_manager' | 'marketing_manager' | 'administrator'

export interface User {
  id: string
  name: string
  role: UserRole
  phone: string
  avatar?: string
  email?: string
}

export interface CheckIn {
  userId: string        // 🔥 YANGI
  userName: string      // 🔥 YANGI
  date: string
  checkInTime: string | null
  checkOutTime: string | null
  isLate: boolean
  penalty: number
  penaltyReason?: string // 🔥 QO‘SH
  checkInImage: string
  caption?: string      // 🔥 YANGI
  dateFull?: string
  email?: string      // 🔥 QO‘SH
  role?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  assigned_to: string
  deadline: string
  priority: 'low' | 'medium' | 'high'

  createdBy?: string
  note?: string
  is_locked?: boolean
  createdAt?: string // 🔥 SHUNI QO‘SH
  progress?: number
}

export interface BudgetRequest {
  id: string
  userId: string
  userName: string
  type: 'education' | 'personal' // 🔥 YANGI
  amount: number
  note: string
  status: 'pending' | 'approved' | 'rejected'
  approvals: string[] // 🔥 YANGI (director, cto)
  createdAt: string
}

export interface SupportTicket {
  id: string
  userId: string
  userName: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'resolved'
  attachments: string[]
  createdAt: string
  resolvedAt?: string
}

export interface Notification {
  id: string
  type: 'budget' | 'task' | 'support' | 'reminder' | 'system' | 'checkin'
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
  image?: string

  userId?: string // 🔥 SHUNI QO‘SH
}

export interface Employee {
  id: string
  name: string
  role: UserRole
  phone: string

  // 🔥 salary system
  student_count: number
  penalty_reason?: string
  coursePrice: number
  percent: number

  // 🔥 salary adjustments
  penalties: number
  bonuses: number

  // 🔥 eski system (ERROR ketishi uchun qoldiramiz)
  kpiDaily?: number
  kpiWeekly?: number
  kpiMonthly?: number

  tasksCompleted?: number
  tasksPending?: number
  lateCheckIns?: number
}

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  removeCheckIn: (id: string) => void
  setHydrated: () => void
  setUser: (user: User) => void
  login: (phone: string, password: string) => boolean
  logout: () => void
  updateUserProfile: (name: string, phone: string, email?: string) => void
  updateUserPassword: (oldPassword: string, newPassword: string) => boolean
  updateTaskNote: (id: string, note: string) => void
  fetchTasks: () => Promise<void>
  subscribeTasks: () => () => void
  addEmployee: (emp: Omit<Employee, 'id' | 'penalties' | 'bonuses'>) => void
  updateEmployeePercent: (id: string, percent: number) => void
  calculateEmployeePerformance: (id: string) => {
    performance: number
    status: 'excellent' | 'average' | 'poor'
  }
  // Settings
  language: Language
  setLanguage: (lang: Language) => void
  darkMode: boolean
  toggleDarkMode: () => void
  notificationsEnabled: boolean
  toggleNotifications: () => void
  fetchEmployees: () => Promise<void>
  subscribeEmployees: () => () => void
  checkTaskNotifications: () => void

  // Check-in
  todayCheckIn: CheckIn | null
  checkIn: (image?: string, caption?: string) => void
  isCheckInLoaded: boolean   // 🔥 SHU QATORNI QO‘SH
  checkOut: () => void
  addPenalty: (amount: number) => void
  allCheckIns: { [key: string]: CheckIn }
  getCheckInHistory: (userId: string, limit?: number) => CheckIn[]
  restoreCheckInState: () => void
  fetchCheckIns: () => Promise<void>

  // Tasks
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTaskStatus: (id: string, status: Task['status']) => void
  deleteTask: (id: string) => void

  // Budget
  managerBudgets: {
    [userId: string]: {
      education: number
      personal: number
    }
  }
  monthlyBudget: number
  budgetSpent: number
  budgetRequests: BudgetRequest[]
  requestBudget: (amount: number, note: string, type: 'education' | 'personal') => void

  reviewBudgetRequest: (
    id: string,
    approved: boolean,
    reviewerId: string,
    role: 'director' | 'cto'
  ) => void

  // Support
  supportTickets: SupportTicket[]
  createTicket: (title: string, description: string, attachments: string[]) => void
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void

  // Employees
  employees: Employee[]
  updateEmployeeBonus: (id: string, amount: number) => void
  getEmployeeAttendance: (id: string) => { totalDays: number; lateDays: number; onTimeDays: number; attendanceRate: number }
}

// Demo users for login
const demoUsers: { phone: string; password: string; user: User }[] = [
  { phone: '+998901234567', password: 'director123', user: { id: '1', name: 'Mirjalol', role: 'director', phone: '+998901234567', email: 'mirjalol@educenter.uz' } },
  { phone: '+998901234568', password: 'cto123', user: { id: '2', name: 'Xojiakbar', role: 'cto', phone: '+998901234568', email: 'xojiakbar@educenter.uz' } },
  { phone: '+998901234569', password: 'academic123', user: { id: '3', name: 'Sodiqjon', role: 'academic_director', phone: '+998901234569', email: 'sodiqjon@educenter.uz' } },
  { phone: '+998901234570', password: 'marketing123', user: { id: '4', name: 'Sherzod', role: 'marketing_manager', phone: '+998901234570', email: 'sherzod@educenter.uz' } },
  { phone: '+998901234571', password: 'admin123', user: { id: '5', name: 'Sarvinoz', role: 'administrator', phone: '+998901234571', email: 'sarvinoz@educenter.uz' } },
]

const initialBudgetRequests: BudgetRequest[] = []


const initialEmployees: Employee[] = []

const initialSupportTickets: SupportTicket[] = [
  { id: '1', userId: '5', userName: 'Sarvinoz', title: "Printer ishlamayapti", description: "Ofis printerida qog'oz tiqilib qoldi", status: 'pending', attachments: [], createdAt: new Date().toISOString() },
  { id: '2', userId: '3', userName: 'Sodiqjon', title: "Proyektor nuri yoq", description: "2-xona proyektorida rasm kormayapti", status: 'in_progress', attachments: [], createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
]

const initialNotifications: Notification[] = [
  { id: '1', type: 'budget', title: "Byudjet so'rovi", message: "Sherzod 500,000 so'm so'radi", read: false, createdAt: new Date().toISOString(), link: '/dashboard/budget' },
  { id: '2', type: 'support', title: 'Yangi muammo', message: "Sarvinoz yangi muammo yaratdi", read: false, createdAt: new Date().toISOString(), link: '/dashboard/support' },
  { id: '3', type: 'reminder', title: 'Eslatma', message: "Bugun leadlar bilan ishlang", read: true, createdAt: new Date().toISOString() },
]

export const useStore = create<AppState>()(

  persist(
    (set, get) => ({
      // 🔥 HYDRATION
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),
      // Auth
      user: null,
      isAuthenticated: false,

      // 🔥 SHU QATORNI QO‘SH
      setUser: (user: User) => set({ user, isAuthenticated: true }),

      login: (phone: string, password: string) => {
        const found = demoUsers.find(u => u.phone === phone && u.password === password)
        if (found) {
          set({ user: found.user, isAuthenticated: true })
          get().restoreCheckInState()
          return true
        }
        return false
      },
      fetchTasks: async () => {
        const supabase = createClient()

        const { data } = await supabase
          .from('tasks')
          .select('*')

        set({ tasks: data || [] })
      },
      subscribeEmployees: () => {
        const supabase = createClient()

        const channel = supabase
          .channel('profiles')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'profiles' },
            () => {
              get().fetchEmployees() // 🔥 auto refresh
            }
          )
          .subscribe()

        return () => {
          supabase.removeChannel(channel)
        }
      },
      getTodayTasks: () => {
        const today = new Date().toISOString().split('T')[0]

        return get().tasks.filter(t => {
          if (!t.deadline) return false

          const taskDate = new Date(t.deadline).toISOString().split('T')[0]

          return taskDate === today && t.status !== 'completed'
        })
      },
      checkTaskNotifications: () => {
        const { tasks, addNotification, notifications, user } = get()

        const now = Date.now()

        tasks.forEach(task => {
          if (!task.deadline) return
          if (task.status === 'completed') return

          // 🔥 faqat o‘ziga tegishli task
          if (task.assigned_to !== user?.id) return

          const diff = new Date(task.deadline).getTime() - now

          const exists = notifications.find(n =>
            n.message.includes(task.title)
          )
          if (exists) return

          // ⚠️ deadline yaqin
          if (diff > 0 && diff < 1000 * 60 * 60 * 12) {
            addNotification({
              type: 'reminder',
              title: '⚠️ Deadline yaqin',
              message: `${task.title}`,
              link: '/dashboard/tasks'
            })
          }

          // ❌ kechikdi
          if (diff <= 0) {
            addNotification({
              type: 'task',
              title: '❌ Task kechikdi',
              message: `${task.title}`,
              link: '/dashboard/tasks'
            })
          }
        })
      },
      fetchEmployees: async () => {
        const supabase = createClient()

        const { data } = await supabase
          .from('profiles')
          .select('*')

        set({ employees: data || [] })
      },
      subscribeTasks: () => {
        const supabase = createClient()

        const channel = supabase
          .channel('tasks')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'tasks' },
            () => {
              get().fetchTasks()
            }
          )
          .subscribe()

        return () => {
          supabase.removeChannel(channel)
        }
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          // ❌ todayCheckIn ni o‘chirmaymiz
        })
      },
      updateUserProfile: (name, phone, email) => {
        const state = get()
        if (state.user) {
          set({
            user: { ...state.user, name, phone, email: email || state.user.email }
          })
        }
      },
      updateUserPassword: (oldPassword, newPassword) => {
        const state = get()
        if (!state.user) return false
        const userRecord = demoUsers.find(u => u.user.id === state.user?.id && u.password === oldPassword)
        if (userRecord) {
          userRecord.password = newPassword
          return true
        }
        return false
      },
      updateTaskNote: (id, note) => {
        set({
          tasks: get().tasks.map(t =>
            t.id === id ? { ...t, note } : t
          )
        })
      },
      // Settings
      language: 'uz',
      setLanguage: (lang) => set({ language: lang }),
      darkMode: false,
      toggleDarkMode: () => {
        const newDarkMode = !get().darkMode
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newDarkMode)
        }
        set({ darkMode: newDarkMode })
      },
      notificationsEnabled: true,
      toggleNotifications: () => set({ notificationsEnabled: !get().notificationsEnabled }),

      // Check-in
      todayCheckIn: null,
      allCheckIns: {},
      isCheckInLoaded: false,

      // 🔥 DELETE
      removeCheckIn: (id: string) => {
        const state = get()
        const updated = { ...state.allCheckIns }

        delete updated[id]

        set({
          allCheckIns: updated
        })
      },

      // 🔥 CHECK-IN
      checkIn: async (image?: string, caption?: string) => {
        const state = get()



        try {
          const res = await fetch('/api/checkin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              check_in_image: image || null,
              caption: caption || ''
            })
          })

          if (!res.ok) {
            const text = await res.text()
            console.error("SERVER ERROR:", text)

            if (text.includes('allaqachon')) {
              alert("⚠️ Siz bugun check-in qilgansiz")
            } else {
              alert("Server xatolik")
            }

            return
          }

          const data = await res.json()

          const checkInRecord = {
            userId: state.user?.id || '',
            userName: state.user?.name || '',
            date: data.date,
            checkInTime: data.checkInTime,
            checkOutTime: null,
            isLate: data.is_late,
            penalty: 0,
            checkInImage: data.check_in_image || image || '',
            caption: data.caption || caption || '',

          }

          const id = Date.now().toString()

          set({
            todayCheckIn: checkInRecord
          })
          await get().fetchCheckIns()
          localStorage.setItem(
            `educenter-checkin-${state.user?.id}`,
            JSON.stringify(checkInRecord)
          )

        } catch (err) {
          console.error("FETCH ERROR:", err)
          alert("Internet yoki API muammo")
        }
      },

      checkOut: () => {
        const state = get()
        const userId = state.user?.id

        if (!state.todayCheckIn || !userId) return

        const now = new Date()

        const checkOutTime = now.toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
        })

        const updatedCheckIn = {
          ...state.todayCheckIn,
          checkOutTime,
        }

        set({
          todayCheckIn: updatedCheckIn,
        })

        // 🔥 FAqat shu user uchun save
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            `educenter-checkin-${userId}`,
            JSON.stringify(updatedCheckIn)
          )
        }
      },

      addPenalty: (amount) => {

        const state = get()
        const id = Date.now().toString()

        if (state.todayCheckIn) {
          const updatedCheckIn = {
            ...state.todayCheckIn,
            penalty: state.todayCheckIn.penalty + amount,
          }
          set({
            todayCheckIn: updatedCheckIn,

            allCheckIns: {
              ...state.allCheckIns,
              [id]: updatedCheckIn
            }
          })
        }
      },
      getCheckInHistory: (userId, limit = 7) => {
        const checkIns = Object.values(get().allCheckIns)
          .filter(ci => ci.userId === userId) // 🔥 MUHIM

        return checkIns.slice(0, limit)
      },
      // test
      restoreCheckInState: async () => {
        const supabase = createClient()
        const { user } = get()

        if (!user) return

        // 🔥 BUGUNGI SANA (TOSHKENT)
        const today = new Date().toISOString().split('T')[0]

        const { data, error } = await supabase
          .from('check_ins')
          .select('*')
          .eq('user_id', user.id)
          .eq('check_in_date', today)
          .maybeSingle()

        if (error || !data) {
          set({
            todayCheckIn: null,
            isCheckInLoaded: true // 🔥 SHU MUHIM
          })
          return
        }

        const checkInRecord = {
          userId: data.user_id,
          userName: user.name,
          date: data.check_in_date,
          checkInTime: data.check_in_time,
          checkOutTime: data.check_out_time,
          isLate: data.is_late,
          penalty: data.penalty,
          checkInImage: data.check_in_image,
          caption: data.caption,
        }

        set({
          todayCheckIn: checkInRecord,
          isCheckInLoaded: true // 🔥 SHU MUHIM
        })
      },
      fetchCheckIns: async () => {
        const supabase = createClient()

        const { data } = await supabase
          .from('check_ins')
          .select('*')
          .order('check_in_time', { ascending: false })
        console.log("CHECKINS:", data)
        if (!data) return

        const mapped: any = {}

        data.forEach((item: any) => {
          mapped[item.id] = {
            userId: item.user_id,
            userName: item.user_name || item.profiles?.name || 'No name',
            date: item.check_in_date,
            checkInTime: item.check_in_time,
            checkOutTime: item.check_out_time,
            isLate: item.is_late,
            penalty: item.penalty || 0,
            checkInImage: item.check_in_image,
            caption: item.caption,
          }
        })

        set({ allCheckIns: mapped })
      },
      // Tasks
      tasks: [],
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        set({ tasks: [...get().tasks, newTask] })
      },
      updateTaskStatus: (id, status) => {
        set({
          tasks: get().tasks.map(t => t.id === id ? { ...t, status } : t)
        })
      },
      deleteTask: (id) => {
        set({ tasks: get().tasks.filter(t => t.id !== id) })
      },

      // Budget
      monthlyBudget: 1200000,
      budgetSpent: 200000,
      budgetRequests: initialBudgetRequests,
      managerBudgets: {},
      requestBudget: (amount, note, type) => {
        const state = get()
        if (!state.user) return

        // 🔥 LIMIT: 600k
        if (amount > 600000) {
          alert("❌ 600,000 so'mdan oshiq so‘rash mumkin emas")
          return
        }

        const current = state.managerBudgets[state.user.id] || {
          education: 600000,
          personal: 600000,
        }

        // 🔥 BALANCE CHECK
        if (type === 'education' && amount > current.education) {
          alert("❌ O‘quv markaz budget yetarli emas")
          return
        }

        if (type === 'personal' && amount > current.personal) {
          alert("❌ Shaxsiy budget yetarli emas")
          return
        }

        // 🔥 agar yo‘q bo‘lsa yaratamiz
        if (!state.managerBudgets[state.user.id]) {
          state.managerBudgets[state.user.id] = current
        }

        const request: BudgetRequest = {
          id: Date.now().toString(),
          userId: state.user.id,
          userName: state.user.name,
          type,
          amount,
          note,
          status: 'pending' as const,
          approvals: [],
          createdAt: new Date().toISOString(),
        }

        set({
          budgetRequests: [request, ...state.budgetRequests],
        })
      },
      reviewBudgetRequest: (id, approved, reviewerId, role) => {
        const state = get()

        const updated = state.budgetRequests.map(r => {
          if (r.id !== id) return r

          // ❌ reject
          if (!approved) {
            return { ...r, status: 'rejected' as const }
          }

          // 🔥 duplicate bo‘lmasin
          const approvals = r.approvals.includes(role)
            ? r.approvals
            : [...r.approvals, role]

          // 🔥 BITTA BOSILSA HAM YETARLI
          const isApproved = approvals.length > 0
          if (isApproved) {
            const current = state.managerBudgets[r.userId] || {
              education: 600000,
              personal: 600000,
            }

            const updatedBudget =
              r.type === 'education'
                ? {
                  ...current,
                  education: current.education - r.amount,
                }
                : {
                  ...current,
                  personal: current.personal - r.amount,
                }

            return {
              ...r,
              status: 'approved' as const,
              approvals,
              _updatedBudget: updatedBudget, // vaqtincha saqlaymiz
            }
          }

          return {
            ...r,
            approvals,
            status: 'pending' as const,
          }
        })

        const newBudgets = { ...state.managerBudgets }

        updated.forEach(r => {
          if ((r as any)._updatedBudget) {
            newBudgets[r.userId] = (r as any)._updatedBudget
          }
        })

        set({
          budgetRequests: updated,
          managerBudgets: newBudgets,
        })
      },

      // Support
      supportTickets: initialSupportTickets,
      createTicket: (title, description, attachments) => {
        const state = get()
        if (!state.user) return
        const ticket: SupportTicket = {
          id: Date.now().toString(),
          userId: state.user.id,
          userName: state.user.name,
          title,
          description,
          status: 'pending',
          attachments,
          createdAt: new Date().toISOString(),
        }
        set({ supportTickets: [...state.supportTickets, ticket] })
        get().addNotification({
          type: 'support',
          title: 'Yangi muammo',
          message: `${state.user.name} yangi muammo yaratdi: ${title}`,
          link: '/dashboard/support',
        })
      },
      updateTicketStatus: (id, status) => {
        set({
          supportTickets: get().supportTickets.map(t =>
            t.id === id
              ? { ...t, status, resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined }
              : t
          )
        })
      },

      // Notifications
      notifications: initialNotifications,
      addNotification: (notification) => {
        const state = get()

        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          read: false,
          createdAt: new Date().toISOString(),
          userId: state.user?.id // 🔥 HAR USERGA ALOHIDA
        }

        set({
          notifications: [newNotification, ...state.notifications]
        })
      },
      markAsRead: (id) => {
        set({
          notifications: get().notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          )
        })
      },
      markAllAsRead: () => {
        set({
          notifications: get().notifications.map(n => ({ ...n, read: true }))
        })
      },

      // Employees
      employees: initialEmployees,
      updateEmployeeKpi: (id: string, kpiType: string, value: number) => {
        set({
          employees: get().employees.map(e =>
            e.id === id
              ? {
                ...e,
                [`kpi${kpiType.charAt(0).toUpperCase() + kpiType.slice(1)}`]: value,
              }
              : e
          )
        })
      },
      addEmployee: (emp) => {
        const state = get()

        // 🔒 faqat director yoki cto
        if (state.user?.role !== 'director' && state.user?.role !== 'cto') {
          alert("Sizda ruxsat yo‘q")
          return
        }

        const newEmployee = {
          ...emp,
          id: Date.now().toString(),
          penalties: 0,
          bonuses: 0,
        }

        set({
          employees: [...state.employees, newEmployee]
        })
      },
      updateEmployeePercent: (id, percent) => {
        set({
          employees: get().employees.map(e =>
            e.id === id
              ? { ...e, percent: Math.min(45, Math.max(30, percent)) }
              : e
          )
        })
      },


      updateEmployeeBonus: (id, amount) => {
        set({
          employees: get().employees.map(e =>
            e.id === id ? { ...e, bonuses: e.bonuses + amount } : e
          )
        })
      },
      updateEmployeePerformance: (
        id: string,
        tasksCompleted: number,
        tasksPending: number,
        lateCheckIns: number
      ) => {
        set({
          employees: get().employees.map(e =>
            e.id === id
              ? { ...e, tasksCompleted, tasksPending, lateCheckIns }
              : e
          )
        })
      },
      calculateEmployeePerformance: (id) => {
        const employee = get().employees.find(e => e.id === id)
        if (!employee) return { performance: 0, status: 'poor' as const }

        // Task completion rate
        const totalTasks =
          (employee.tasksCompleted || 0) +
          (employee.tasksPending || 0)
        const completionRate =
          totalTasks > 0
            ? ((employee.tasksCompleted || 0) / totalTasks) * 100
            : 0
        // Average KPI score
        const avgKpi =
          ((employee.kpiDaily || 0) +
            (employee.kpiWeekly || 0) +
            (employee.kpiMonthly || 0)) / 3
        // Performance calculation: 60% task completion, 40% KPI
        const performance = (completionRate * 0.6) + (avgKpi * 0.4)

        // Determine status
        let status: 'excellent' | 'average' | 'poor'
        if (performance >= 80) status = 'excellent'
        else if (performance >= 50) status = 'average'
        else status = 'poor'

        return { performance: Math.round(performance), status }
      },
      getEmployeePerformanceData: () => {
        const employees = get().employees
        return employees.map(emp => {
          const perfData = get().calculateEmployeePerformance(emp.id)
          return {
            ...emp,
            performancePercentage: perfData.performance,
            performanceStatus: perfData.status,
          }
        })
      },
      getEmployeeAttendance: (id) => {
        const state = get()
        const allCheckIns = Object.values(state.allCheckIns).filter(ci => {
          // In real app, would filter by user ID. Here we calculate for current user
          return true
        })

        const totalDays = Math.max(allCheckIns.length, 20) // Assume 20 working days/month
        const lateDays = allCheckIns.filter(ci => ci.isLate).length
        const onTimeDays = totalDays - lateDays
        const attendanceRate = Math.round((onTimeDays / totalDays) * 100)

        return {
          totalDays,
          lateDays,
          onTimeDays,
          attendanceRate,
        }
      },
    }),
    {
      name: 'educenter-storage',
      partialize: (state) => ({
        language: state.language,
        darkMode: state.darkMode,
        notificationsEnabled: state.notificationsEnabled,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        todayCheckIn: state.todayCheckIn,
        // allCheckIns: state.allCheckIns,

        // 🔥 SHULARNI QO‘SH
        budgetRequests: state.budgetRequests,
        managerBudgets: state.managerBudgets,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()

        // 🔥 ENG MUHIM
        state?.fetchCheckIns()
      },
    }
  )
)

// Initialize dark mode on client
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('educenter-storage')
  if (stored) {
    try {
      const { state } = JSON.parse(stored)
      if (state?.darkMode) {
        document.documentElement.classList.add('dark')
      }
    } catch {
      // ignore
    }
  }
}
