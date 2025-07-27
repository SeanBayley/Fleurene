# 🗄️ Database Setup Guide for FJ E-Commerce

## 📋 Overview
This guide will help you set up the initial database tables for your FJ website using your existing SQL scripts.

## 🔗 Supabase Project Information
- **Project URL**: https://okejhghftdsvvtsjtwbe.supabase.co
- **Status**: Ready for table setup

## 📝 Step-by-Step Setup

### Step 1: Access Supabase SQL Editor
1. Go to [your Supabase project](https://supabase.com/dashboard/project/okejhghftdsvvtsjtwbe)
2. Navigate to **SQL Editor** in the left sidebar
3. Click **+ New Query**

### Step 2: Run SQL Scripts in Order

#### 🏗️ Script 1: Create User Profiles Table
Copy and paste this SQL into the Supabase SQL Editor:

```sql
-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

Click **Run** to execute.

---

#### 🧠 Script 2: Create Quiz Results Table
```sql
-- Create quiz results table
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  primary_archetype TEXT NOT NULL,
  archetype_breakdown JSONB NOT NULL,
  question_count INTEGER NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own quiz results" ON public.quiz_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results" ON public.quiz_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

Click **Run** to execute.

---

#### ⚙️ Script 3: Create User Preferences Table
```sql
-- Create user preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  favorite_collections JSONB DEFAULT '[]'::jsonb,
  style_preferences JSONB DEFAULT '{}'::jsonb,
  newsletter_subscribed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

Click **Run** to execute.

---

#### 🔧 Script 4: Create Helper Functions
```sql
-- Create a function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create user profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

Click **Run** to execute.

---

## 🎯 Next: E-Commerce Tables for Phase 1

Once the basic tables are set up, we'll need to add e-commerce specific tables. Here are the tables we'll need for **Phase 1** of our roadmap:

### Admin Roles Table
```sql
-- Add admin role column to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));

-- Update policy to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Products Table (Phase 2 Ready)
```sql
-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  subcategory TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  stock_quantity INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone can view active products
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (status = 'active');

-- Only admins can manage products
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## ✅ Verification Steps

### 1. Check Connection Status
- Go to your website: http://localhost:3000
- Look for the connection test widget in the bottom-right corner
- It should show **✅ Connected** if tables were created successfully

### 2. Verify Tables in Supabase
1. Go to **Table Editor** in your Supabase dashboard
2. You should see:
   - `user_profiles`
   - `quiz_results` 
   - `user_preferences`
   - `products` (if you ran the e-commerce setup)

### 3. Test Authentication
- Try signing up/logging in on your website
- Check if user profiles are created automatically

---

## 🚨 Troubleshooting

### Connection Still Shows "Not Connected"
1. **Check Table Names**: Ensure tables are created in the `public` schema
2. **RLS Policies**: Make sure Row Level Security policies are enabled
3. **Supabase Service Key**: Verify the service key has proper permissions

### SQL Errors
- **Foreign Key Errors**: Make sure to run scripts in the correct order
- **Permission Errors**: Check that you're logged in as the project owner
- **Syntax Errors**: Copy the SQL exactly as provided

---

## 📈 Next Steps

Once your database is connected:

1. **✅ Update Roadmap**: Mark Phase 1 database setup as complete
2. **🔄 Remove Connection Test**: Clean up the temporary connection widget
3. **🚀 Start Phase 1**: Begin implementing admin role system
4. **📊 Test Features**: Verify user registration and profile creation work

---

*Need help? Check the connection status on your website or review the SQL scripts in your `sql-commands/` directory.* 