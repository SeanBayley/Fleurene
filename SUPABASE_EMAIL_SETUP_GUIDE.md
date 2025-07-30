# 📧 Supabase Email Setup Guide

## 🔍 Current Status Check

Based on your codebase analysis, here's what I found:

### ✅ What's Already Working
- **Signup Flow**: Your registration API (`/api/auth/register/route.ts`) uses `supabaseServer.auth.signUp()`
- **Auth Context**: Your auth context has proper signup/signin functions
- **UI Components**: Auth modal shows "Check your email for confirmation link" message

### ❌ What Might Be Missing
- **Email Configuration**: No SMTP settings found in your environment
- **Email Templates**: No custom email templates configured
- **Email Confirmation**: May be disabled in Supabase settings

## 🧪 Testing Email Functionality

I've created a test page for you to check if emails are working:

### 1. Test Page
Visit: `http://localhost:3000/test-email`

This page will help you test:
- ✅ Signup confirmation emails
- ✅ Password reset emails  
- ✅ Magic link emails

### 2. Test API Endpoint
Use: `POST /api/test-email`

```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"action": "signup", "email": "your-email@example.com"}'
```

## 🔧 Supabase Dashboard Configuration

### Step 1: Check Email Settings
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Settings**

### Step 2: Enable Email Confirmation
In **User Signups** section:
- ✅ **Enable email confirmations**: Turn this ON
- ✅ **Enable email change confirmations**: Turn this ON

### Step 3: Configure SMTP (Choose One)

#### Option A: Use Supabase Default (Limited)
- Leave SMTP settings empty
- Uses Supabase's default email service
- Limited to 1 email per hour per email address
- Good for testing only

#### Option B: Gmail SMTP (Development)
1. Generate Gmail App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" → "Other (Custom name)"
   - Name it "Supabase" and generate

2. Configure in Supabase:
   ```
   Enable Custom SMTP: ✅ Enabled
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP User: your-email@gmail.com
   SMTP Password: [Your 16-character app password]
   Sender Name: FJ Fleurene
   Sender Email: your-email@gmail.com
   ```

#### Option C: Resend (Recommended for Production)
1. Sign up at [Resend.com](https://resend.com) (free: 3,000 emails/month)
2. Get your API key
3. Configure in Supabase:
   ```
   Enable Custom SMTP: ✅ Enabled
   SMTP Host: smtp.resend.com
   SMTP Port: 587
   SMTP User: resend
   SMTP Password: [Your Resend API Key]
   Sender Name: FJ Fleurene
   Sender Email: noreply@yourdomain.com
   ```

### Step 4: Customize Email Templates
In **Email Templates** section, customize:

#### Confirm Signup Template
```html
<h2>Welcome to FJ Fleurene! ✨</h2>
<p>Thank you for joining our magical community.</p>
<p>Click the link below to confirm your email:</p>
<a href="{{ .ConfirmationURL }}" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0;">Confirm Email</a>
<p>With love,<br>The FJ Team 💜</p>
```

#### Reset Password Template
```html
<h2>Reset Your Password 🔐</h2>
<p>You requested a password reset for your FJ Fleurene account.</p>
<p>Click the link below to set a new password:</p>
<a href="{{ .ConfirmationURL }}" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0;">Reset Password</a>
<p>If you didn't request this, you can safely ignore this email.</p>
<p>With love,<br>The FJ Team 💜</p>
```

## 🚀 Quick Fix Options

### Option 1: Disable Email Confirmation (Temporary)
If you want users to sign up without email verification:
1. Go to Supabase Dashboard → Authentication → Settings
2. Under **User Signups**, toggle OFF **Enable email confirmations**
3. Users can now register and login immediately

### Option 2: Use Magic Links (Passwordless)
Enable magic link authentication:
1. In Supabase Dashboard → Authentication → Settings
2. Enable **Enable magic links**
3. Users can sign in with just their email

## 🔍 Troubleshooting

### Emails Not Sending?
1. **Check Supabase Dashboard**:
   - Go to Authentication → Settings
   - Verify SMTP settings are correct
   - Check if email confirmations are enabled

2. **Check Email Templates**:
   - Go to Authentication → Email Templates
   - Make sure templates are properly configured

3. **Test with Different Email**:
   - Try with a different email address
   - Check spam folder
   - Some email providers block test emails

4. **Check Supabase Logs**:
   - Go to Logs → Auth
   - Look for email-related errors

### Common Errors
- `Email rate limit exceeded`: Too many emails to same address
- `SMTP authentication failed`: Wrong SMTP credentials
- `Invalid sender email`: Email address not verified with SMTP provider

## 📧 Environment Variables

Add these to your `.env.local` for better email configuration:

```env
# Site URL for email redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Custom SMTP settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🎯 Next Steps

1. **Test Current Setup**: Visit `/test-email` and test with your email
2. **Configure SMTP**: Set up Gmail or Resend SMTP in Supabase Dashboard
3. **Customize Templates**: Update email templates with your branding
4. **Test Registration**: Try registering a new user on your site
5. **Monitor Logs**: Check Supabase logs for any email errors

## 📞 Support

If emails still aren't working:
1. Check Supabase status: https://status.supabase.com
2. Review Supabase docs: https://supabase.com/docs/guides/auth/auth-email
3. Test with a different email provider
4. Consider using a professional email service like Resend or SendGrid

---

**Remember**: Supabase's default email service is limited and meant for development. For production, use a proper SMTP provider like Resend, SendGrid, or Mailgun. 