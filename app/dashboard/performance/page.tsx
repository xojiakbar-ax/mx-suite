'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useTranslations } from '@/hooks/use-translations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserProfile } from '@/hooks/use-user-profile'

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, Users, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmployeeDetail {
  id: string
  name: string
  role: string
  performance: number
  status: 'excellent' | 'average' | 'poor'
  kpiMonthly: number
  tasksCompleted: number
  tasksPending: number
  lateCheckIns: number
}

export default function PerformanceAnalyticsPage() {
  const t = useTranslations()
  const { user, employees, getEmployeePerformanceData, getEmployeeAttendance, tasks } = useStore()
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetail | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { profile } = useUserProfile()

  if (!profile) return null

  // Only show for Director and CTO
  if (!['director', 'cto'].includes(profile.role)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8">
          <p className="text-muted-foreground">
            Bu sahifa faqat direktori va CTO uchun
          </p>
        </Card>
      </div>
    )
  }

  const performanceData = getEmployeePerformanceData()
  const filteredEmployees = performanceData.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate statistics
  const avgPerformance = Math.round(performanceData.reduce((sum, e) => sum + (e.performancePercentage || 0), 0) / performanceData.length)
  const excellentCount = performanceData.filter(e => e.performanceStatus === 'excellent').length
  const averageCount = performanceData.filter(e => e.performanceStatus === 'average').length
  const poorCount = performanceData.filter(e => e.performanceStatus === 'poor').length

  // Chart data
  const performanceChartData = filteredEmployees.map(emp => ({
    name: emp.name.split(' ')[0],
    performance: emp.performancePercentage || 0,
    kpi: emp.kpiMonthly,
  }))

  const statusDistribution = [
    { name: "Zo'r ishlayapti", value: excellentCount, color: '#10b981' },
    { name: "O'rtacha", value: averageCount, color: '#f59e0b' },
    { name: 'Sust ishlayapti', value: poorCount, color: '#ef4444' },
  ]

  const kpiTrendData = [
    { week: '1-hafta', performance: 82 },
    { week: '2-hafta', performance: 85 },
    { week: '3-hafta', performance: 83 },
    { week: '4-hafta', performance: avgPerformance },
  ]

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
      case 'average':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
      case 'poor':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'excellent':
        return "Zo'r ishlayapti"
      case 'average':
        return "O'rtacha"
      case 'poor':
        return 'Sust ishlayapti'
      default:
        return 'Noma\'lum'
    }
  }

  const handleEmployeeClick = (emp: typeof performanceData[0]) => {
    setSelectedEmployee({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      performance: emp.performancePercentage || 0,
      status: emp.performanceStatus || 'average',
      kpiMonthly: emp.kpiMonthly,
      tasksCompleted: emp.tasksCompleted,
      tasksPending: emp.tasksPending,
      lateCheckIns: emp.lateCheckIns,
    })
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Xodimlar samaradorligi</h1>
        <p className="text-muted-foreground mt-2">Haqiqiy vaqt tahlili va ishlari kuzatish</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-primary/10 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Umumiy samaradorlik</p>
                <p className="text-3xl font-bold text-foreground">{avgPerformance}%</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-green-500/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Zo&apos;r ishlayapti</p>
                <p className="text-3xl font-bold text-green-600">{excellentCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-yellow-500/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">O&apos;rtacha</p>
                <p className="text-3xl font-bold text-yellow-600">{averageCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-red-500/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sust ishlayapti</p>
                <p className="text-3xl font-bold text-red-600">{poorCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Bar Chart */}
        <Card className="border border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Xodimlar samaradorligi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs text-muted-foreground" />
                <YAxis className="text-xs text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="performance" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Samaradorlik %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card className="border border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Xodimlar holati</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* KPI Trend Chart */}
      <Card className="border border-primary/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Samaradorlik tendensiyasi</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={kpiTrendData}>
              <defs>
                <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="week" className="text-xs text-muted-foreground" />
              <YAxis className="text-xs text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="performance"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorPerf)"
                name="Samaradorlik %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Employee Performance Table */}
      <Card className="border border-primary/10 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Xodimlar jadval</CardTitle>
            <Input
              placeholder="Xodimni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Ism</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Lavozim</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">KPI %</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Samaradorlik %</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Holat</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Vazifalar</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Kechikishlar</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="py-4 px-4 text-sm font-medium text-foreground">{emp.name}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{emp.role}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm font-semibold text-foreground">{emp.kpiMonthly}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm font-bold text-foreground">{emp.performancePercentage}%</span>
                        {(emp.performancePercentage || 0) >= 80 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge className={cn('border', getStatusColor(emp.performanceStatus))}>
                        {getStatusLabel(emp.performanceStatus)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-foreground">
                      <span className="bg-primary/10 px-2 py-1 rounded text-xs font-semibold">
                        {emp.tasksCompleted}/{emp.tasksCompleted + emp.tasksPending}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={cn('text-sm font-semibold px-2 py-1 rounded', emp.lateCheckIns > 0 ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600')}>
                        {emp.lateCheckIns}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-left">
                      <Button
                        onClick={() => handleEmployeeClick(emp)}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Tafsilot
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Employee Detail Modal - Simple approach */}
      {selectedEmployee && (
        <Card className="border border-primary/10 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{selectedEmployee.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{selectedEmployee.role}</p>
              </div>
              <Button
                onClick={() => setSelectedEmployee(null)}
                variant="outline"
                size="sm"
              >
                Yopish
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <p className="text-xs text-muted-foreground mb-2">Umumiy samaradorlik</p>
                <p className="text-3xl font-bold text-foreground">{selectedEmployee.performance}%</p>
                <Badge className={cn('mt-3 border', getStatusColor(selectedEmployee.status))}>
                  {getStatusLabel(selectedEmployee.status)}
                </Badge>
              </div>
              <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/10">
                <p className="text-xs text-muted-foreground mb-2">Oylik KPI</p>
                <p className="text-3xl font-bold text-foreground">{selectedEmployee.kpiMonthly}%</p>
              </div>
              <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
                <p className="text-xs text-muted-foreground mb-2">Vazifa bajarish</p>
                <p className="text-3xl font-bold text-foreground">
                  {selectedEmployee.tasksCompleted}/{selectedEmployee.tasksCompleted + selectedEmployee.tasksPending}
                </p>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-secondary/50 rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-3">Vazifalar</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tugallandi:</span>
                    <span className="font-semibold text-green-600">{selectedEmployee.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kutilyapti:</span>
                    <span className="font-semibold text-yellow-600">{selectedEmployee.tasksPending}</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-3">Davom-asosiy</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kechikishlar:</span>
                    <span className={cn('font-semibold', selectedEmployee.lateCheckIns > 0 ? 'text-red-600' : 'text-green-600')}>
                      {selectedEmployee.lateCheckIns}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
