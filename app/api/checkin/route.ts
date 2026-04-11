import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 📥 GET (o'z check-inlari)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('check_ins') // ✅ FIX
      .select('*')
      .eq('user_id', user.id)
      .order('check_in_time', { ascending: false })
      .limit(30)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const formatted = data.map((item) => ({
      ...item,
      date: item.check_in_date,
      checkInTime: item.check_in_time,
      isLate: item.is_late,
    }))

    return NextResponse.json(formatted)

  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 📤 POST (check-in)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { check_in_image, caption } = body

    const now = new Date()
    const today = now.toISOString().split('T')[0]

    // 🔒 1 marta
    const { data: existing } = await supabase
      .from('check_ins') // ✅ FIX
      .select('id')
      .eq('user_id', user.id)
      .eq('check_in_date', today)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Siz bugun allaqachon check-in qilgansiz' },
        { status: 400 }
      )
    }

    const hours = now.getHours()
    const minutes = now.getMinutes()
    const is_late = hours > 9 || (hours === 9 && minutes > 0)

    const checkInTime = now.toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit'
    })

    const { data, error } = await supabase
      .from('check_ins') // ✅ FIX
      .insert({
        user_id: user.id,
        check_in_date: today,
        check_in_time: checkInTime,
        check_out_time: null,
        is_late,
        penalty: 0,
        check_in_image,
        caption: caption || '',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      id: data.id,
      userId: data.user_id,
      date: data.check_in_date,
      checkInTime: data.check_in_time,
      checkOutTime: data.check_out_time,
      isLate: data.is_late,
      penalty: data.penalty,
      checkInImage: data.check_in_image, // ✅
      caption: data.caption,
    })

  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}