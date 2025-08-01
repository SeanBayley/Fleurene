# Testing Payfast Sandbox on Production Domain

## Why This Works Perfectly

Using your production site to test Payfast sandbox is actually the **ideal solution** when:
- ✅ Your production domain is publicly accessible
- ✅ You use sandbox credentials (no real payments)
- ✅ You don't want to deal with ngrok/tunneling
- ✅ You want to test the complete webhook flow

## Setup Instructions

### 1. **Deploy with Sandbox Configuration**

Set these environment variables in your production environment:

```bash
# Payfast Sandbox Configuration (SAFE for production domain)
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=
PAYFAST_SANDBOX=true

# Your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-supabase-key

# Leave these empty - the system will auto-detect your production domain
PAYFAST_PUBLIC_URL=
NGROK_URL=
```

### 2. **Platform-Specific Deployment**

#### **Vercel Deployment**
```bash
# Set environment variables
vercel env add PAYFAST_MERCHANT_ID 10000100
vercel env add PAYFAST_MERCHANT_KEY 46f0cd694581a
vercel env add PAYFAST_PASSPHRASE ""
vercel env add PAYFAST_SANDBOX true

# Deploy
vercel --prod
```

#### **Netlify Deployment**
In your Netlify dashboard:
1. Go to Site Settings > Environment Variables
2. Add the sandbox variables above
3. Deploy your site

#### **Railway/Render/DigitalOcean**
Add the environment variables in your platform's dashboard and deploy.

### 3. **Your URLs Will Be**

With your production domain (e.g., `https://yoursite.com`):

- **Return URL**: `https://yoursite.com/checkout/confirmation?payment=success&order=...`
- **Cancel URL**: `https://yoursite.com/checkout?payment=cancelled&order=...`  
- **Webhook URL**: `https://yoursite.com/api/payments/payfast/webhook`

## What Happens During Testing

### ✅ **Safe Sandbox Behavior**
- **Payment Page**: Shows Payfast sandbox (clearly marked as test)
- **Test Cards**: Use `4000000000000002` and other test numbers
- **No Real Charges**: All transactions are simulated
- **Full Webhook Flow**: Complete payment notifications work
- **Order Processing**: Your system processes orders normally (but marked as test)

### 🎯 **Perfect for Testing**
- Database operations (orders, users, etc.)
- Email notifications (if configured)
- Webhook handling and signature validation
- Complete user experience flow
- Error handling and edge cases

## Console Output You'll See

When testing on production with sandbox mode:

```
🚀 Using production domain for Payfast redirects: https://yoursite.com
🧪 SANDBOX MODE: Safe to test on production - no real payments will be processed
Payfast payment data: { merchant_id: '10000100', ... }
Generated signature: abc123...
```

## Testing Checklist

### Before Testing:
- [ ] Production site is deployed and accessible
- [ ] Environment variables are set to sandbox values
- [ ] `PAYFAST_SANDBOX=true` is confirmed
- [ ] Database is ready for test orders

### During Testing:
- [ ] Payment redirects to Payfast sandbox page
- [ ] Test card numbers work (4000000000000002)
- [ ] Successful payments redirect back correctly
- [ ] Cancelled payments show proper messaging
- [ ] Webhooks are received and processed
- [ ] Orders are created with correct status

### Test Scenarios:
- [ ] Complete successful payment
- [ ] Cancel payment and retry
- [ ] Test with different amounts
- [ ] Test guest vs logged-in user checkout
- [ ] Verify webhook signature validation

## When to Switch to Production

Once your sandbox testing is complete:

1. **Get Production Credentials**:
   ```bash
   PAYFAST_MERCHANT_ID=your-real-merchant-id
   PAYFAST_MERCHANT_KEY=your-real-merchant-key
   PAYFAST_PASSPHRASE=your-secure-passphrase
   PAYFAST_SANDBOX=false
   ```

2. **Update Environment Variables** in your deployment platform

3. **Test with Small Amounts** first (like R1.00)

4. **Monitor Carefully** for the first few real transactions

## Advantages of This Approach

### ✅ **Benefits vs ngrok**
- **No antivirus conflicts** (your main issue!)
- **No tunnel setup/maintenance**
- **Stable URLs** (no expiring tunnels)
- **Real production environment testing**
- **Proper SSL certificates**

### ✅ **Benefits vs Local Testing**
- **Complete webhook testing**
- **Real network conditions**
- **Production-like environment**
- **No firewall/network issues**

## Security Notes

### 🔒 **This is Completely Safe Because**:
- **Sandbox Mode**: No real money is processed
- **Test Credentials**: Payfast knows these are for testing
- **Isolated Environment**: Sandbox transactions don't affect real accounts
- **Clear Marking**: Payfast sandbox pages are clearly marked as test

### 🚨 **Just Remember**:
- Switch to production credentials when going live
- Monitor the first real transactions carefully
- Keep sandbox and production environment variables separate

## Troubleshooting

### If webhooks aren't working:
1. Check your production site is accessible: `https://yoursite.com/api/payments/payfast/webhook`
2. Look at server logs for webhook requests
3. Verify Payfast can reach your domain (no IP restrictions)

### If payments aren't redirecting:
1. Check the console logs for the URLs being generated
2. Verify your domain is correctly detected
3. Test the return/cancel URLs manually

Your production domain + sandbox credentials = **Perfect testing setup!** 🎉

No antivirus hassles, no tunnel complexity, just smooth testing on your real domain with fake payments.