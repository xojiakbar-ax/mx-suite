'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import {
  Wallet, CheckCircle, XCircle, Plus
} from 'lucide-react'

export default function BudgetPage() {
  const {
    user,
    managerBudgets,
    budgetRequests,
    requestBudget,
    reviewBudgetRequest,
  } = useStore()

  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [type, setType] = useState<'education' | 'personal'>('education')

  if (!user) return null

  useEffect(() => {
    setOpen(false)
  }, [])

  const isBoss = user.role === 'director' || user.role === 'cto'

  const myBudget = managerBudgets[user.id] || {
    education: 600000,
    personal: 600000,
  }

  const format = (n: number) =>
    new Intl.NumberFormat('uz-UZ').format(n) + " so'm"
  const validate = () => {
    const value = Number(amount)

    if (!value) return "Miqdor kiriting"

    if (value > 600000) {
      return "600,000 so'mdan oshmasin"
    }

    const current = myBudget

    if (type === 'education' && value > current.education) {
      return "O‘quv markaz budget yetarli emas"
    }

    if (type === 'personal' && value > current.personal) {
      return "Shaxsiy budget yetarli emas"
    }

    return ""
  }
  const handleRequest = () => {
    const err = validate()
    if (err) {
      setError(err)
      return
    }

    requestBudget(parseInt(amount), note, type)

    setAmount('')
    setNote('')
    setError('')
    setOpen(false)
  }

  const myRequests = isBoss
    ? budgetRequests
    : budgetRequests.filter(r => r.userId === user.id)

  const pending = budgetRequests.filter(r => r.status === 'pending')

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" />
            Budget
          </h1>
          <p className="text-muted-foreground text-sm">
            Har manager uchun 1.2M limit
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="rounded-xl gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          So‘rov
        </Button>
      </div>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl space-y-4">
          <DialogHeader>
            <DialogTitle>Yangi so‘rov</DialogTitle>
          </DialogHeader>

          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="border rounded-xl p-2"
          >
            <option value="education">🏫 O‘quv markaz</option>
            <option value="personal">👤 Shaxsiy</option>
          </select>

          <Input
            type="number"
            placeholder="Miqdor"
            value={amount}
            onChange={(e) => {
              const val = e.target.value
              setAmount(val)

              const err = validate()
              setError(err)
            }} />
          {error && (
            <p className="text-red-500 text-sm font-medium">
              ⚠ {error}
            </p>
          )}
          <Textarea
            placeholder="Izoh"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <Button
            onClick={handleRequest}
            disabled={!!error}
            className="rounded-xl"
          >            Yuborish
          </Button>
        </DialogContent>
      </Dialog>

      {/* BUDGET */}
      <div className="grid md:grid-cols-2 gap-4">

        <Card className="rounded-2xl shadow">
          <CardHeader>
            <CardTitle>🏫 O‘quv markaz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {format(myBudget.education)}
            </p>
            <Progress value={(1 - myBudget.education / 600000) * 100} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardHeader>
            <CardTitle>👤 Shaxsiy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {format(myBudget.personal)}
            </p>
            <Progress value={(1 - myBudget.personal / 600000) * 100} />
          </CardContent>
        </Card>
      </div>

      {/* PENDING */}
      {isBoss && pending.length > 0 && (
        <Card className="rounded-2xl shadow">
          <CardHeader>
            <CardTitle>Kutilayotgan so‘rovlar</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {pending.map(r => (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-secondary flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{r.userName}</p>
                  <p className="text-sm text-muted-foreground">{r.note}</p>
                  <p className="text-xs">
                    {r.type === 'education' ? '🏫' : '👤'} {r.type}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() =>
                      reviewBudgetRequest(
                        r.id,
                        true,
                        user.id,
                        user.role === 'director' ? 'director' : 'cto'
                      )
                    }
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500"
                    onClick={() =>
                      reviewBudgetRequest(
                        r.id,
                        false,
                        user.id,
                        user.role === 'director' ? 'director' : 'cto'
                      )
                    }
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* HISTORY */}
      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle>So‘rovlar</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {myRequests.map(r => (
            <div
              key={r.id}
              className="p-4 rounded-xl bg-secondary flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{r.userName}</p>
                <p className="text-sm text-muted-foreground">{r.note}</p>
              </div>

              <div className="flex items-center gap-3">
                <span>{format(r.amount)}</span>

                {r.status === 'pending' && <Badge>Kutilmoqda</Badge>}
                {r.status === 'approved' && (
                  <Badge className="bg-green-500">Qabul</Badge>
                )}
                {r.status === 'rejected' && (
                  <Badge variant="destructive">Rad</Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  )
}