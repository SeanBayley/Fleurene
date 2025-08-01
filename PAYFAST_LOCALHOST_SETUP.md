# Payfast Local Development Setup

## The Problem with Localhost

Payfast **cannot** send webhooks to `localhost` URLs because:
1. Localhost is not accessible from the internet
2. Payfast's servers cannot reach your local development environment
3. Your return/cancel URLs won't work for testing

## Solution 1: Use ngrok (Recommended for Development)

### Install ngrok
```bash
# Download from https://ngrok.com/ or use package manager
npm install -g ngrok
# or
brew install ngrok  # macOS
```

### Setup ngrok
1. **Create a free ngrok account** at https://ngrok.com/
2. **Get your auth token** from the dashboard
3. **Authenticate ngrok:**
   ```bash
   ngrok authtoken YOUR_AUTH_TOKEN
   ```

### Start your development server and ngrok
```bash
# Terminal 1: Start your Next.js app
npm run dev

# Terminal 2: Start ngrok tunnel
ngrok http 3000
```

### Configure your environment
Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and add to your `.env.local`:

```bash
# Payfast configuration
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=
PAYFAST_SANDBOX=true

# Public URL for development
NGROK_URL=https://abc123.ngrok.io
```

### Your URLs will now be:
- **Return URL**: `https://abc123.ngrok.io/checkout/confirmation?payment=success&order=...`
- **Cancel URL**: `https://abc123.ngrok.io/checkout?payment=cancelled&order=...`
- **Webhook URL**: `https://abc123.ngrok.io/api/payments/payfast/webhook`

## Solution 2: Deploy to a Test Environment

### Deploy to Vercel (Free)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy your app
vercel

# Set environment variables
vercel env add PAYFAST_MERCHANT_ID
vercel env add PAYFAST_MERCHANT_KEY  
vercel env add PAYFAST_SANDBOX
```

### Use your Vercel URL
Your app will be available at something like `https://your-app-name.vercel.app`

## Solution 3: Use a Local Public URL Service

### LocalTunnel (Alternative to ngrok)
```bash
npm install -g localtunnel

# Start your app
npm run dev

# In another terminal
lt --port 3000 --subdomain your-unique-name
```

## Updated Code Features

### 1. **Automatic URL Detection**
The code now automatically detects localhost and uses your configured public URL:

```typescript
if (host?.includes('localhost') || host?.includes('127.0.0.1')) {
  const publicUrl = process.env.PAYFAST_PUBLIC_URL || process.env.NGROK_URL
  if (publicUrl) {
    baseUrl = publicUrl
  } else {
    console.warn('⚠️  LOCALHOST DETECTED: Set PAYFAST_PUBLIC_URL or NGROK_URL')
  }
}
```

### 2. **Fixed Custom String Fields**
Payfast custom fields only allow alphanumeric characters, so UUIDs with dashes are cleaned:

```typescript
custom_str1: orderId.replace(/-/g, ''), // Remove dashes: b862a9a38336...
custom_str2: order.order_number.replace(/[^a-zA-Z0-9]/g, '')
```

### 3. **Smart Order ID Recovery**
The webhook can reconstruct the original UUID from the cleaned custom string:

```typescript
// If order ID has no dashes, reconstruct it
if (str.length === 32) {
  cleanOrderId = `${str.slice(0,8)}-${str.slice(8,12)}-${str.slice(12,16)}-${str.slice(16,20)}-${str.slice(20,32)}`
}
```

## Quick Setup Guide

### For ngrok (Recommended):

1. **Install and setup ngrok** (see above)
2. **Start your app**: `npm run dev`
3. **Start ngrok**: `ngrok http 3000`
4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)
5. **Add to .env.local**:
   ```
   NGROK_URL=https://abc123.ngrok.io
   ```
6. **Restart your development server**
7. **Test the payment flow**

### Environment Variables Template:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key

# Payfast Sandbox
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=
PAYFAST_SANDBOX=true

# Public URL for development (choose one)
NGROK_URL=https://your-subdomain.ngrok.io
# OR
PAYFAST_PUBLIC_URL=https://your-domain.com
```

## Testing Checklist

- [ ] ngrok is running and accessible
- [ ] NGROK_URL is set in environment
- [ ] Development server restarted after adding URL
- [ ] Test payment shows correct URLs in Payfast
- [ ] Webhook endpoint is publicly accessible
- [ ] Custom strings are alphanumeric only

## Troubleshooting

### URLs still showing localhost?
- Restart your development server after adding NGROK_URL
- Check console logs for "Using public URL for Payfast redirects"

### ngrok tunnel expired?
- Free ngrok tunnels expire after 8 hours
- Restart ngrok and update your NGROK_URL

### Webhook not receiving notifications?
- Test webhook URL directly: `https://your-ngrok-url.ngrok.io/api/payments/payfast/webhook`
- Check ngrok dashboard for incoming requests
- Verify webhook URL in Payfast dashboard

Your integration should now work properly with public URLs! 🎉