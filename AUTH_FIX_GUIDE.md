# Authentication Fix Guide

## Problem Solved
Users were getting "Invalid login credentials" when trying to login because demo users didn't exist in Supabase Auth.

## Solution

### Step 1: Initial Setup
1. Visit `/setup` page (linked from login page)
2. Click "Create Demo Users" button
3. This will create two demo accounts in Supabase:
   - **CTO**: xojiakbarr.a@gmail.com / cto321
   - **Director**: director@demo.uz / 123456

### Step 2: Login
After setup is complete, you can login at `/auth/login` using the demo credentials shown.

## How It Works

### Authentication Flow
1. User enters email and password on login form
2. `supabase.auth.signInWithPassword()` is called with these credentials
3. Supabase Auth validates credentials and returns user session
4. User is redirected to dashboard if login succeeds
5. Clear error message is shown if login fails

### Key Components

**Login Page** (`app/auth/login/page.tsx`)
- Simple email + password form (no phone login)
- Calls Supabase `signInWithPassword()` API
- Shows demo credentials below form
- Link to setup page for first-time users

**Setup Page** (`app/setup/page.tsx`)
- User-friendly interface to create demo users
- Calls `/api/setup-demo-users` endpoint
- Shows success message and link to login

**Setup API** (`app/api/setup-demo-users/route.ts`)
- Uses Supabase Admin API to create users
- Auto-confirms email for demo accounts
- Creates user profiles in database
- Handles duplicate users gracefully

## Testing

### First Time Setup
1. Go to `/setup`
2. Click "Create Demo Users"
3. Wait for success message
4. Go to login page
5. Enter demo credentials

### Subsequent Logins
1. Go to `/auth/login`
2. Enter credentials (shown in demo card)
3. Should login successfully

## Troubleshooting

### "Invalid login credentials" error
- Make sure demo users exist: visit `/setup` and create them
- Check email matches exactly (case-sensitive)
- Verify password is correct

### "User profile not found" error
- The user exists in Auth but profile wasn't created
- Visit `/setup` again to recreate profiles

### Can't access setup page
- Setup page is public and accessible to anyone
- Visit `http://localhost:3000/setup`

## Security Notes

- Demo credentials are intentionally simple for testing
- Setup endpoint can be accessed by anyone (intended for first-time setup)
- Consider implementing access controls if deploying to production
- Change demo passwords before going live

## Integration Details

**Supabase Client Setup** (`lib/supabase/client.ts`)
- Uses `createBrowserClient` from `@supabase/ssr`
- Configured with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Supabase Server Setup** (`lib/supabase/server.ts`)
- Uses `createServerClient` from `@supabase/ssr`
- Includes cookie handling for session persistence

**Database Schema**
- `auth.users` table: Supabase managed authentication
- `public.profiles` table: User profile information with role-based access control
- RLS policies: Enforced per user using `auth.uid()`
