# Demo Authentication System Setup Guide

## Overview
Complete authentication system with demo accounts, role-based access control, and user management for EduCenter.

## Demo Accounts

Three demo accounts are automatically available for testing:

### Director
- **Phone**: 998901111111
- **Email**: 998901111111@demo.educenter.uz
- **Password**: 123456
- **Role**: director

### CTO
- **Phone**: 998902222222
- **Email**: 998902222222@demo.educenter.uz
- **Password**: 123456
- **Role**: cto

### Academic Manager
- **Phone**: 998903333333
- **Email**: 998903333333@demo.educenter.uz
- **Password**: 123456
- **Role**: academic_manager

## Features Implemented

### 1. Demo Login Section (Login Page)
- **Location**: `/app/auth/login/page.tsx`
- Added bottom section showing demo accounts
- "Demo bilan kirish" (Demo Login) button reveals demo account cards
- Click any demo account to auto-fill form and login
- Message: "Agar akkaunt bo'lmasa, demo orqali kiring" (If you don't have an account, enter via demo)

### 2. Auto-Create Demo Users
- **Endpoint**: `/api/seed-demo-users` (POST)
- Automatically creates demo users in database when not present
- Uses Supabase auth admin API with service role key
- Auto-confirms email for demo accounts
- Assigns proper roles (director, cto, academic_manager)

### 3. Role Management System
- **Location**: `/admin/users` page
- **Access**: Director and CTO only
- **Features**:
  - View all users with their current roles
  - Create new users with email, password, name, phone, and role
  - Edit user roles from dropdown
  - Delete users with confirmation
  - Real-time error and success messages

### 4. Sign-Up Improvements
- **Location**: `/app/auth/sign-up/page.tsx`
- Added phone field
- Role selection dropdown with options:
  - Administrator (default)
  - Academic Manager
  - Academic Director
  - Marketing Manager
  - Teacher
- Helper text: "Administrators can manage user roles after signup"

### 5. Login Enhancements
- **Location**: `/app/auth/login/page.tsx`
- Updated placeholder to accept both email and phone formats
- Proper password validation and error handling
- Integrated demo account quick-login

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'administrator',
  avatar_url TEXT,
  base_salary DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### User Roles (ENUM)
- director
- cto
- academic_director
- academic_manager
- marketing_manager
- administrator
- teacher

## API Endpoints

### Seed Demo Users
**POST** `/api/seed-demo-users`

Automatically creates demo users if they don't exist.

**Request Body**:
```json
{
  "demoAccounts": [
    {
      "name": "Demo Director",
      "phone": "998901111111",
      "password": "123456",
      "role": "director"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Demo users seeded"
}
```

## Row Level Security (RLS)

All role-based access is enforced through Supabase RLS policies:

- **profiles_select_own**: Users can view their own profile
- **profiles_select_admin**: Directors/CTOs can view all profiles
- Check-in policies limit access to own data
- Task visibility based on assignment
- Budget requests visible to own user or admin

## Usage Flow

### First Time User
1. Go to `/auth/login`
2. See "Demo bilan kirish" section at bottom
3. Click to expand demo accounts
4. Click "Demo Director" card
5. Form auto-fills with credentials
6. Click "Log In" to access dashboard
7. Get full director permissions

### Creating Real Users
1. Director/CTO logs in
2. Navigate to "Foydalanuvchilar" in sidebar (goes to `/admin/users`)
3. Click "Create New User"
4. Fill in name, email, phone, password, and role
5. Click "Create User"
6. New user can login with provided credentials
7. Director/CTO can change roles anytime

### Sign Up Flow
1. New user goes to `/auth/sign-up`
2. Fills in name, email, phone, password
3. Selects role from dropdown
4. Account created with selected role
5. Director/CTO can modify role later in `/admin/users`

## Security Notes

- Demo accounts use Supabase auth service role for creation
- All demo accounts auto-confirmed for testing convenience
- Email confirmation required for real users (configurable)
- RLS policies enforce role-based access control
- Passwords hashed by Supabase auth
- Session tokens managed by Supabase middleware

## File Changes

### New Files Created
- `/app/api/seed-demo-users/route.ts` - Demo user seeding endpoint
- `/app/admin/users/page.tsx` - User management page
- `/DEMO_AUTH_SETUP.md` - This documentation

### Modified Files
- `/app/auth/login/page.tsx` - Added demo login section
- `/app/auth/sign-up/page.tsx` - Added role selection and phone field
- `/components/dashboard/sidebar.tsx` - Added admin users link

## Testing Checklist

- [ ] Login page displays demo section
- [ ] Demo accounts auto-fill form correctly
- [ ] Demo login works with director account
- [ ] Dashboard loads with director permissions
- [ ] Navigate to admin users page from sidebar
- [ ] Create new user from admin panel
- [ ] Change existing user role
- [ ] Delete user with confirmation
- [ ] Sign up with new role
- [ ] New user can login

## Troubleshooting

### Demo users not appearing
- Check Supabase service role key in environment variables
- Ensure tables are created with proper schema
- Run `/api/seed-demo-users` endpoint manually

### Role not updating
- Verify user has director/cto role
- Check RLS policies allow admin access
- Confirm user profile exists in database

### Login fails
- Verify email format: `{phone}@demo.educenter.uz`
- Check password is exactly "123456"
- Ensure user is confirmed in Supabase auth
