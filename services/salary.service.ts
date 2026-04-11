import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// 🔥 GET ALL
export const getEmployees = async () => {
    const { data, error } = await supabase
        .from('employees')
        .select('*')

    if (error) throw error
    return data
}

// 🔥 GET SELF
export const getMyEmployee = async (id: string) => {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

// 🔥 UPDATE
export const updateEmployee = async (id: string, field: string, value: any) => {
    const { error } = await supabase
        .from('employees')
        .update({ [field]: value })
        .eq('id', id)

    if (error) throw error
}

// 🔥 SETTINGS
export const getSettings = async () => {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single()

    if (error) throw error
    return data
}

export const updateSettings = async (field: string, value: any) => {
    const { error } = await supabase
        .from('settings')
        .update({ [field]: value })
        .eq('id', 1)

    if (error) throw error
}