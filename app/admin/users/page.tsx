'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

const ROLES = ['director', 'cto', 'academic_director', 'academic_manager', 'marketing_manager', 'administrator', 'teacher']

type User = {
  id: string
  name: string
  email: string
  role: string
  phone?: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const supabase = createClient()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newName, setNewName] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'administrator',
  })

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user

      if (!user) return router.replace('/auth/login')

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || !['director', 'cto'].includes(profile.role)) {
        return router.replace('/dashboard')
      }

      const { data } = await supabase.from('profiles').select('*')
      setUsers(data || [])

      setLoading(false)
      setAuthLoading(false)
    }

    init()
  }, [])

  if (authLoading || loading) return <div className="p-6">Loading...</div>

  // CREATE
  const handleCreateUser = async (e: any) => {
    e.preventDefault()

    const { data: { session } } = await supabase.auth.getSession()

    const res = await fetch('/api/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(formData),
    })

    if (!res.ok) return setError('Create error')

    setSuccess('User created')
    setShowCreateForm(false)

    const { data } = await supabase.from('profiles').select('*')
    setUsers(data || [])
  }

  // UPDATE
  const handleUpdateUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    await fetch('/api/update-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        userId: editingUser?.id,
        name: newName,
        password: newPassword,
      }),
    })

    setEditingUser(null)

    const { data } = await supabase.from('profiles').select('*')
    setUsers(data || [])
  }

  // DELETE
  const handleDeleteUser = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession()

    await fetch('/api/delete-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ userId: id }),
    })

    setUsers(users.filter((u) => u.id !== id))
  }

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>

        <Link href="/dashboard">
          <Button variant="outline">← Back</Button>
        </Link>
      </div>

      {error && <Alert><AlertDescription>{error}</AlertDescription></Alert>}
      {success && <Alert><AlertDescription>{success}</AlertDescription></Alert>}

      <Button onClick={() => setShowCreateForm(!showCreateForm)}>
        <Plus className="w-4 h-4 mr-2" />
        Create User
      </Button>

      {showCreateForm && (
        <Card className="p-4 space-y-2">
          <Input placeholder="Name" onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <Input placeholder="Email" onChange={e => setFormData({ ...formData, email: e.target.value })} />
          <Input placeholder="Password" type="password" onChange={e => setFormData({ ...formData, password: e.target.value })} />

          <Select onValueChange={v => setFormData({ ...formData, role: v })}>
            <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>

          <Button onClick={handleCreateUser}>Create</Button>
        </Card>
      )}

      <Card className="p-4 space-y-3">
        {users.map((u) => (
          <div key={u.id} className="flex justify-between border p-2 rounded">
            <div>
              <p>{u.name}</p>
              <p className="text-sm">{u.email}</p>
              <p className="text-xs">{u.role}</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => { setEditingUser(u); setNewName(u.name) }}>Edit</Button>
              <Button onClick={() => handleDeleteUser(u.id)} variant="destructive">Delete</Button>
            </div>
          </div>
        ))}
      </Card>

      {editingUser && (
        <Card className="p-4 space-y-2">
          <h3>Edit User</h3>
          <Input value={newName} onChange={e => setNewName(e.target.value)} />
          <Input placeholder="New password" type="password" onChange={e => setNewPassword(e.target.value)} />
          <Button onClick={handleUpdateUser}>Save</Button>
        </Card>
      )}

    </div>
  )
}