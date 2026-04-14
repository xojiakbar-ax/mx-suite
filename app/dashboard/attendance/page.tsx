'use client'

import { useStore } from '@/lib/store'
import { useState, useEffect } from 'react'
import { Trash2, Calendar, Clock } from 'lucide-react'

export default function AttendancePage() {
    const { allCheckIns, user, removeCheckIn, fetchCheckIns } = useStore()

    const [filter, setFilter] = useState<'today' | 'week' | 'month' | 'all'>('today')

    const now = new Date()
    useEffect(() => {
        if (user) {
            fetchCheckIns()
        }
    }, [user])
    const checkIns = Object.entries(allCheckIns)

    const filtered = checkIns.filter(([_, item]) => {

        const itemDate = new Date(item.dateFull || item.date)

        if (filter === 'today') {
            const itemDateUzb = itemDate.toLocaleDateString('en-US', { timeZone: "Asia/Tashkent" })
            const nowDateUzb = now.toLocaleDateString('en-US', { timeZone: "Asia/Tashkent" })
            return itemDateUzb === nowDateUzb
        }

        if (filter === 'week') {
            const weekAgo = new Date()
            weekAgo.setDate(now.getDate() - 7)
            return itemDate >= weekAgo
        }

        if (filter === 'month') {
            return (
                itemDate.getMonth() === now.getMonth() &&
                itemDate.getFullYear() === now.getFullYear()
            )
        }

        return true
    })

    // ❌ ROLE PROTECT
    if (user?.role !== 'director' && user?.role !== 'cto') {
        return <div>Ruxsat yo‘q</div>
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h1 className="text-2xl font-bold">📊 Attendance</h1>

                <div className="flex flex-wrap gap-2">
                    {['today', 'week', 'month', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-xl text-sm transition ${filter === f
                                ? 'bg-primary text-white shadow'
                                : 'bg-muted hover:bg-muted/70'
                                }`}
                        >
                            {f === 'today' && 'Bugun'}
                            {f === 'week' && 'Hafta'}
                            {f === 'month' && 'Oy'}
                            {f === 'all' && 'Hammasi'}
                        </button>
                    ))}
                </div>
            </div>

            {/* LIST */}
            <div className="grid gap-4">
                {filtered.length === 0 && (
                    <div className="text-center text-muted-foreground py-10">
                        Hech qanday ma'lumot yo‘q
                    </div>
                )}

                {filtered.map(([key, item]) => (
                    <div
                        key={key}
                        className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
                    >

                        {/* 📸 IMAGE */}
                        <div className="w-full md:w-40 h-40 bg-black rounded-xl overflow-hidden flex-shrink-0">
                            {item.checkInImage ? (
                                <img
                                    src={item.checkInImage}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-white text-sm">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* 🧾 INFO */}
                        <div className="flex-1 flex flex-col justify-between">

                            <div className="space-y-2">

                                {/* USER */}
                                <h3 className="font-semibold text-lg">
                                    👤 {item.userName || item.email || 'No name'}
                                </h3>

                                {/* TIME */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock size={16} />
                                    {item.checkInTime}
                                </div>

                                {/* DATE */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar size={16} />
                                    {new Date(item.dateFull || item.date).toLocaleDateString('uz-UZ')}
                                </div>

                                {/* CAPTION */}
                                {item.caption && (
                                    <div className="mt-2 p-3 bg-muted rounded-lg text-sm flex justify-between items-center">
                                        <span>💬 {item.caption}</span>

                                        <span className="text-xs text-muted-foreground">
                                            {new Date().toLocaleTimeString('uz-UZ', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* DELETE */}
                            <div className="flex justify-end mt-3">
                                <button
                                    onClick={() => removeCheckIn(key)}
                                    className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm transition"
                                >
                                    <Trash2 size={16} />
                                    O‘chirish
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}