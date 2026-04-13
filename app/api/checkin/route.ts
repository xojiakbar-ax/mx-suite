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

    // 🔥 SERVER TIME (XAVFSIZ)
    const now = new Date()

    // 🔥 TOSHKENT TIME (DISPLAY)
    const checkInTime = new Intl.DateTimeFormat('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Tashkent',
    }).format(now)

    // 🔥 ISO DATE (BUGUN)
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Tashkent',
    }).format(now)

    // 🔒 1 MARTA CHECK
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

    // 🔥 KECHIKISH (TOSHKENT TIME BO‘YICHA)
    const parts = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Tashkent',
    }).formatToParts(now)

    const hours = Number(parts.find(p => p.type === 'hour')?.value)
    const minutes = Number(parts.find(p => p.type === 'minute')?.value)

    const is_late = hours > 8 || (hours === 8 && minutes > 0)

    // 🔥 INSERT
    const { data, error } = await supabase
      .from('check_ins')
      .insert({
        user_id: user.id,
        user_name: user.user_metadata?.name || 'User', // 🔥 SHUNI QO‘SH
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

    // 🔥 RETURN (FRONTEND UCHUN TO‘G‘RI FORMAT)
    return NextResponse.json({
      id: data.id,
      userId: data.user_id,
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