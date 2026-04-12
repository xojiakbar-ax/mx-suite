'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AlertTriangle } from 'lucide-react'

const supabase = createClient()

export default function SalaryPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [editData, setEditData] = useState<any>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedEmp, setSelectedEmp] = useState<any>(null)
  const [penaltyModal, setPenaltyModal] = useState(false)
  const [allPenalties, setAllPenalties] = useState<any[]>([])
  const [penaltyForm, setPenaltyForm] = useState({
    amount: 0,
    reason: ''
  })
  const [history, setHistory] = useState<any[]>([])

  const [form, setForm] = useState({ name: '', role: '' })

  const format = (n: number) =>
    new Intl.NumberFormat('uz-UZ').format(n || 0) + " so'm"

  const calculate = (emp: any) => {
    if (!settings) return 0
    const student = emp.student_count || 0
    return (
      student * settings.course_price * (settings.percent / 100) +
      (emp.bonuses || 0) -
      (emp.penalties ?? 0)
    )
  }

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setLoading(false)

    // 🔥 parallel fetch
    const [meRes, settingsRes] = await Promise.all([
      supabase.from('employees').select('*').eq('profile_id', user.id).maybeSingle(),
      supabase.from('settings').select('*').maybeSingle()
    ])
    const { data: penaltiesData } = await supabase
      .from('penalties')
      .select('*')
    const me = meRes.data
    const set = settingsRes.data
    setAllPenalties(penaltiesData || [])
    if (!me) return setLoading(false)

    setRole(me.role)
    setSettings(set)

    let query = supabase.from('employees').select('*')

    if (!(me.role === 'director' || me.role === 'cto')) {
      query = query.eq('profile_id', user.id)
    }

    const { data } = await query

    setEmployees(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  if (loading || !settings) return <div className="p-6">Loading...</div>

  const canEdit = role === 'director' || role === 'cto'

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">💰 Salary System</h1>
      {canEdit && (
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
        >
          + Xodim qo‘shish
        </button>
      )}

      {/* SETTINGS */}
      {canEdit && (
        <div className="grid grid-cols-2 gap-4 bg-white p-5 rounded-2xl shadow">
          <input
            type="number"
            value={settings.course_price ?? ''}
            onChange={(e) => {
              const val = Number(e.target.value)

              setSettings((prev: any) => ({
                ...prev,
                course_price: val
              }))
            }}
            className="border p-3 rounded-xl"
          />
          <input
            type="number"
            value={settings.percent ?? ''}
            onChange={(e) => {
              const val = Number(e.target.value)

              setSettings((prev: any) => ({
                ...prev,
                percent: val
              }))
            }}
            className="border p-3 rounded-xl"
          />
        </div>
      )}

      {/* EMPLOYEES */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {employees.map(emp => {
          if (emp.role === 'director') return null

          const local = editData[emp.id] || {}
          const merged = { ...emp, ...local }
          const salary = calculate(merged)
          const empPenalties = allPenalties.filter(
            p => p.employee_id === emp.id
          )
          return (
            <div
              key={emp.id}
              className="bg-white border border-gray-200 
             rounded-3xl p-6 shadow-sm 
             hover:shadow-md transition-all duration-300 
             flex flex-col gap-5"
            >

              {/* TOP */}
              <div className="flex justify-between items-start">

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {emp.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {emp.role}
                  </p>
                </div>

                <div className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                  {emp.student_count || 0} student
                </div>

              </div>

              {/* BIG SALARY */}
              <div className="text-4xl font-bold text-gray-900 tracking-tight">
                {format(salary)}
              </div>

              {/* 2 COLUMN */}
              <div className="grid grid-cols-2 gap-4">

                {/* BONUS */}
                <div className="bg-green-50 border border-green-100 p-4 rounded-2xl">
                  <p className="text-xs text-gray-500 mb-1">Bonus</p>
                  <p className="text-lg font-semibold text-green-600">
                    +{format(emp.bonuses)}
                  </p>
                </div>

                {/* PENALTY TOTAL */}
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
                  <p className="text-xs text-gray-500 mb-1">Jarima</p>
                  <p className="text-lg font-semibold text-red-500">
                    -{format(emp.penalties)}
                  </p>
                </div>

              </div>

              {/* PENALTY LIST */}
              <div className="border-t pt-3 space-y-2 max-h-[140px] overflow-y-auto">

                {allPenalties.filter(p => p.employee_id === emp.id).length === 0 && (
                  <p className="text-sm text-gray-400">
                    Jarima yo‘q
                  </p>
                )}

                {allPenalties
                  .filter(p => p.employee_id === emp.id)
                  .map(p => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-red-500 font-medium">
                        -{format(p.amount)}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {p.reason}
                      </span>
                    </div>
                  ))}
              </div>

              {/* BUTTONS */}
              {canEdit && (
                <div className="flex gap-2">

                  <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm">
                    Jarima qo‘shish
                  </button>

                  <button className="flex-1 bg-gray-900 hover:bg-black text-white py-2 rounded-xl text-sm">
                    Saqlash
                  </button>

                </div>
              )}

            </div>
          )
        })}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-2xl w-[400px] space-y-4 shadow-xl">

              <h2 className="text-xl font-bold">Yangi xodim</h2>

              <input
                placeholder="Ism"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="border p-2 w-full rounded-xl"
              />

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                className="border p-2 w-full rounded-xl"
              >
                <option value="">Role tanlang</option>
                <option value="academic_manager">Academic Manager</option>
                <option value="marketing_manager">Marketing Manager</option>
                <option value="administrator">Administrator</option>
                <option value="cto">CTO</option>
              </select>

              <button
                onClick={async () => {
                  if (!form.name || !form.role) return

                  await supabase.from('employees').insert({
                    name: form.name,
                    role: form.role,
                    profile_id: null,
                    student_count: 0,
                    bonuses: 0,
                    penalties: 0
                  })

                  setShowAdd(false)
                  setForm({ name: '', role: '' })
                  load()
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl w-full"
              >
                Saqlash
              </button>

              <button
                onClick={() => setShowAdd(false)}
                className="text-gray-500 w-full"
              >
                Bekor qilish
              </button>

            </div>
          </div>
        )}
        {penaltyModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-[400px] space-y-4">

              <h2 className="text-xl font-bold">
                Jarima — {selectedEmp?.name}
              </h2>

              <input
                type="number"
                placeholder="Summa"
                value={penaltyForm.amount}
                onChange={(e) =>
                  setPenaltyForm({
                    ...penaltyForm,
                    amount: Number(e.target.value)
                  })
                }
                className="border p-2 w-full rounded-xl"
              />

              <input
                type="text"
                placeholder="Sababi"
                value={penaltyForm.reason}
                onChange={(e) =>
                  setPenaltyForm({
                    ...penaltyForm,
                    reason: e.target.value
                  })
                }
                className="border p-2 w-full rounded-xl"
              />

              <button
                onClick={async () => {
                  if (!penaltyForm.amount || !penaltyForm.reason) {
                    alert('Sabab va summa majburiy')
                    return
                  }

                  // 🔥 HISTORYGA YOZADI
                  await supabase.from('penalties').insert({
                    employee_id: selectedEmp.id,
                    amount: penaltyForm.amount,
                    reason: penaltyForm.reason
                  })

                  // 🔥 SALARYNI KAMAYTIRADI
                  await supabase
                    .from('employees')
                    .update({
                      penalties:
                        (selectedEmp.penalties || 0) + penaltyForm.amount,
                      penalty_reason: penaltyForm.reason
                    })
                    .eq('id', selectedEmp.id)

                  setPenaltyForm({ amount: 0, reason: '' })
                  setPenaltyModal(false)
                  setEmployees(prev =>
                    prev.map(e =>
                      e.id === selectedEmp.id
                        ? {
                          ...e,
                          penalties: (e.penalties || 0) + penaltyForm.amount,
                          penalty_reason: penaltyForm.reason
                        }
                        : e
                    )
                  )
                }}
                className="bg-green-600 text-white py-2 w-full rounded-xl"
              >
                Saqlash
              </button>

              <button
                onClick={() => setPenaltyModal(false)}
                className="text-gray-500 w-full"
              >
                Bekor qilish
              </button>

              {/* 🔥 HISTORY */}
              <div className="pt-3 border-t max-h-[200px] overflow-y-auto">
                <h3 className="font-semibold mb-2">Tarix</h3>

                {history.map((h) => (
                  <div key={h.id} className="text-sm border-b py-1">
                    <div className="text-red-500">
                      -{format(h.amount)}
                    </div>
                    <div>{h.reason}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}