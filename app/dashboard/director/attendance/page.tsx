'use client'

import { useStore } from '@/lib/store'
import { useState } from 'react'

export default function AttendancePage() {
    const { allCheckIns } = useStore()
    const [filter, setFilter] = useState<'today' | 'week'>('today')

    const today = new Date().toISOString().split('T')[0]

    const data = Object.values(allCheckIns).filter((item) => {
        if (filter === 'today') return item.date === today

        const itemDate = new Date(item.date)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)

        return itemDate >= weekAgo
    })

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📊 Attendance Monitoring</h1>

            {/* FILTER */}
            <div className="flex gap-2 mb-4">
                <button onClick={() => setFilter('today')} className="px-3 py-1 border rounded">
                    Bugun
                </button>
                <button onClick={() => setFilter('week')} className="px-3 py-1 border rounded">
                    Hafta
                </button>
            </div>

            {/* LIST */}
            <div className="grid gap-4">
                {data.map((item: any, i) => (
                    <div key={i} className="border rounded-xl p-4 shadow-sm">

                        <div className="flex justify-between">
                            <h2 className="font-bold text-lg">{item.userName}</h2>

                            {/* 🟢 ONLINE */}
                            <span className={`text-sm ${item.checkOutTime ? 'text-gray-400' : 'text-green-500'
                                }`}>
                                {item.checkOutTime ? 'Offline' : 'Online'}
                            </span>
                        </div>

                        <p>📅 {item.date}</p>
                        <p>🕒 {item.checkInTime} → {item.checkOutTime || '...'}</p>

                        {item.caption && (
                            <p className="text-sm text-gray-500 mt-1">
                                💬 {item.caption}
                            </p>
                        )}

                        {item.checkInImage && (
                            <img
                                src={item.checkInImage}
                                className="w-40 mt-2 rounded-lg"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}