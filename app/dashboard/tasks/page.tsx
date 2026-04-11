'use client'

import { useStore } from '@/lib/store'
import {
  Card, CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import {
  Plus, Trash2, Lock
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TasksPage() {
  const { addTask, updateTaskStatus, deleteTask, user, updateTaskNote } = useStore()
  if (!user || !user.role) return null
  const supabase = createClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)


  const { tasks, fetchTasks, subscribeTasks } = useStore()
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    deadline: '',
    priority: 'medium',
    isKPI: false
  })

  // ================= ROLE =================
  const isBoss = ['director', 'cto'].includes(user?.role || '')
  type Employee = {
    id: string
    name?: string
    email?: string
    role?: string
  }

  const [employees, setEmployees] = useState<Employee[]>([])
  const fetchEmployees = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')

    setEmployees(data || [])
  }
  // ================= FETCH =================



  useEffect(() => {
    if (!user?.role) return

    fetchTasks()

    if (isBoss) {
      fetchEmployees()
    }

  }, [user?.role])
  useEffect(() => {
    if (
      (user?.role === 'director' || user?.role === 'cto') &&
      user?.id &&
      !newTask.assignedTo
    ) {
      setNewTask(prev => ({
        ...prev,
        assignedTo: user.id
      }))
    }
  }, [user])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])
  const visibleTasks = tasks.filter(task => {
    if (isBoss) return true
    return task.assigned_to === user?.id
  })
  const total = visibleTasks.length

  const completed = visibleTasks.filter(
    t => t.status === 'completed'
  ).length

  const progress = total
    ? Math.round((completed / total) * 100)
    : 0


  const canSeeKPI = progress >= 90

  // ================= CREATE =================
  const handleAddTask = async () => {
    if (!newTask.title) return
    const assigned =
      isBoss
        ? (newTask.assignedTo || user?.id)
        : user?.id

    if (!assigned) {
      alert('User topilmadi')
      return
    }

    // 🔥 EDIT MODE
    if (editingId) {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: newTask.title,
          description: newTask.description,
          assigned_to: assigned,
          deadline: newTask.deadline,
          is_locked: newTask.isKPI
        })
        .eq('id', editingId)

      if (error) {
        alert(error.message)
        return
      }

      setEditingId(null)
    }
    // 🔥 CREATE MODE
    else {
      const { error } = await supabase
        .from('tasks')
        .insert([
          {
            title: newTask.title,
            description: newTask.description,
            assigned_by: user?.id,
            status: 'pending',
            progress: 0,
            note: '',
            assigned_to: assigned,

            deadline:
              isBoss
                ? newTask.deadline
                : null,

            is_locked:
              isBoss
                ? newTask.isKPI
                : false,
          }
        ])

      if (error) {
        alert(error.message)
        return
      }
    }

    // 🔥 refresh
    await fetchTasks()

    // 🔥 close dialog
    setDialogOpen(false)

    // 🔥 reset form
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      deadline: '',
      priority: 'medium',
      isKPI: false
    })
  }

  const getTimeLeft = (deadline: string) => {
    if (!deadline) return null

    const diff = new Date(deadline).getTime() - now

    if (diff <= 0) return '❌ Kechikdi'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)

    if (days > 0) return `${days} kun ${hours} soat`
    if (hours > 0) return `${hours} soat ${minutes} min`

    return `${minutes} min`
  }

  // ================= UI =================
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Tasks</h1>
          <p className="text-sm text-gray-500">
            Vazifalarni boshqarish
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2">
              <Plus className="w-4 h-4" />
              Task qo‘shish
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi Task</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

              {/* TITLE */}
              <Input
                placeholder="Task nomi"
                value={newTask.title}
                onChange={e =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />

              {/* DESCRIPTION */}
              <Textarea
                placeholder="Izoh"
                value={newTask.description}
                onChange={e =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
              <Input
                type="date"
                value={newTask.deadline}
                onChange={e =>
                  setNewTask({ ...newTask, deadline: e.target.value })
                }
              />
              {/* 🔥 ONLY BOSS */}
              {isBoss && (
                <>
                  <Select
                    value={newTask.assignedTo}
                    onValueChange={(v) =>
                      setNewTask({ ...newTask, assignedTo: v })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Kimga beriladi" />
                    </SelectTrigger>

                    <SelectContent>

                      {/* O‘zim */}
                      {user?.id && (
                        <SelectItem value={user.id}>
                          🧑 O‘zimga
                        </SelectItem>
                      )}

                      {/* Managerlar */}
                      {employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>
                          👤 {emp.name || emp.email}
                        </SelectItem>
                      ))}

                    </SelectContent>
                  </Select>

                  <div className="flex gap-3 items-center">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newTask.isKPI}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            isKPI: e.target.checked
                          })
                        }
                      />
                      KPI
                    </label>
                  </div>
                </>
              )}

              {/* SAVE */}
              <Button
                onClick={handleAddTask}
                className="w-full rounded-xl"
              >
                Saqlash
              </Button>

            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* PROGRESS */}
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </CardContent>
      </Card>

      {/* TASKS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleTasks.map(task => {
          const isExpired = task.deadline
            ? new Date(task.deadline).getTime() < now
            : false
          const isLocked = task.is_locked && !canSeeKPI
          return (
            <Card
              key={task.id}
              className={`relative rounded-2xl overflow-hidden border transition-all duration-300
  hover:shadow-2xl hover:-translate-y-1
  ${isExpired
                  ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300'
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                }
`}
            >
              <CardContent className="p-4 space-y-3">
                {isLocked && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-2xl">
                    🔒 KPI Task (90% ga yetmaguncha yopiq)
                  </div>
                )}
                {/* HEADER */}
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{task.title}</h3>

                  <Badge
                    className={
                      task.status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : task.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-yellow-100 text-yellow-600'
                    }
                  >
                    {task.status}
                  </Badge>
                </div>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-500 line-clamp-2">
                  {task.description}
                </p>
                {isBoss && (
                  <div className="text-xs text-gray-400">
                    👤 {employees.find(e => e.id === task.assigned_to)?.email}
                  </div>
                )}
                {isBoss && (
                  <div className="text-xs text-gray-500">
                    📊 {task.progress || 0}% bajarilgan
                  </div>
                )}
                <Progress
                  value={task.progress || 0}
                  className={
                    (task.progress || 0) > 80
                      ? 'bg-green-500'
                      : (task.progress || 0) > 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }
                />
                {/* DEADLINE */}
                {task.deadline && (
                  <div
                    className={`flex justify-between items-center text-xs px-3 py-2 rounded-lg
      ${isExpired
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'}
    `}
                  >
                    <span className={
                      isExpired
                        ? 'text-red-600'
                        : ((task.progress || 0) < 50 ? 'text-yellow-600' : 'text-green-600')
                    }>
                      ⏳ {getTimeLeft(task.deadline)}
                    </span>
                    {(task.progress || 0) < 50 && !isExpired && (
                      <span className="text-red-500 animate-pulse text-xs">
                        ⚠️ Tezlashtirish kerak
                      </span>
                    )}
                    {isExpired && (
                      <span className="font-semibold animate-pulse">
                        ⚠️ Kechikdi
                      </span>
                    )}
                  </div>
                )}

                {/* NOTE */}
                {task.assigned_to === user?.id && (
                  <Textarea
                    className="mt-2"
                    placeholder="Izoh yozing..."
                    value={task.note || ''}
                    onChange={(e) => updateTaskNote(task.id, e.target.value)}
                  />
                )}

                {/* ACTION */}
                {!isLocked && !isExpired && task.assigned_to === user?.id && (

                  <div className="flex gap-2">

                    {task.status === 'pending' && (
                      <Button
                        onClick={async () => {
                          await supabase
                            .from('tasks')
                            .update({
                              status: 'in_progress'
                            })
                            .eq('id', task.id)

                          fetchTasks()
                        }}
                      >
                        Start
                      </Button>
                    )}

                  </div>

                )}

                {task.status === 'in_progress' && (
                  <div className="flex flex-col gap-2">

                    {/* progress bar */}
                    <div className="flex gap-2 items-center">
                      <div className="w-full h-2 bg-gray-200 rounded">
                        <div
                          className={`h-2 rounded ${(task.progress || 0) > 80
                            ? 'bg-green-500'
                            : (task.progress || 0) > 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                            }`}
                          style={{ width: `${task.progress || 0}%` }}
                        />
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={task.progress || 0}
                        className="w-full"
                        onChange={() => { }}
                        onMouseUp={async (e) => {
                          const value = Number(e.currentTarget.value)

                          await supabase
                            .from('tasks')
                            .update({
                              progress: value,
                              status:
                                value === 0
                                  ? 'pending'
                                  : value === 100
                                    ? 'completed'
                                    : 'in_progress'
                            })
                            .eq('id', task.id)

                          fetchTasks()
                        }}
                      />
                    </div>

                    {/* DONE BUTTON */}
                    <Button
                      size="sm"
                      onClick={async () => {
                        await supabase
                          .from('tasks')
                          .update({
                            progress: 100,
                            status: 'completed'
                          })
                          .eq('id', task.id)

                        fetchTasks()
                      }}
                    >
                      Done
                    </Button>

                  </div>
                )}
                {isBoss && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(task.id)

                      setNewTask({
                        title: task.title ?? '',
                        description: task.description ?? '',
                        assignedTo: task.assigned_to ?? '',
                        deadline: task.deadline ?? '',
                        priority: 'medium',
                        isKPI: task.is_locked ?? false
                      })

                      setDialogOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                )}


                {isBoss && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      await supabase.from('tasks').delete().eq('id', task.id)
                      fetchTasks()
                      console.log(user?.role)
                    }}
                  >
                    Delete

                  </Button>

                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

    </div >
  )
}
