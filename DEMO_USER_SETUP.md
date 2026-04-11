# Demo User Setup Instructions

To make the demo credentials work on the login page, you need to create these users in your Supabase project.

## Demo Credentials

The login page displays these demo credentials:

- **CTO**: Email: `xojiakbarr.a@gmail.com`, Password: `cto321`
- **Director**: Email: `director@demo.uz`, Password: `123456`

## How to Create Demo Users

### Option 1: Use the Setup API Endpoint (Recommended)

Call this endpoint to automatically create both demo users:

```bash
POST /api/setup-demo-users
```

This will:
1. Create both users in Supabase Auth
2. Auto-confirm their emails
3. Create their profiles with proper roles

You can call this endpoint from the browser console or any HTTP client.

### Option 2: Manual Setup via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication → Users**
3. Click **Add User**
4. Create the CTO user:
   - Email: `xojiakbarr.a@gmail.com`
   - Password: `cto321`
   - User metadata (optional): `{ "role": "cto" }`
5. Click **Add User** again
6. Create the Director user:
   - Email: `director@demo.uz`
   - Password: `123456`
   - User metadata (optional): `{ "role": "director" }`

Make sure to **confirm the emails** for both users so they can login.

### Option 3: Create Profiles Manually

If the users exist in Auth but profiles aren't created, run this SQL in the Supabase SQL Editor:

```sql
INSERT INTO public.profiles (id, name, email, role)
SELECT 
  u.id,
  'Demo CTO',
  'xojiakbarr.a@gmail.com',
  'cto'::user_role
FROM auth.users u
WHERE u.email = 'xojiakbarr.a@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE id = u.id
);

INSERT INTO public.profiles (id, name, email, role)
SELECT 
  u.id,
  'Demo Director',
  'director@demo.uz',
  'director'::user_role
FROM auth.users u
WHERE u.email = 'director@demo.uz'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE id = u.id
);
```

## Testing

Once the users are created:
1. Go to the login page
2. You should see the demo credentials displayed at the bottom
3. Enter the email and password manually
4. Click "Log In"
5. You should be redirected to the dashboard

## Troubleshooting

**"Invalid login credentials" error:**
- Verify the email and password are exactly correct
- Check that the user email is confirmed in Supabase Auth
- Check that a profile exists for the user in the `profiles` table

**User doesn't appear in dashboard:**
- Make sure the profile has the correct role (`cto` or `director`)
- Check Row Level Security (RLS) policies allow access
