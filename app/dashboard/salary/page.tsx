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

    if (!user) {
      setSettings({})
      setLoading(false)
      return
    }

    // 1. settings + me
    const [meRes, settingsRes] = await Promise.all([
      supabase.from('employees').select('*').eq('profile_id', user.id).maybeSingle(),
      supabase.from('settings').select('*').maybeSingle()
    ])

    const me = meRes.data
    const set = settingsRes.data

    if (!me) {
      setLoading(false)
      return
    }

    setRole(me.role)
    setSettings(set)

    // 2. employees
    let query = supabase.from('employees').select('*')

    if (!(me.role === 'director' || me.role === 'cto')) {
      query = query.eq('profile_id', user.id)
    }

    const { data } = await query

    setEmployees(data || [])

    // 3. 🔥 penalties (ENG OXIRIDA)
    const ids = (data || []).map(e => e.id)

    const { data: penaltiesData } = await supabase
      .from('penalties')
      .select('*')
      .in('employee_id', ids)

    setAllPenalties(penaltiesData || [])

    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <div className="p-6">Loading...</div>

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
              className="relative bg-white border border-gray-200 rounded-3xl 
             p-8 shadow-sm hover:shadow-xl 
             transition-all duration-300 
             w-full col-span-full flex flex-col gap-8"
            >

              {/* subtle glow */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 hover:opacity-100 transition duration-500 shadow-[0_0_60px_rgba(0,0,0,0.05)]" />

              {/* HEADER */}
              <div className="flex justify-between items-center">

                {/* LEFT */}
                <div>

                  {canEdit ? (
                    <input
                      value={editData[emp.id]?.name ?? emp.name}
                      onChange={(e) =>
                        setEditData((prev: any) => ({
                          ...prev,
                          [emp.id]: {
                            ...prev[emp.id],
                            name: e.target.value
                          }
                        }))
                      }
                      className="text-xl font-semibold bg-transparent border-b border-gray-200 focus:outline-none focus:border-black"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-gray-900">
                      {emp.name}
                    </h2>
                  )}

                  <p className="text-sm text-gray-400">
                    {emp.role}
                  </p>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2">

                  <div className="bg-gray-100 px-4 py-1.5 rounded-xl text-sm font-medium">
                    {emp.student_count || 0} students
                  </div>

                  {/* ❗ FAKAT ADMINLAR UCHUN */}
                  {canEdit && (
                    <button
                      onClick={async () => {
                        if (!confirm('O‘chirishni xohlaysizmi?')) return

                        await supabase.from('employees').delete().eq('id', emp.id)
                        load()
                      }}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      🗑
                    </button>
                  )}

                </div>

              </div>

              {/* BIG SALARY */}
              <div className="flex items-end justify-between">

                <h1 className="text-6xl font-bold text-gray-900 tracking-tight leading-none">
                  {format(salary)}
                </h1>

                <div className="text-sm text-gray-400">
                  Oylik
                </div>

              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-5 items-stretch">

                {/* BONUS */}
                <div className="rounded-2xl border bg-gray-50 p-5 hover:bg-green-50 transition flex flex-col justify-between">

                  <p className="text-xs text-gray-500 mb-3">Bonus</p>

                  {canEdit ? (
                    <div className="flex flex-col gap-4">

                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold text-lg">+</span>

                        <input
                          type="number"
                          min={0}
                          value={editData[emp.id]?.bonuses ?? emp.bonuses ?? ''}
                          onChange={(e) => {
                            const val = Number(e.target.value)
                            if (val < 0) return

                            setEditData((prev: any) => ({
                              ...prev,
                              [emp.id]: {
                                ...prev[emp.id],
                                bonuses: val
                              }
                            }))
                          }}
                          className="w-full text-2xl font-bold text-green-600 bg-transparent outline-none"
                        />
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {[10000, 50000, 100000].map(amount => (
                          <button
                            key={amount}
                            onClick={() =>
                              setEditData((prev: any) => {
                                const current =
                                  prev[emp.id]?.bonuses ?? emp.bonuses ?? 0

                                return {
                                  ...prev,
                                  [emp.id]: {
                                    ...prev[emp.id],
                                    bonuses: current + amount
                                  }
                                }
                              })
                            }
                            className="px-3 py-1 text-xs rounded-xl bg-green-100 hover:bg-green-200 text-green-700"
                          >
                            +{amount / 1000}k
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setEditData((prev: any) => ({
                              ...prev,
                              [emp.id]: {
                                ...prev[emp.id],
                                bonuses: 0
                              }
                            }))
                          }
                          className="px-3 py-1 text-xs rounded-xl bg-gray-200 hover:bg-gray-300"
                        >
                          reset
                        </button>
                      </div>

                    </div>
                  ) : (
                    <p className="text-xl font-semibold text-green-600">
                      +{format(emp.bonuses)}
                    </p>
                  )}

                </div>

                {/* PENALTY */}
                <div className="rounded-2xl border bg-gray-50 p-5 hover:bg-red-50 transition">
                  <p className="text-xs text-gray-500 mb-1">Jarima</p>
                  <p className="text-xl font-semibold text-red-500">
                    -{format(emp.penalties)}
                  </p>
                </div>

                {/* STUDENTS */}
                <div className="rounded-2xl border bg-gray-50 p-5">

                  <p className="text-xs text-gray-500 mb-1">Students</p>

                  {canEdit ? (
                    <input
                      type="number"
                      min={0}
                      value={editData[emp.id]?.student_count ?? emp.student_count ?? ''}
                      onChange={(e) =>
                        setEditData((prev: any) => ({
                          ...prev,
                          [emp.id]: {
                            ...prev[emp.id],
                            student_count: Number(e.target.value)
                          }
                        }))
                      }
                      className="w-full text-xl font-semibold bg-transparent outline-none"
                    />
                  ) : (
                    <p className="text-xl font-semibold text-blue-600">
                      {emp.student_count}
                    </p>
                  )}

                </div>

              </div>

              {/* PENALTY HISTORY */}
              <div className="border-t pt-6 space-y-4">

                <h3 className="text-sm font-semibold text-gray-700">
                  Jarimalar tarixi
                </h3>

                {allPenalties.filter(p => p.employee_id === emp.id).length === 0 && (
                  <p className="text-sm text-gray-400">
                    Jarima yo‘q
                  </p>
                )}

                <div className="grid md:grid-cols-2 gap-4">

                  {allPenalties
                    .filter(p => p.employee_id === emp.id)
                    .map(p => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center 
                       bg-gray-50 border p-4 rounded-2xl
                       hover:bg-red-50 transition"
                      >
                        <div>
                          <p className="text-red-500 font-semibold">
                            -{format(p.amount)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {p.reason}
                          </p>
                        </div>

                        <div className="text-red-400 text-lg">
                          ⚠️
                        </div>
                      </div>
                    ))}

                </div>

              </div>

              {/* BUTTONS */}
              {canEdit && (
                <div className="flex gap-3 pt-2">

                  <button
                    onClick={() => {
                      setSelectedEmp(emp)

                      // 🔥 history load
                      const empHistory = allPenalties.filter(
                        p => p.employee_id === emp.id
                      )
                      setHistory(empHistory)

                      // 🔥 form reset
                      setPenaltyForm({ amount: 0, reason: '' })

                      setPenaltyModal(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 
             bg-red-500 hover:bg-red-600 
             active:scale-95 transition-all duration-200 
             text-white py-3 rounded-2xl font-medium shadow-sm"
                  >
                    <AlertTriangle size={18} />
                    Jarima qo‘shish
                  </button>
                  <button
                    onClick={async () => {
                      const data = editData[emp.id]
                      if (!data) return

                      await supabase
                        .from('employees')
                        .update({
                          name: data.name ?? emp.name,
                          student_count: data.student_count ?? emp.student_count,
                          bonuses: data.bonuses ?? emp.bonuses
                        })
                        .eq('id', emp.id)

                      setEditData((prev: any) => {
                        const copy = { ...prev }
                        delete copy[emp.id]
                        return copy
                      })

                      load()
                    }}
                    className="flex-1 bg-gray-900 hover:bg-black text-white py-3 rounded-2xl"
                  >
                    💾 Saqlash
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

                  const { data: { user } } = await supabase.auth.getUser()
                  if (!user) return // 🔥 SHU QATORNI QO‘SH

                  await supabase.from('employees').insert({
                    name: form.name,
                    role: form.role,
                    profile_id: user.id, // 🔥 SHU MUHIM
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