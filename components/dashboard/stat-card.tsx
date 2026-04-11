'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  iconBg?: string
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconBg = 'bg-primary/10',
  className,
}: StatCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <div className={cn(
      'bg-card rounded-2xl p-5 border border-border',
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconBg)}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg',
            isPositive && 'bg-success/10 text-success',
            isNegative && 'bg-destructive/10 text-destructive',
            !isPositive && !isNegative && 'bg-muted text-muted-foreground'
          )}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : isNegative ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
        {changeLabel && (
          <p className="text-xs text-muted-foreground mt-1">{changeLabel}</p>
        )}
      </div>
    </div>
  )
}
