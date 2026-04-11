# Demo Login System - Complete Guide

## Overview

The demo login system automatically creates demo users in Supabase Auth and ensures seamless demo access without requiring manual setup.

## Demo Accounts

Three demo accounts are automatically created:

1. **Director** - Full system access
   - Email: `998901111111@demo.educenter.uz`
   - Password: `123456`
   - Role: `director`

2. **CTO** - Technical administration
   - Email: `998902222222@demo.educenter.uz`
   - Password: `123456`
   - Role: `cto`

3. **Manager** - Academic management
   - Email: `998903333333@demo.educenter.uz`
   - Password: `123456`
   - Role: `academic_manager`

## How It Works

### 1. Auto-Seeding on App Load
When users visit the auth pages, the `useSeedDemoUsers` hook automatically:
- Calls `/api/seed-demo-users` endpoint
- Creates demo users in Supabase Auth if they don't exist
- Creates corresponding profiles with roles
- Only runs once per session

### 2. Manual Seeding on Demo Click
When users click "Demo bilan kirish" button:
- Explicitly calls seed endpoint to ensure users exist
- Waits for database to be ready (500ms delay)
- Attempts login with demo credentials
- Provides user-friendly error messages

### 3. API Endpoint: `/api/seed-demo-users`

**Method:** POST

**What it does:**
- Checks if demo users already exist in auth
- Creates them if missing using admin API with service role
- Creates profiles for each user with proper roles
- Emails are auto-confirmed for demo accounts
- Returns success status

**Error Handling:**
- Gracefully skips existing users
- Logs errors without blocking other user creation
- Returns 200 status even if some users already exist

### 4. Login Flow

```
User clicks Demo Account
    ↓
Seed Demo Users (if needed)
    ↓
Wait for DB (500ms)
    ↓
Login with Supabase
    ↓
Redirect to Dashboard
```

## Files Modified

- `/app/auth/login/page.tsx` - Enhanced demo login handler with retry logic
- `/app/api/seed-demo-users/route.ts` - Improved user creation with profile fallback
- `/app/auth/layout.tsx` - Added auto-seeding hook
- `/hooks/use-seed-demo-users.ts` - New hook for session-based auto-seeding

## Error Handling

If demo login fails:
1. Seed endpoint is called to ensure users exist
2. Database delay handled with 500ms timeout
3. If still failing, user sees: "Demo login failed. Please try again in a moment."
4. All errors are logged for debugging

## Testing Demo Login

1. Clear browser cache/cookies
2. Navigate to login page
3. Demo users are automatically created
4. Click "Demo bilan kirish"
5. Select any demo account
6. Automatically redirected to dashboard

## Troubleshooting

### "Invalid login credentials"
- Ensure Supabase admin API is accessible
- Check `SUPABASE_SERVICE_ROLE_KEY` environment variable
- Verify no RLS policies are blocking profile creation

### Demo users not appearing
- Check browser console for errors
- Verify seed endpoint logs in server console
- Ensure auth and profiles tables exist in database

### Login still fails after seeding
- Wait 1-2 seconds and try again (database sync delay)
- Check Supabase dashboard to verify users were created
- Clear auth session and try fresh

## Security Notes

- Demo accounts use weak passwords (only for demo)
- Production deployments should disable auto-seeding
- Demo credentials are clearly marked in code
- All demo users have specific roles to demonstrate different access levels
