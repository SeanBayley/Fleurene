# 👤 User Profile System Guide

## 🏗️ Architecture Overview

Your FJ website uses the **standard Supabase authentication pattern**:

```
┌─────────────────┐    ┌──────────────────┐
│   auth.users    │    │  user_profiles   │
│  (Supabase)     │◄──►│   (Your Data)    │
└─────────────────┘    └──────────────────┘
     │                          │
     ├─ id (UUID)               ├─ id (UUID) ← Same ID
     ├─ email                   ├─ email
     ├─ password_hash           ├─ first_name
     ├─ email_confirmed         ├─ last_name
     ├─ created_at              ├─ role (customer/admin)
     └─ raw_user_meta_data      ├─ avatar_url
                                ├─ phone
                                └─ created_at
```

## ✅ What You Already Have (Super Flexible!)

### 1. **Automatic Profile Creation**
When a user signs up, a trigger automatically creates their profile:

```sql
-- This trigger runs automatically on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. **Flexible User Profile Schema**
Your `user_profiles` table is fully customizable:

```sql
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

### 3. **Role-Based Access Control**
Admin users can manage everything:

```sql
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## 🔧 Making It Even More Flexible

### Option 1: Add More Profile Fields

```sql
-- Add new columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS address JSONB DEFAULT '{}'::jsonb;
```

### Option 2: Create Additional Profile Tables

```sql
-- Customer-specific data
CREATE TABLE public.customer_profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  loyalty_points INTEGER DEFAULT 0,
  preferred_payment_method TEXT,
  shipping_addresses JSONB DEFAULT '[]'::jsonb,
  order_history JSONB DEFAULT '[]'::jsonb
);

-- Admin-specific data
CREATE TABLE public.admin_profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  permissions JSONB DEFAULT '{}'::jsonb,
  department TEXT,
  access_level INTEGER DEFAULT 1
);
```

### Option 3: Dynamic Profile Fields

```sql
-- Flexible key-value storage
CREATE TABLE public.user_profile_fields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_value TEXT,
  field_type TEXT DEFAULT 'text', -- text, number, boolean, json
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Enhanced Registration Process

Here's how to capture more data during signup:

### Frontend Registration Form
```typescript
const handleSignup = async (formData: {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  date_of_birth?: string
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth
      }
    }
  })
}
```

### Enhanced Trigger Function
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create main profile
  INSERT INTO public.user_profiles (
    id, 
    email, 
    first_name, 
    last_name,
    phone,
    date_of_birth
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'date_of_birth', '')::DATE
  );
  
  -- Create preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Create customer profile if not admin
  INSERT INTO public.customer_profiles (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🎯 Current Status & Next Steps

### ✅ What's Already Working
1. **Two-table system** (auth.users + user_profiles)
2. **Automatic profile creation** via triggers
3. **Role-based access control** (customer/admin)
4. **Flexible schema** ready for expansion

### 🔄 What You Need to Do Now

1. **Run the database setup script** to create tables:
   ```bash
   # Execute PHASE_1_DATABASE_SETUP.sql in Supabase
   ```

2. **Disable email confirmation** (quick fix):
   - Supabase Dashboard → Authentication → Settings
   - Toggle OFF "Enable email confirmations"

3. **Test user registration**:
   - Register a new user
   - Check that profile is created automatically

4. **Set yourself as admin**:
   ```sql
   UPDATE public.user_profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@gmail.com';
   ```

## 🔧 Profile Management API

Here's how to work with profiles in your app:

### Get User Profile
```typescript
const { data: profile } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', user.id)
  .single()
```

### Update Profile
```typescript
const { error } = await supabase
  .from('user_profiles')
  .update({
    first_name: 'John',
    last_name: 'Doe',
    phone: '+1234567890'
  })
  .eq('id', user.id)
```

### Admin: View All Users
```typescript
// Only works if current user is admin
const { data: allUsers } = await supabase
  .from('user_profiles')
  .select('*')
  .order('created_at', { ascending: false })
```

## 🎨 Profile Enhancement Ideas

### E-Commerce Specific Fields
```sql
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS
  -- Shopping preferences
  preferred_currency TEXT DEFAULT 'USD',
  preferred_language TEXT DEFAULT 'en',
  marketing_consent BOOLEAN DEFAULT FALSE,
  
  -- Business info (for B2B customers)
  company_name TEXT,
  tax_id TEXT,
  business_type TEXT,
  
  -- Social
  instagram_handle TEXT,
  referral_code TEXT UNIQUE,
  referred_by TEXT;
```

### Profile Completion Tracking
```sql
-- Function to calculate profile completion percentage
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  completion_score INTEGER := 0;
  profile_data RECORD;
BEGIN
  SELECT * INTO profile_data FROM public.user_profiles WHERE id = user_id;
  
  -- Basic info (40 points)
  IF profile_data.first_name IS NOT NULL AND profile_data.first_name != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_data.last_name IS NOT NULL AND profile_data.last_name != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_data.phone IS NOT NULL AND profile_data.phone != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_data.avatar_url IS NOT NULL AND profile_data.avatar_url != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  -- Additional fields (60 points total)
  -- Add more checks as needed
  
  RETURN completion_score;
END;
$$ LANGUAGE plpgsql;
```

## 🚨 Security Best Practices

### Row Level Security (RLS)
Your tables already have RLS enabled with proper policies:

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can see everything
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Data Validation
```sql
-- Add constraints for data integrity
ALTER TABLE public.user_profiles 
ADD CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$'),
ADD CONSTRAINT valid_role CHECK (role IN ('customer', 'admin', 'moderator'));
```

---

## 🎯 The Bottom Line

Your system is **already very flexible**! The `auth.users` + `user_profiles` pattern is the industry standard because:

✅ **Secure** - Auth data is protected by Supabase  
✅ **Flexible** - You control your profile schema  
✅ **Scalable** - Easy to add fields and relationships  
✅ **Maintainable** - Clear separation of concerns  

The key is that you can add **any fields you want** to `user_profiles` and create **additional related tables** for specific use cases (customer data, admin data, etc.). 