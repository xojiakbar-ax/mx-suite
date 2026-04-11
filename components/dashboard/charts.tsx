'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Card } from '@/components/ui/card'

const COLORS = {
  light: {
    bars: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
    lines: ['#3b82f6', '#10b981', '#f59e0b'],
    pie: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'],
    grid: '#e5e7eb',
    axis: '#6b7280',
    tooltip: '#ffffff',
  },
  dark: {
    bars: ['#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f472b6'],
    lines: ['#60a5fa', '#34d399', '#fbbf24'],
    pie: ['#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#22d3ee'],
    grid: '#374151',
    axis: '#9ca3af',
    tooltip: '#1f2937',
  },
}

interface ChartProps {
  data: any[]
  title: string
  isDark?: boolean
  type?: 'bar' | 'line' | 'pie'
  dataKeys?: string[]
}

export function PerformanceChart({ data, title, isDark = false, dataKeys = ['value'] }: ChartProps) {
  const colors = isDark ? COLORS.dark : COLORS.light

  return (
    <Card className="p-6 shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-foreground">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis stroke={colors.axis} />
          <YAxis stroke={colors.axis} />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltip,
              border: `1px solid ${colors.grid}`,
              borderRadius: '8px',
            }}
          />
          <Legend />
          {dataKeys.map((key, idx) => (
            <Bar key={key} dataKey={key} fill={colors.bars[idx % colors.bars.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export function KPITrendChart({ data, title, isDark = false }: ChartProps) {
  const colors = isDark ? COLORS.dark : COLORS.light

  return (
    <Card className="p-6 shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-foreground">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis stroke={colors.axis} />
          <YAxis stroke={colors.axis} />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltip,
              border: `1px solid ${colors.grid}`,
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="kpi" stroke={colors.lines[0]} strokeWidth={2} dot={{ fill: colors.lines[0] }} />
          <Line type="monotone" dataKey="target" stroke={colors.lines[1]} strokeWidth={2} dot={{ fill: colors.lines[1] }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

export function BudgetDistributionChart({ data, title, isDark = false }: ChartProps) {
  const colors = isDark ? COLORS.dark : COLORS.light

  return (
    <Card className="p-6 shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-foreground">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors.pie[index % colors.pie.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltip,
              border: `1px solid ${colors.grid}`,
              borderRadius: '8px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}

export function CustomChart({ data, title, isDark = false, type = 'bar', dataKeys = ['value'] }: ChartProps) {
  switch (type) {
    case 'line':
      return <KPITrendChart data={data} title={title} isDark={isDark} />
    case 'pie':
      return <BudgetDistributionChart data={data} title={title} isDark={isDark} />
    case 'bar':
    default:
      return <PerformanceChart data={data} title={title} isDark={isDark} dataKeys={dataKeys} />
  }
}
