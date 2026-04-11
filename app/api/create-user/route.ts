import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const { email, password, name, role, phone } = body

        // 🔥 BU QISIMNI QO‘SH
        const token = req.headers.get('authorization')?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: userData } = await supabaseAdmin.auth.getUser(token)

        const currentUserId = userData.user?.id

        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', currentUserId)
            .single()

        // 🔥 DIRECTOR VA CTO GA RUXSAT
        if (!profile || !['director', 'cto'].includes(profile.role)) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 })
        }

        // 🔐 USER CREATE
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        const userId = data.user.id

        // 👤 PROFILE CREATE
        await supabaseAdmin.from('profiles').insert({
            id: userId,
            email,
            name,
            role,
            phone,
        })

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}