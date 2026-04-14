import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 📥 GET (HAMMA check-inlar — GLOBAL)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('check_ins')
      .select('*')
      .order('check_in_time', { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const formatted = data.map((item) => ({
      id: item.id,
      userId: item.user_id,
      userName: item.user_name || 'No name',
      date: item.check_in_date,
      checkInTime: item.check_in_time,
      checkOutTime: item.check_out_time,
      isLate: item.is_late,
      penalty: item.penalty,
      checkInImage: item.check_in_image,
      caption: item.caption,
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

    const checkInTime = new Intl.DateTimeFormat('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Tashkent',
    }).format(now)

    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Tashkent',
    }).format(now)

    const { data: existing } = await supabase
      .from('check_ins')
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

    const parts = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Tashkent',
    }).formatToParts(now)

    const hours = Number(parts.find(p => p.type === 'hour')?.value)
    const minutes = Number(parts.find(p => p.type === 'minute')?.value)

    const is_late = hours > 8 || (hours === 8 && minutes > 0)

    // 🔥 USER NAME FIX (ENG MUHIM)
    const userName =
      user.user_metadata?.name ||
      user.email ||
      'User'

    const { data, error } = await supabase
      .from('check_ins')
      .insert({
        user_id: user.id,
        user_name: userName, // ✅ FIX
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
      userName: data.user_name, // ✅ FIX
      date: data.check_in_date,
      checkInTime: data.check_in_time,
      checkOutTime: data.check_out_time,
      isLate: data.is_late,
      penalty: data.penalty,
      checkInImage: data.check_in_image,
      caption: data.caption,
    })

  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}