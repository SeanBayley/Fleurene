# Payfast Payment Integration Setup Guide

This guide explains how to set up and configure Payfast payment integration for your e-commerce application.

## Prerequisites

1. **Payfast Account**: Create an account at [Payfast](https://www.payfast.co.za)
2. **Merchant Account**: Set up your merchant account and get your credentials
3. **Domain Verification**: Verify your domain with Payfast for production use

## Environment Setup

### 1. Configure Environment Variables

Copy the Payfast configuration from `env.example` to your `.env.local` file:

```bash
# Payment processing - Payfast
PAYFAST_MERCHANT_ID=your-merchant-id
PAYFAST_MERCHANT_KEY=your-merchant-key
PAYFAST_PASSPHRASE=your-passphrase
PAYFAST_SANDBOX=true
```

### 2. Get Your Payfast Credentials

#### For Sandbox Testing:
- **Merchant ID**: `10000100`
- **Merchant Key**: `46f0cd694581a`
- **Passphrase**: Leave empty for sandbox testing
- **Sandbox Mode**: Set `PAYFAST_SANDBOX=true`

#### For Production:
1. Log into your Payfast merchant dashboard
2. Go to **Settings** > **Integration**
3. Copy your **Merchant ID** and **Merchant Key**
4. Set a **Passphrase** (recommended for security)
5. Set `PAYFAST_SANDBOX=false`

### 3. Configure Webhooks in Payfast Dashboard

In your Payfast merchant dashboard:

1. Go to **Settings** > **Integration**
2. Set **Notify URL** to: `https://yourdomain.com/api/payments/payfast/webhook`
3. Enable **Order notifications**
4. Save the settings

## Database Setup

Run the order status history SQL script:

```bash
# Apply the database schema
psql -d your_database -f sql-commands/08-create-order-status-history.sql
```

This creates the `order_status_history` table to track payment status changes.

## How the Integration Works

### Payment Flow

1. **Order Creation**: Customer fills out checkout form
2. **Payment Initialization**: Order is created with `payment_status = 'pending'`
3. **Payfast Redirect**: Customer is redirected to Payfast payment page
4. **Payment Processing**: Customer completes payment on Payfast
5. **Webhook Notification**: Payfast sends payment result to your webhook
6. **Order Update**: Your system updates order status based on payment result
7. **Customer Redirect**: Customer returns to confirmation page

### API Endpoints

#### `/api/payments/payfast/initialize` (POST)
Initializes a Payfast payment session.

**Request Body:**
```json
{
  "orderId": "uuid",
  "amount": 149.99,
  "description": "Order #12345",
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "https://sandbox.payfast.co.za/eng/process",
  "paymentData": {
    "merchant_id": "10000100",
    "merchant_key": "46f0cd694581a",
    "amount": "149.99",
    "item_name": "Order #12345",
    "signature": "generated-md5-hash",
    // ... other payment fields
  },
  "orderId": "uuid",
  "orderNumber": "ORD-12345"
}
```

#### `/api/payments/payfast/webhook` (POST)
Handles payment notifications from Payfast.

**Payfast sends:**
- Payment status (COMPLETE, FAILED, CANCELLED)
- Transaction details
- Order information
- Security signature

#### `/api/payments/payfast/retry` (POST)
Allows customers to retry failed payments.

**Request Body:**
```json
{
  "orderId": "uuid"
}
```

## Security Features

### Signature Validation
All Payfast communications are validated using MD5 signatures:

1. **Outgoing Payments**: Generated signature ensures data integrity
2. **Incoming Webhooks**: Validates Payfast signature to prevent fraud
3. **Passphrase Protection**: Additional security layer (recommended)

### Order Verification
- Orders are validated before payment initialization
- Duplicate payment attempts are prevented
- Payment status is tracked throughout the process

## Testing

### Sandbox Testing

1. Set `PAYFAST_SANDBOX=true` in your environment
2. Use sandbox credentials
3. Test with sandbox card details:
   - **Card Number**: `4000000000000002`
   - **Expiry**: Any future date
   - **CVV**: Any 3 digits

### Test Scenarios

1. **Successful Payment**: Complete payment flow
2. **Failed Payment**: Test payment failure handling
3. **Cancelled Payment**: Test payment cancellation
4. **Webhook Failures**: Test webhook retry mechanisms

## Production Checklist

### Before Going Live:

- [ ] Update environment variables with production credentials
- [ ] Set `PAYFAST_SANDBOX=false`
- [ ] Configure production webhook URL in Payfast dashboard
- [ ] Test with small amounts first
- [ ] Verify SSL certificate is valid
- [ ] Test webhook endpoint accessibility
- [ ] Monitor payment logs for errors

### Security Checklist:

- [ ] Use HTTPS for all payment pages
- [ ] Set strong passphrase in Payfast settings
- [ ] Validate all webhook signatures
- [ ] Log payment activities for audit trails
- [ ] Implement rate limiting on payment endpoints
- [ ] Regular security updates

## Monitoring and Logs

### Payment Monitoring

Monitor these key metrics:
- Payment success rate
- Failed payment reasons
- Webhook delivery status
- Customer payment journey completion

### Logging

The integration logs:
- Payment initialization attempts
- Webhook notifications received
- Signature validation results
- Order status changes
- Error conditions

Check your application logs for:
```
Payfast webhook received: {...}
Payment completed for order ORD-12345
Invalid Payfast signature
```

## Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid signature | Wrong credentials or passphrase | Verify credentials in .env |
| Order not found | Invalid order ID | Check order creation process |
| Payment system not configured | Missing environment variables | Set all required env vars |
| Webhook timeout | Server not responding | Check server logs and connectivity |

### Customer-Facing Errors

The system handles these customer scenarios:
- Payment cancellation with retry option
- Payment failure with error message
- Network timeouts with retry mechanism
- Invalid payment data with user feedback

## Support and Troubleshooting

### Payfast Support
- Documentation: [Payfast Integration Guide](https://developers.payfast.co.za/)
- Support Email: support@payfast.co.za
- Merchant Portal: [https://merchant.payfast.co.za/](https://merchant.payfast.co.za/)

### Common Issues

1. **Webhook not receiving notifications**
   - Check firewall settings
   - Verify webhook URL is accessible
   - Test webhook endpoint directly

2. **Signature validation failing**
   - Verify passphrase matches Payfast settings
   - Check parameter encoding
   - Ensure all required fields are included

3. **Payment redirects not working**
   - Verify return URLs are correct
   - Check for HTTPS requirements
   - Test with different browsers

## Additional Features

### Payment Retry
Customers can retry failed payments from the confirmation page without creating a new order.

### Order Status Tracking
Complete payment history is tracked in the `order_status_history` table.

### Guest Checkout
Anonymous customers can complete payments without creating accounts.

### Multi-Currency Support
The integration supports ZAR (South African Rand) by default but can be extended for other currencies supported by Payfast.

---

## Quick Start Commands

```bash
# 1. Set up environment variables
cp env.example .env.local
# Edit .env.local with your Payfast credentials

# 2. Apply database migrations
psql -d your_database -f sql-commands/08-create-order-status-history.sql

# 3. Test the integration
npm run dev

# 4. Test a payment with sandbox credentials
# Go to /checkout and complete a test order
```

Your Payfast integration is now ready! 🎉