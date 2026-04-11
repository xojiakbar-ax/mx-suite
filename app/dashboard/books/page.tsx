'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserProfile } from '@/hooks/use-user-profile'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'


export default function BooksPage() {
    const { profile } = useUserProfile()

    const [data, setData] = useState<Sale[]>([])
    type Sale = {
        id: string
        student_name: string
        student_surname: string
        group_name: string
        item_name: string
        amount: number
        comment: string
        created_at: string
    }
    const [loading, setLoading] = useState(false)

    const [filters, setFilters] = useState({
        item: '',
        date: '',
    })

    const [form, setForm] = useState({
        name: '',
        surname: '',
        group: '',
        item: '',
        amount: '',
        comment: '',
    })


    // 🔄 FETCH
    const fetchData = async () => {
        const supabase = createClient()

        let query = supabase
            .from('student_shop_sales')
            .select('*')
            .order('created_at', { ascending: false })

        // 🔥 ITEM FILTER
        if (filters.item) {
            query = query.ilike('item_name', `%${filters.item}%`)
        }

        // 🔥 DATE FILTER
        if (filters.date === 'today') {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            query = query.gte('created_at', today.toISOString())
        }

        if (filters.date === 'week') {
            const week = new Date()
            week.setDate(week.getDate() - 7)

            query = query.gte('created_at', week.toISOString())
        }

        if (filters.date === 'month') {
            const month = new Date()
            month.setMonth(month.getMonth() - 1)

            query = query.gte('created_at', month.toISOString())
        }

        const { data, error } = await query

        if (!error) setData(data || [])
    }

    useEffect(() => {
        fetchData()
    }, [filters])
    const handleExport = () => {
        const formattedData = data.map(item => ({
            Ism: item.student_name + ' ' + item.student_surname,
            Guruh: item.group_name,
            Narsa: item.item_name,
            Summa: item.amount,
            Izoh: item.comment,
            Sana: new Date(item.created_at).toLocaleString(),
        }))

        const worksheet = XLSX.utils.json_to_sheet(formattedData)
        const workbook = XLSX.utils.book_new()

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sotuvlar')

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        })

        const file = new Blob([excelBuffer], { type: 'application/octet-stream' })

        saveAs(file, 'sotuvlar.xlsx')
    }
    // ➕ INSERT
    const handleSubmit = async () => {
        if (editingId) return
        const supabase = createClient()

        if (!profile) return

        const { error } = await supabase.from('student_shop_sales').insert([
            {
                student_name: form.name,
                student_surname: form.surname,
                group_name: form.group,
                item_name: form.item,
                amount: Number(form.amount),
                comment: form.comment,
                created_by: profile.id,
                created_by_role: profile.role,
            },
        ])


        if (!error) {
            fetchData()

            setForm({
                name: '',
                surname: '',
                group: '',
                item: '',
                amount: '',
                comment: '',
            })
        }
    }
    const handleEdit = (item: any) => {
        setForm({
            name: item.student_name,
            surname: item.student_surname,
            group: item.group_name,
            item: item.item_name,
            amount: item.amount,
            comment: item.comment,
        })

        setEditingId(item.id)
    }
    const handleDelete = async (id: string) => {
        const supabase = createClient()

        const { error } = await supabase
            .from('student_shop_sales')
            .delete()
            .eq('id', id)

        if (error) {
            console.log('DELETE ERROR:', error)
            alert('Delete ishlamadi')
            return
        }

        fetchData()
    }
    const handleUpdate = async () => {
        if (!editingId) return

        const supabase = createClient()

        const { error } = await supabase
            .from('student_shop_sales')
            .update({
                student_name: form.name,
                student_surname: form.surname,
                group_name: form.group,
                item_name: form.item,
                amount: Number(form.amount),
                comment: form.comment,
            })
            .eq('id', editingId)

        if (error) {
            console.log('UPDATE ERROR:', error)
            alert('Update ishlamadi')
            return
        }

        setEditingId(null)

        setForm({
            name: '',
            surname: '',
            group: '',
            item: '',
            amount: '',
            comment: '',
        })

        fetchData()
    }

    // 📊 STATS
    const totalSum = data.reduce((acc, i) => acc + Number(i.amount), 0)
    const totalCount = data.length
    const [editingId, setEditingId] = useState<string | null>(null)

    const topItem = Object.values(
        data.reduce((acc: Record<string, any>, item: Sale) => {
            acc[item.item_name] = acc[item.item_name] || { ...item, count: 0 }
            acc[item.item_name].count++
            return acc
        }, {})
    ).sort((a: any, b: any) => b.count - a.count)[0]

    return (
        <div className="space-y-6">

            {/* 🔥 HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h1 className="text-2xl font-bold">📚 O‘quv jihozlari</h1>
                <p className="text-sm text-muted-foreground">
                    Barcha sotuvlar va statistika
                </p>
            </div>

            {/* 🔥 STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow">
                    <p className="text-sm opacity-80">Jami savdo</p>
                    <h2 className="text-2xl font-bold">{totalCount}</h2>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow">
                    <p className="text-sm opacity-80">Jami summa</p>
                    <h2 className="text-2xl font-bold">{totalSum} so'm</h2>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow">
                    <p className="text-sm opacity-80">Top mahsulot</p>
                    <h2 className="text-lg font-bold">{topItem?.item_name || '-'}</h2>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow">
                    <p className="text-sm opacity-80">Bugungi savdo</p>
                    <h2 className="text-2xl font-bold">
                        {data.filter(i =>
                            new Date(i.created_at).toDateString() === new Date().toDateString()
                        ).length}
                    </h2>
                </div>

            </div>

            {/* 🔥 FILTER */}
            <div className="flex flex-col md:flex-row gap-3">
                <Input
                    placeholder="🔍 Narsa bo‘yicha filter (kitob, ruchka...)"
                    className="max-w-sm"
                    onChange={e => setFilters({ ...filters, item: e.target.value })}
                />
                <select
                    className="border rounded-lg px-3 py-2 w-full md:w-48"
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                >
                    <option value="">Hammasi</option>
                    <option value="today">Bugun</option>
                    <option value="week">Hafta</option>
                    <option value="month">Oy</option>
                </select>
            </div>

            {/* 🔥 FORM */}
            {['administrator', 'director'].includes(profile?.role || '') && (

                <div className="p-6 bg-white rounded-2xl shadow border space-y-6">

                    {/* 🔥 TITLE */}
                    <div className="flex items-center justify-between">

                        <h2 className="font-semibold text-lg">
                            ➕ Yangi sotuv qo‘shish
                        </h2>

                        {editingId && (
                            <span className="text-sm text-blue-600">
                                ✏️ Tahrirlanmoqda
                            </span>
                        )}
                    </div>

                    {/* 🔥 FORM GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* ISM */}
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Ism</label>
                            <Input
                                placeholder="Ali"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>

                        {/* FAMILYA */}
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Familya</label>
                            <Input
                                placeholder="Valiyev"
                                value={form.surname}
                                onChange={e => setForm({ ...form, surname: e.target.value })}
                            />
                        </div>

                        {/* GURUH */}
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Guruh</label>
                            <Input
                                placeholder="Frontend N12"
                                value={form.group}
                                onChange={e => setForm({ ...form, group: e.target.value })}
                            />
                        </div>

                        {/* ITEM */}
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Mahsulot</label>
                            <select
                                className="border rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.item}
                                onChange={(e) => setForm({ ...form, item: e.target.value })}
                            >
                                <option value="">Tanlang</option>
                                <option value="Kitob">📚 Kitob</option>
                                <option value="Ruchka">🖊 Ruchka</option>
                                <option value="Daftar">📓 Daftar</option>
                            </select>
                        </div>

                        {/* SUMMA */}
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Summa</label>
                            <Input
                                type="number"
                                placeholder="50000"
                                value={form.amount}
                                onChange={e => setForm({ ...form, amount: e.target.value })}
                            />
                        </div>

                        {/* IZOH */}
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm text-gray-500">Izoh</label>
                            <Input
                                placeholder="Qo‘shimcha ma’lumot..."
                                value={form.comment}
                                onChange={e => setForm({ ...form, comment: e.target.value })}
                            />
                        </div>

                    </div>

                    {/* 🔥 BUTTONS */}
                    <div className="flex flex-col md:flex-row gap-3">

                        <Button
                            className="w-full md:w-auto"
                            onClick={editingId ? handleUpdate : handleSubmit}
                        >
                            {editingId ? 'Update' : 'Saqlash'}
                        </Button>

                        {editingId && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditingId(null)
                                    setForm({
                                        name: '',
                                        surname: '',
                                        group: '',
                                        item: '',
                                        amount: '',
                                        comment: '',
                                    })
                                }}
                            >
                                Bekor qilish
                            </Button>
                        )}

                    </div>

                </div>
            )}

            <div className="bg-white rounded-2xl shadow border overflow-hidden">

                <div className="p-4 border-b">
                    <h2 className="font-semibold">📊 Sotuvlar ro‘yxati</h2>
                </div>

                {/* 💻 DESKTOP */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3">Ism</th>
                                <th className="p-3">Guruh</th>
                                <th className="p-3">Narsa</th>
                                <th className="p-3">Summa</th>
                                <th className="p-3">Izoh</th>
                                <th className="p-3">Sana</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-3">
                                        {item.student_name} {item.student_surname}
                                    </td>
                                    <td className="p-3">{item.group_name}</td>
                                    <td className="p-3">{item.item_name}</td>
                                    <td className="p-3 text-green-600">{item.amount} so'm</td>
                                    <td className="p-3">{item.comment}</td>
                                    <td className="p-3 text-xs">
                                        {new Date(item.created_at).toLocaleString()}
                                    </td>
                                    <td className="p-3 flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="text-blue-600">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 📱 MOBILE */}
                <div className="md:hidden space-y-3 p-3">
                    {data.map((item) => (
                        <div key={item.id} className="border rounded-xl p-3 shadow-sm">
                            <p className="font-semibold">
                                {item.student_name} {item.student_surname}
                            </p>
                            <p className="text-sm text-gray-500">{item.group_name}</p>
                            <p>{item.item_name}</p>
                            <p className="text-green-600 font-semibold">
                                {item.amount} so'm
                            </p>

                            <div className="flex gap-2 mt-2">
                                <button onClick={() => handleEdit(item)} className="text-blue-600">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-600">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    )
}