'use client'

import { useStore } from '@/lib/store'
import { useTranslations } from '@/hooks/use-translations'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { uz, enUS } from 'date-fns/locale'
import Link from 'next/link'

export function NotificationsPanel() {
  const notifications = useStore((state) => state.notifications)
  const markAsRead = useStore((state) => state.markAsRead)
  const markAllAsRead = useStore((state) => state.markAllAsRead)
  const language = useStore((state) => state.language)
  const t = useTranslations()

  const unreadCount = notifications.filter((n) => !n.read).length
  const locale = language === 'uz' ? uz : enUS

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'checkin':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'budget':
        return <AlertCircle className="w-5 h-5 text-amber-500" />
      case 'support':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'task':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'checkin':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
      case 'budget':
        return 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
      case 'support':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
      case 'task':
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
      default:
        return 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800'
    }
  }

  return (
    <div className="w-full md:w-96 bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-primary" />
            <div>
              <h2 className="font-bold text-foreground">{t.notifications}</h2>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">{unreadCount} {t.common?.new || 'yangi'}</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              {t.common?.markAllAsRead || "Hammasini o'qilgan deb belgilash"}
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-96">
        <div className="divide-y divide-border">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">{t.common?.noNotifications || 'Bildirishnomalar yo\'q'}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 cursor-pointer transition-colors border-l-4 ${
                  notification.read ? 'bg-background' : 'bg-primary/5'
                } ${getNotificationColor(notification.type)}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 mt-1.5 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </div>

                    {/* Check-in Image */}
                    {notification.image && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-border">
                        <img
                          src={notification.image}
                          alt="Check-in"
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale,
                      })}
                    </p>

                    {notification.link && (
                      <Link href={notification.link}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                        >
                          {t.common?.viewDetails || 'Tafsilotlarni ko\'rish'}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-border bg-secondary/30">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="w-full">
              {t.common?.viewAll || 'Hammasini ko\'rish'}
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
