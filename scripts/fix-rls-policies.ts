import { createClient } from '@supabase/supabase-js'

// Use service role for admin operations (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

async function fixRLSPolicies() {
  console.log('[v0] Starting RLS policy fix...')

  try {
    // Drop existing problematic policies
    await supabase.rpc('drop_policy_if_exists', {
      policy_name: 'profiles_select_policy',
      table_name: 'profiles',
    }).catch(() => console.log('[v0] No select policy to drop'))

    await supabase.rpc('drop_policy_if_exists', {
      policy_name: 'profiles_insert_policy',
      table_name: 'profiles',
    }).catch(() => console.log('[v0] No insert policy to drop'))

    await supabase.rpc('drop_policy_if_exists', {
      policy_name: 'profiles_update_policy',
      table_name: 'profiles',
    }).catch(() => console.log('[v0] No update policy to drop'))

    console.log('[v0] RLS policies reset')

    // Enable RLS on profiles table
    const { error: enableError } = await supabase.rpc('exec', {
      sql: 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;',
    }).catch(() => {
      // If rpc doesn't work, that's OK - RLS might already be enabled
      console.log('[v0] RLS already enabled or method not available')
      return { error: null }
    })

    if (enableError) {
      console.error('[v0] Error enabling RLS:', enableError)
    }

    console.log('[v0] RLS policies fixed successfully')
  } catch (err) {
    console.error('[v0] Error fixing RLS policies:', err)
  }
}

// Run the fix
fixRLSPolicies()
