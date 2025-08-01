# Payfast Signature Debug Guide

## Common Causes of "Generated signature does not match submitted signature"

### 1. **URL Encoding Issues**
- **Problem**: Double encoding or incorrect encoding of special characters
- **Solution**: Don't use `encodeURIComponent()` in signature generation
- **Fix Applied**: Removed URL encoding from signature generation

### 2. **Passphrase Issues** 
- **Problem**: Including empty passphrase or wrong passphrase
- **Solution**: For sandbox, don't include passphrase. For production, ensure it matches exactly
- **Fix Applied**: Only include passphrase if not empty and not in sandbox mode

### 3. **Special Characters in Data**
- **Problem**: Special characters in names, descriptions cause encoding issues
- **Solution**: Clean strings before sending to Payfast
- **Fix Applied**: Added `cleanString()` function to sanitize data

### 4. **Parameter Ordering**
- **Problem**: Parameters not in alphabetical order
- **Solution**: Always sort parameters alphabetically
- **Fix Applied**: Using `.sort()` on parameter keys

## Testing Your Signature

### Step 1: Use the Test Endpoint

Call the test signature endpoint to verify your signature generation:

```bash
curl -X POST http://localhost:3000/api/payments/payfast/test-signature \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Step 2: Compare with Manual Calculation

For sandbox testing, use these exact values:
- **Merchant ID**: `10000100`
- **Merchant Key**: `46f0cd694581a`  
- **Passphrase**: Leave empty

Expected parameter string (without passphrase):
```
amount=100.00&cancel_url=https://example.com/cancel&item_name=Test Order&merchant_id=10000100&merchant_key=46f0cd694581a&notify_url=https://example.com/notify&return_url=https://example.com/return
```

### Step 3: Verify Environment Variables

Ensure your `.env.local` has correct values:

```bash
# For Sandbox Testing
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=
PAYFAST_SANDBOX=true
```

### Step 4: Check Console Logs

The updated code now logs:
- Payment data being sent
- Parameter string used for signature
- Generated signature

Check your browser console and server logs for these debug messages.

## Fixes Applied

### 1. **Signature Generation Fixed**

**Before:**
```typescript
.map(key => `${key}=${encodeURIComponent(data[key].toString().trim())}`)
```

**After:**
```typescript  
.map(key => {
  const value = data[key].toString().trim()
  return `${key}=${value}`
})
```

### 2. **Passphrase Handling Fixed**

**Before:**
```typescript
const signature = generatePayfastSignature(paymentData, passphrase)
```

**After:**
```typescript
const signature = generatePayfastSignature(paymentData, sandbox ? undefined : passphrase)
```

### 3. **String Cleaning Added**

```typescript
item_name: cleanString(description || `Order ${order.order_number}`),
name_first: cleanString(firstName),
name_last: cleanString(lastName),
```

### 4. **Debug Logging Added**

```typescript
console.log('Payfast payment data:', paymentData)
console.log('Payfast signature string:', paramString)
console.log('Generated signature:', signature)
```

## Common Sandbox Issues

### Issue: Wrong Credentials
- Use exactly: `merchant_id=10000100` and `merchant_key=46f0cd694581a`
- Don't add extra spaces or characters

### Issue: Including Passphrase in Sandbox
- For sandbox testing, **DO NOT** include passphrase in signature
- Leave `PAYFAST_PASSPHRASE` empty or undefined

### Issue: Special Characters
- Avoid special characters in item names and descriptions
- Use only alphanumeric characters, spaces, hyphens, underscores, and periods

## Testing Checklist

- [ ] Environment variables are set correctly
- [ ] Using exact sandbox credentials
- [ ] Passphrase is empty for sandbox
- [ ] No special characters in item names
- [ ] Check console logs for signature string
- [ ] Compare generated signature with expected

## If Still Having Issues

1. **Enable debug mode**: Check server and browser console logs
2. **Test with minimal data**: Use the test endpoint with simple values
3. **Compare signatures manually**: Calculate MD5 hash of parameter string manually
4. **Check Payfast documentation**: Verify against latest Payfast requirements

The signature error should now be resolved! 🔧