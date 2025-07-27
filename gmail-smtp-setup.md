# 📧 Gmail SMTP Setup for Supabase

## ⚠️ IMPORTANT: Gmail SMTP Limitations

**Supabase Warning Explained:**
Gmail SMTP is designed for personal email sending, not transactional emails. This can cause:
- Email delivery delays
- Emails going to spam
- Rate limiting issues
- Poor deliverability for auth emails

## 🚀 Recommended Solutions (Choose One)

### Option 1: Disable Email Confirmation (Quick Fix)
**For development/testing only:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/okejhghftdsvvtsjtwbe)
2. Navigate to **Authentication** → **Settings**
3. Under **User Signups**, toggle OFF **Enable email confirmations**
4. Save settings

Now users can register without email verification.

### Option 2: Use Resend (Professional Solution)
**Best for production:**

1. Sign up at [Resend.com](https://resend.com) (free tier: 3,000 emails/month)
2. Get your API key
3. In Supabase Dashboard → **Authentication** → **Settings** → **SMTP Settings**:

```
Enable Custom SMTP: ✅ Enabled
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Password: [Your Resend API Key]
Sender Name: FJ Fleurene
Sender Email: noreply@yourdomain.com
```

### Option 3: Use SendGrid (Enterprise Solution)
**For high volume:**

1. Sign up at [SendGrid.com](https://sendgrid.com) (free tier: 100 emails/day)
2. Create API key
3. In Supabase Dashboard:

```
Enable Custom SMTP: ✅ Enabled
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [Your SendGrid API Key]
Sender Name: FJ Fleurene
Sender Email: noreply@yourdomain.com
```

## 🔧 Method 1: Supabase Dashboard (Gmail - With Limitations)

### Step 1: Generate Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select **Mail** → **Other (Custom name)**
5. Name it "Supabase" and generate
6. Copy the 16-character password (format: `abcd efgh ijkl mnop`)

### Step 2: Configure in Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/okejhghftdsvvtsjtwbe)
2. Navigate to **Authentication** → **Settings** → **SMTP Settings**
3. Fill in these settings:

```
Enable Custom SMTP: ✅ Enabled
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Password: [Your 16-character app password]
Sender Name: FJ Fleurene
Sender Email: your-email@gmail.com
```

4. Click **Save**

### ⚠️ Gmail SMTP Troubleshooting

**If using Gmail SMTP and emails aren't coming through:**

1. **Check Gmail "Less Secure App Access"** (if available)
2. **Verify App Password**: Must be 16 characters without spaces
3. **Check Gmail Sent Folder**: Emails might be sent but not delivered
4. **Try Different Port**: Use 465 with SSL instead of 587
5. **Check Recipient Spam Folder**
6. **Gmail Rate Limits**: Gmail may throttle/block bulk emails

**Alternative Gmail Settings to Try:**
```
SMTP Host: smtp.gmail.com
SMTP Port: 465
Security: SSL/TLS (not STARTTLS)
```

## 🔧 Method 2: Environment Variables (Advanced)

Add to your `.env.local` file:

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_SENDER_NAME=FJ Fleurene
SMTP_ADMIN_EMAIL=your-email@gmail.com
```

## ✅ Testing Your Setup

### Test Email Sending
1. Try registering a new user on your website
2. Check your Gmail inbox for the confirmation email
3. The email should come from "FJ Fleurene <your-email@gmail.com>"

### Troubleshooting

**If emails aren't sending:**
1. **Check App Password**: Make sure you used the app password, not your regular Gmail password
2. **Verify 2FA**: Gmail requires 2-Factor Authentication for app passwords
3. **Check Spam**: Confirmation emails might go to spam initially
4. **Port Issues**: Try port 465 with SSL if 587 doesn't work

**Common Errors:**
- `Authentication failed`: Wrong app password
- `Connection refused`: Firewall blocking port 587
- `Invalid sender`: Email address mismatch

## 🎨 Customizing Email Templates

After SMTP is working, you can customize email templates:

1. Go to **Authentication** → **Email Templates**
2. Customize:
   - **Confirm Signup**: Welcome email with confirmation link
   - **Magic Link**: Passwordless login email
   - **Change Email Address**: Email change confirmation
   - **Reset Password**: Password reset email

### Example Custom Template
```html
<h2>Welcome to FJ Fleurene! ✨</h2>
<p>Thank you for joining our magical community.</p>
<p>Click the link below to confirm your email:</p>
<a href="{{ .ConfirmationURL }}">Confirm Email</a>
<p>With love,<br>The FJ Team 💜</p>
```

## 🚀 Next Steps

**Recommended Path:**
1. 🔥 **Quick Fix**: Disable email confirmation for now
2. ✅ Run the `PHASE_1_DATABASE_SETUP.sql` script
3. ✅ Set your user role to 'admin'
4. ✅ Access the admin dashboard
5. ✅ Begin Phase 1 development
6. 🔄 **Later**: Set up proper email service (Resend/SendGrid)

## 📧 SMTP Provider Comparison

| Provider | Free Tier | Best For | Deliverability |
|----------|-----------|----------|----------------|
| Gmail | Limited | Development only | Poor for transactional |
| Resend | 3,000/month | Small-medium apps | Excellent |
| SendGrid | 100/day | Enterprise | Excellent |
| Mailgun | 5,000/month | High volume | Excellent |

## 📧 Gmail SMTP Settings Reference

| Setting | Value |
|---------|-------|
| Host | smtp.gmail.com |
| Port | 587 (TLS) or 465 (SSL) |
| Security | STARTTLS (587) or SSL/TLS (465) |
| Authentication | Yes |
| Username | your-email@gmail.com |
| Password | App password (16 characters) |

---

**Note**: For production, use a dedicated transactional email service. Gmail SMTP should only be used for development/testing. 