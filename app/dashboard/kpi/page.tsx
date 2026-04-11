'use client'

import { useStore } from '@/lib/store'
import { useTranslations } from '@/hooks/use-translations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Users,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from 'recharts'

export default function KPIPage() {
  const t = useTranslations()
  const { employees, user } = useStore()

  const isDirectorOrCTO = user?.role === 'director' || user?.role === 'cto'

  // For non-director roles, only show their own KPI
  const currentEmployee = employees.find(e => e.id === user?.id)

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      director: t.director,
      cto: t.cto,
      academic_manager: t.academicManager,
      marketing_manager: t.marketingManager,
      administrator: t.administrator,
    }
    return roles[role] || role
  }

  const getKpiColor = (kpi: number) => {
    if (kpi >= 90) return 'text-success'
    if (kpi >= 70) return 'text-warning'
    return 'text-destructive'
  }

  const getKpiBadgeColor = (kpi: number) => {
    if (kpi >= 90) return 'bg-success/10 text-success border-success/20'
    if (kpi >= 70) return 'bg-warning/10 text-warning border-warning/20'
    return 'bg-destructive/10 text-destructive border-destructive/20'
  }

  const averageKpi = Math.round(employees.reduce((acc, emp) => acc + emp.kpiMonthly, 0) / employees.length)

  const kpiChartData = employees.map(emp => ({
    name: emp.name,
    daily: emp.kpiDaily,
    weekly: emp.kpiWeekly,
    monthly: emp.kpiMonthly,
  }))

  const radialData = employees.map((emp, index) => ({
    name: emp.name,
    kpi: emp.kpiMonthly,
    fill: `hsl(var(--chart-${(index % 5) + 1}))`,
  }))

  if (!isDirectorOrCTO && currentEmployee) {
    // Individual KPI view
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.kpi}</h1>
          <p className="text-muted-foreground">Sizning samaradorlik ko&apos;rsatkichlaringiz</p>
        </div>

        {/* Personal KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="rounded-2xl border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">{t.dailyKpi}</span>
                {currentEmployee.kpiDaily >= 80 ? (
                  <TrendingUp className="w-5 h-5 text-success" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-destructive" />
                )}
              </div>
              <p className={`text-4xl font-bold ${getKpiColor(currentEmployee.kpiDaily)}`}>
                {currentEmployee.kpiDaily}%
              </p>
              <Progress value={currentEmployee.kpiDaily} className="h-2 mt-3" />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">{t.weeklyKpi}</span>
                {currentEmployee.kpiWeekly >= 80 ? (
                  <TrendingUp className="w-5 h-5 text-success" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-destructive" />
                )}
              </div>
              <p className={`text-4xl font-bold ${getKpiColor(currentEmployee.kpiWeekly)}`}>
                {currentEmployee.kpiWeekly}%
              </p>
              <Progress value={currentEmployee.kpiWeekly} className="h-2 mt-3" />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">{t.monthlyKpi}</span>
                {currentEmployee.kpiMonthly >= 80 ? (
                  <TrendingUp className="w-5 h-5 text-success" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-destructive" />
                )}
              </div>
              <p className={`text-4xl font-bold ${getKpiColor(currentEmployee.kpiMonthly)}`}>
                {currentEmployee.kpiMonthly}%
              </p>
              <Progress value={currentEmployee.kpiMonthly} className="h-2 mt-3" />
            </CardContent>
          </Card>
        </div>

        {/* KPI Details */}
        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle>KPI tafsilotlari</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">Vazifalar bajarilishi</span>
                </div>
                <Badge className={getKpiBadgeColor(currentEmployee.kpiDaily)}>
                  {currentEmployee.kpiDaily}%
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium text-foreground">{"O'z vaqtida kelish"}</span>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">95%</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <span className="font-medium text-foreground">Umumiy samaradorlik</span>
                </div>
                <Badge className={getKpiBadgeColor(currentEmployee.kpiMonthly)}>
                  {currentEmployee.kpiMonthly}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Director/CTO view - all employees
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.kpi}</h1>
        <p className="text-muted-foreground">Barcha xodimlarning samaradorlik ko&apos;rsatkichlari</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="rounded-2xl border">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{averageKpi}%</p>
                <p className="text-sm text-muted-foreground">{"O'rtacha KPI"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {employees.filter(e => e.kpiMonthly >= 90).length}
                </p>
                <p className="text-sm text-muted-foreground">{"A'lo darajada"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {employees.filter(e => e.kpiMonthly >= 70 && e.kpiMonthly < 90).length}
                </p>
                <p className="text-sm text-muted-foreground">Yaxshi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {employees.filter(e => e.kpiMonthly < 70).length}
                </p>
                <p className="text-sm text-muted-foreground">Diqqat talab</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle>Xodimlar KPI taqqoslash</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-muted-foreground" fontSize={12} />
                  <YAxis className="text-muted-foreground" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="daily" fill="hsl(var(--chart-1))" name="Kunlik" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="weekly" fill="hsl(var(--chart-2))" name="Haftalik" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="monthly" fill="hsl(var(--chart-3))" name="Oylik" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Radial Chart */}
        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle>Oylik KPI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="90%"
                  data={radialData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    background
                    dataKey="kpi"
                    cornerRadius={6}
                  />
                  <Legend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'KPI']}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee KPI List */}
      <Card className="rounded-2xl border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Xodimlar samaradorligi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {employees.map((employee) => (
            <div key={employee.id} className="p-4 bg-secondary/50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-foreground">
                      {employee.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{getRoleName(employee.role)}</p>
                  </div>
                </div>
                <Badge className={getKpiBadgeColor(employee.kpiMonthly)}>
                  {employee.kpiMonthly}%
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t.dailyKpi}</p>
                  <Progress value={employee.kpiDaily} className="h-2" />
                  <p className="text-xs text-foreground mt-1">{employee.kpiDaily}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t.weeklyKpi}</p>
                  <Progress value={employee.kpiWeekly} className="h-2" />
                  <p className="text-xs text-foreground mt-1">{employee.kpiWeekly}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t.monthlyKpi}</p>
                  <Progress value={employee.kpiMonthly} className="h-2" />
                  <p className="text-xs text-foreground mt-1">{employee.kpiMonthly}%</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
