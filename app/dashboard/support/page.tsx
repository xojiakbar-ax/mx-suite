'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger, DialogDescription
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select'

import {
  Plus, CheckCircle, Clock, AlertCircle
} from 'lucide-react'

export default function SupportPage() {
  const supabase = createClient()
  const user = useStore(s => s.user)
  if (!user) return null

  const [tickets, setTickets] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    title: '',
    desc: '',
    attachments: [] as string[]
  })

  const isBoss = ['director', 'cto'].includes(user.role)

  // FETCH
  const fetchTickets = async () => {
    let query = supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (!isBoss) query = query.eq('user_id', user.id)

    const { data } = await query
    setTickets(data || [])
  }

  useEffect(() => {
    if (user) fetchTickets()
  }, [user])

  // REALTIME
  useEffect(() => {
    const ch = supabase
      .channel('live')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'support_tickets'
      }, fetchTickets)
      .subscribe()

    return () => { supabase.removeChannel(ch) }
  }, [])

  // UPDATE
  const updateStatus = async (id: string, status: string) => {
    await supabase.from('support_tickets')
      .update({ status })
      .eq('id', id)

    fetchTickets()
  }

  // FILE
  const handleFile = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    const path = `tickets/${user.id}/${Date.now()}`

    await supabase.storage.from('tickets').upload(path, file)

    const { data } = supabase.storage.from('tickets').getPublicUrl(path)

    setForm(prev => ({
      ...prev,
      attachments: [data.publicUrl] // 🔥 faqat 1 ta rasm
    }))
  }

  // CREATE
  const send = async () => {
    if (!form.title || !form.desc) return

    await supabase.from('support_tickets').insert([{
      subject: form.title,
      message: form.desc,
      attachments: form.attachments,
      user_id: user.id,
      user_name: user.name,
      status: 'pending'
    }])

    setForm({ title: '', desc: '', attachments: [] })
    setOpen(false)
  }

  const filtered = tickets.filter(t =>
    filter === 'all' ? true : t.status === filter
  )

  const badge = (s: string) => {
    if (s === 'pending') return <Badge className="bg-yellow-100 text-yellow-600">Pending</Badge>
    if (s === 'in_progress') return <Badge className="bg-blue-100 text-blue-600">Working</Badge>
    return <Badge className="bg-green-100 text-green-600">Done</Badge>
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 }
          }
        }}
      >

        {/* TOTAL */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <Card className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Total</p>
                <h2 className="text-2xl font-bold">{tickets.length}</h2>
              </div>
              <Clock className="text-blue-500" />
            </div>
          </Card>
        </motion.div>

        {/* PENDING */}
        <motion.div variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}>
          <Card className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Pending</p>
                <h2 className="text-2xl font-bold">
                  {tickets.filter(t => t.status === 'pending').length}
                </h2>
              </div>
              <AlertCircle className="text-yellow-500" />
            </div>
          </Card>
        </motion.div>

        {/* DONE */}
        <motion.div variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}>
          <Card className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Done</p>
                <h2 className="text-2xl font-bold">
                  {tickets.filter(t => t.status === 'resolved').length}
                </h2>
              </div>
              <CheckCircle className="text-green-500" />
            </div>
          </Card>
        </motion.div>

      </motion.div>

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Support</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl"><Plus /></Button>
          </DialogTrigger>

          {/* 🔥 PRO MODAL */}
          <DialogContent className="
            w-full max-w-md
            h-full sm:h-auto
            rounded-none sm:rounded-2xl
            bg-background dark:bg-zinc-900
          ">
            <DialogHeader>
              <DialogTitle>New Issue</DialogTitle>
              <DialogDescription>
                Muammoni yozing va rasm qo‘shing
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">

              {/* FILE */}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFile}
                className="hidden"
              />

              <Button
                onClick={() => document.getElementById('fileInput')?.click()}
                className="w-full h-11 rounded-xl"
              >
                📸 Kamera / Upload
              </Button>

              {/* PREVIEW */}
              {form.attachments[0] && (
                <img
                  src={form.attachments[0]}
                  className="w-full max-h-60 object-contain rounded-xl bg-muted"
                />
              )}

              <Input
                placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="h-11 rounded-xl"
              />

              <Textarea
                placeholder="Description"
                value={form.desc}
                onChange={e => setForm({ ...form, desc: e.target.value })}
                className="rounded-xl min-h-[100px]"
              />

              <Button onClick={send} className="w-full h-11 rounded-xl">
                Send
              </Button>

            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* FILTER */}
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-32 rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">Working</SelectItem>
          <SelectItem value="resolved">Done</SelectItem>
        </SelectContent>
      </Select>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="rounded-2xl hover:shadow-xl transition">
              <CardContent className="p-5 space-y-3">

                <div className="flex justify-between">
                  <h3 className="font-medium">{t.subject}</h3>
                  {badge(t.status)}
                </div>

                <p className="text-sm text-muted-foreground">{t.message}</p>

                {t.attachments?.[0] && (
                  <motion.img
                    src={t.attachments[0]}
                    className="w-full max-h-80 object-contain rounded-xl bg-muted"
                    whileHover={{ scale: 1.05 }}
                  />
                )}

              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

    </div>
  )
}