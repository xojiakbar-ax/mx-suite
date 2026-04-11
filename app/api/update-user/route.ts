import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    try {
        const { userId, name, password } = await req.json()

        if (password) {
            await supabaseAdmin.auth.admin.updateUserById(userId, { password })
        }

        if (name) {
            await supabaseAdmin
                .from('profiles')
                .update({ name })
                .eq('id', userId)
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 })
    }
}