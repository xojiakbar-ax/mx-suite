'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useTranslations } from '@/hooks/use-translations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  Phone,
  TrendingUp,
  Wallet,
  Users,
} from 'lucide-react'

export default function EmployeesPage() {
  const t = useTranslations()
  const { employees } = useStore()
  const [searchQuery, setSearchQuery] = useState('')

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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'director': return 'bg-primary/10 text-primary border-primary/20'
      case 'cto': return 'bg-accent/10 text-accent border-accent/20'
      case 'academic_manager': return 'bg-success/10 text-success border-success/20'
      case 'marketing_manager': return 'bg-warning/10 text-warning border-warning/20'
      case 'administrator': return 'bg-chart-2/10 text-chart-2 border-chart-2/20'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.phone.includes(searchQuery)
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm"
  }

  const calculateTotalSalary = (emp: typeof employees[0]) => {
    const kpiBonus = (emp.baseSalary * (emp.kpiMonthly / 100) * 0.2)
    return emp.baseSalary + emp.bonuses - emp.penalties + kpiBonus
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.employees}</h1>
          <p className="text-muted-foreground">Barcha xodimlar ro&apos;yxati</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t.search + '...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{employees.length}</p>
                <p className="text-sm text-muted-foreground">Jami xodimlar</p>
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
                  {Math.round(employees.reduce((acc, emp) => acc + emp.kpiMonthly, 0) / employees.length)}%
                </p>
                <p className="text-sm text-muted-foreground">{"O'rtacha KPI"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(employees.reduce((acc, emp) => acc + calculateTotalSalary(emp), 0))}
                </p>
                <p className="text-sm text-muted-foreground">Jami maosh</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employees Table */}
      <Card className="rounded-2xl border">
        <CardHeader>
          <CardTitle>Xodimlar ro&apos;yxati</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Xodim</TableHead>
                  <TableHead>Lavozim</TableHead>
                  <TableHead>KPI</TableHead>
                  <TableHead>Maosh</TableHead>
                  <TableHead className="text-right">Jami</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-foreground">
                            {employee.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{employee.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {employee.phone}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleBadgeColor(employee.role)}>
                        {getRoleName(employee.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 w-32">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Oylik</span>
                          <span className="font-medium text-foreground">{employee.kpiMonthly}%</span>
                        </div>
                        <Progress value={employee.kpiMonthly} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <p className="text-foreground">{formatCurrency(employee.baseSalary)}</p>
                        <div className="flex items-center gap-2">
                          {employee.bonuses > 0 && (
                            <span className="text-success">+{formatCurrency(employee.bonuses)}</span>
                          )}
                          {employee.penalties > 0 && (
                            <span className="text-destructive">-{formatCurrency(employee.penalties)}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(calculateTotalSalary(employee))}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
