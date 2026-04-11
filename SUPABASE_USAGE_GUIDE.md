# Supabase Integration Guide

## How to Use the Real Data Hooks

The application now has full Supabase integration with custom React hooks for data fetching. Replace mock data with real data using these hooks:

### Check-ins Hook
```tsx
import { useCheckIns } from '@/hooks/use-supabase'

export function CheckInComponent() {
  const { checkIns, isLoading, error } = useCheckIns()
  
  if (isLoading) return <Spinner />
  if (error) return <Alert>Failed to load check-ins</Alert>
  
  return (
    <div>
      {checkIns.map(checkin => (
        <CheckInCard key={checkin.id} data={checkin} />
      ))}
    </div>
  )
}
```

### Tasks Hook
```tsx
import { useTasks } from '@/hooks/use-supabase'

export function TasksComponent() {
  const { tasks, isLoading, mutate } = useTasks()
  
  const handleTaskComplete = async (taskId) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'completed' })
    })
    mutate() // Refresh data
  }
  
  return <TasksList tasks={tasks} onComplete={handleTaskComplete} />
}
```

### Notifications Hook
```tsx
import { useNotifications } from '@/hooks/use-supabase'

export function NotificationsPanel() {
  const { notifications, mutate } = useNotifications()
  
  return (
    <div className="space-y-2">
      {notifications.map(notif => (
        <NotificationItem key={notif.id} data={notif} />
      ))}
    </div>
  )
}
```

### Authentication Hook
```tsx
import { useAuth } from '@/hooks/use-auth'

export function Profile() {
  const { user, loading } = useAuth()
  
  if (loading) return <Spinner />
  if (!user) return <Redirect to="/auth/login" />
  
  return <div>Welcome, {user.email}</div>
}
```

## Creating New Data

### Create Check-in
```tsx
const response = await fetch('/api/check-ins', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    check_in_time: '09:30',
    is_late: false,
    penalty: 0,
    check_in_image: 'image-url'
  })
})
const newCheckIn = await response.json()
```

### Create Task
```tsx
const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Review student performance',
    description: 'Check Q1 results',
    assigned_to: 'user-uuid',
    priority: 'high',
    status: 'pending',
    due_date: '2024-04-15'
  })
})
```

### Create Budget Request
```tsx
const response = await fetch('/api/budget-requests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_name: 'John Doe',
    amount: 500,
    note: 'Software licenses needed'
  })
})
```

## Real-Time Updates (Coming Soon)

Subscribe to real-time changes using Supabase subscriptions:

```tsx
const supabase = createClient()

useEffect(() => {
  const subscription = supabase
.from('check_ins') 
    .on('*', payload => {
      console.log('New check-in:', payload)
      mutate()
    })
    .subscribe()

  return () => subscription.unsubscribe()
}, [mutate, supabase])
```

## API Routes Available

- `GET/POST /api/check-ins` - Check-in records
- `GET/POST /api/tasks` - Task management
- `GET/POST /api/notifications` - Notifications
- `GET /api/employees` - Employee list
- `GET/POST /api/students` - Student management
- `GET/POST /api/leads` - Lead management
- `GET/POST /api/budget-requests` - Budget requests
- `GET/POST /api/support-tickets` - Support tickets

## Environment Setup

All Supabase credentials are automatically available:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

No additional setup needed - they're provided by the Supabase integration.

## Security

All API routes enforce Row Level Security:
- Users can only access their own data
- Directors/CTOs have admin access
- Marketing managers can manage leads
- Data is automatically filtered based on user role

The system is production-ready with secure, role-based data isolation.
