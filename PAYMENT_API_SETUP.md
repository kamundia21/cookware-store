# 💳 Payment API Integration Guide

## Backend Setup Required

To fully integrate payments, you need a backend server. Here's what to implement:

---

## 🔌 Required API Endpoints

### 1. M-Pesa Endpoints

#### `POST /api/mpesa/initiate-stk`
Initiates M-Pesa STK Push

**Request:**
```json
{
  "phone": "254712345678",
  "amount": 1000,
  "orderRef": "ORD-1234567890",
  "description": "Advenco Store Order ORD-1234567890",
  "timestamp": "2026-01-26T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "checkoutRequestId": "ws_CO_20260126103000123",
  "message": "STK Push sent successfully"
}
```

#### `POST /api/mpesa/check-status`
Checks payment status

**Request:**
```json
{
  "checkoutRequestId": "ws_CO_20260126103000123"
}
```

#### `POST /api/mpesa/callback`
Safaricom calls this with payment result (Webhook)

---

### 2. Pesapal Endpoints

#### `POST /api/pesapal/initiate`
Initiates card payment

**Request:**
```json
{
  "amount": 1000,
  "currency": "KES",
  "orderRef": "ORD-1234567890",
  "description": "Advenco Store Order",
  "customerEmail": "customer@example.com",
  "customerPhone": "0712345678",
  "customerFirstName": "John",
  "customerLastName": "Doe",
  "callbackUrl": "https://your-domain.com/payment-callback"
}
```

**Response:**
```json
{
  "success": true,
  "redirectUrl": "https://pesapal.com/pay?token=xxxx",
  "transactionTrackingId": "TRANSACTION-ID"
}
```

#### `POST /api/pesapal/callback`
Pesapal calls this with payment result (Webhook)

---

## 🔧 Backend Implementation Examples

### Node.js/Express Backend

```javascript
// M-Pesa Integration
const mpesaService = {
  async getAccessToken() {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });

    const data = await response.json();
    return data.access_token;
  },

  async initiateStkPush(phone, amount, orderRef) {
    const token = await this.getAccessToken();
    const timestamp = new Date().toISOString().replace(/[:-]/g, '').slice(0, -5);
    
    const password = Buffer.from(
      `${process.env.MPESA_SHORT_CODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const response = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORT_CODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.round(amount),
          PartyA: phone,
          PartyB: process.env.MPESA_SHORT_CODE,
          PhoneNumber: phone,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: orderRef,
          TransactionDesc: `Order ${orderRef}`
        })
      }
    );

    return response.json();
  }
};

// Express Routes
app.post('/api/mpesa/initiate-stk', async (req, res) => {
  try {
    const { phone, amount, orderRef } = req.body;
    
    // Validate inputs
    if (!phone || !amount || !orderRef) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Initiate STK Push
    const result = await mpesaService.initiateStkPush(phone, amount, orderRef);

    if (result.ResponseCode === '0') {
      // Save transaction to database
      await saveTransaction({
        orderRef,
        phone,
        amount,
        checkoutRequestId: result.CheckoutRequestID,
        status: 'pending'
      });

      res.json({
        success: true,
        checkoutRequestId: result.CheckoutRequestID,
        message: 'STK Push sent successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.ResponseDescription
      });
    }
  } catch (error) {
    console.error('Error initiating STK Push:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// M-Pesa Callback Webhook
app.post('/api/mpesa/callback', async (req, res) => {
  try {
    const { Body } = req.body;
    const result = Body.stkCallback;

    if (result.ResultCode === 0) {
      // Payment successful
      const metadata = result.CallbackMetadata.Item;
      const amount = metadata.find(item => item.Name === 'Amount').Value;
      const mpesaCode = metadata.find(item => item.Name === 'MpesaReceiptNumber').Value;
      const phone = metadata.find(item => item.Name === 'PhoneNumber').Value;

      // Update transaction status
      await updateTransaction({
        checkoutRequestId: result.CheckoutRequestID,
        status: 'completed',
        mpesaCode,
        amount
      });

      // Send confirmation email/SMS
      await sendOrderConfirmation({ phone, amount, mpesaCode });

      res.json({ ResultCode: 0, ResultDesc: 'Success' });
    } else {
      // Payment failed
      await updateTransaction({
        checkoutRequestId: result.CheckoutRequestID,
        status: 'failed',
        errorMessage: result.ResultDesc
      });

      res.json({ ResultCode: 0, ResultDesc: 'Noted' });
    }
  } catch (error) {
    console.error('Error processing callback:', error);
    res.status(500).json({ ResultCode: 1, ResultDesc: error.message });
  }
});
```

---

## 🐍 Python/Flask Backend

```python
from flask import Flask, request, jsonify
import requests
import os
from datetime import datetime
import base64
import hashlib

app = Flask(__name__)

class MpesaService:
    @staticmethod
    def get_access_token():
        auth_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        
        auth = (os.getenv('MPESA_CONSUMER_KEY'), os.getenv('MPESA_CONSUMER_SECRET'))
        
        response = requests.get(auth_url, auth=auth)
        return response.json()['access_token']
    
    @staticmethod
    def initiate_stk_push(phone, amount, order_ref):
        token = MpesaService.get_access_token()
        
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_string = f"{os.getenv('MPESA_SHORT_CODE')}{os.getenv('MPESA_PASSKEY')}{timestamp}"
        password = base64.b64encode(password_string.encode()).decode()
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'BusinessShortCode': os.getenv('MPESA_SHORT_CODE'),
            'Password': password,
            'Timestamp': timestamp,
            'TransactionType': 'CustomerPayBillOnline',
            'Amount': int(amount),
            'PartyA': phone,
            'PartyB': os.getenv('MPESA_SHORT_CODE'),
            'PhoneNumber': phone,
            'CallBackURL': os.getenv('MPESA_CALLBACK_URL'),
            'AccountReference': order_ref,
            'TransactionDesc': f'Order {order_ref}'
        }
        
        url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        response = requests.post(url, json=payload, headers=headers)
        
        return response.json()

@app.route('/api/mpesa/initiate-stk', methods=['POST'])
def initiate_stk():
    try:
        data = request.json
        phone = data.get('phone')
        amount = data.get('amount')
        order_ref = data.get('orderRef')
        
        if not all([phone, amount, order_ref]):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        result = MpesaService.initiate_stk_push(phone, amount, order_ref)
        
        if result.get('ResponseCode') == '0':
            # Save to database
            return jsonify({
                'success': True,
                'checkoutRequestId': result['CheckoutRequestID'],
                'message': 'STK Push sent successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': result.get('ResponseDescription')
            }), 400
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/mpesa/callback', methods=['POST'])
def mpesa_callback():
    try:
        body = request.json['Body']
        result = body['stkCallback']
        
        if result['ResultCode'] == 0:
            # Payment successful
            # Process order...
            pass
        
        return jsonify({'ResultCode': 0, 'ResultDesc': 'Success'})
    except Exception as e:
        return jsonify({'ResultCode': 1, 'ResultDesc': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

---

## 📋 Environment Variables for Backend

Create `.env` file in your backend:

```env
# M-Pesa
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_SHORT_CODE=174379
MPESA_PASSKEY=your-passkey
MPESA_CALLBACK_URL=https://your-domain.com/api/mpesa/callback

# Pesapal
PESAPAL_CONSUMER_KEY=your-key
PESAPAL_CONSUMER_SECRET=your-secret
PESAPAL_CALLBACK_URL=https://your-domain.com/api/pesapal/callback

# Database
DATABASE_URL=your-database-url

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

---

## 🚀 Quick Start

### Option 1: Use Firebase Functions (Easiest)

```bash
npm install -g firebase-tools
firebase init functions
# Add payment handling code
firebase deploy --only functions
```

### Option 2: Use Vercel Functions

Create `api/mpesa.js`:
```javascript
export default async (req, res) => {
  if (req.method === 'POST') {
    // Handle M-Pesa logic
    res.json({ success: true });
  }
};
```

### Option 3: Deploy separate backend

Use Railway, Heroku, or DigitalOcean for Node.js/Python backend.

---

## ✅ Testing Checklist

- [ ] M-Pesa STK Push working in sandbox
- [ ] Pesapal card payment redirecting correctly
- [ ] Webhooks receiving callbacks
- [ ] Order saved to database on successful payment
- [ ] Email notifications sent
- [ ] Error handling for failed payments
- [ ] Transaction logging implemented

---

## 📞 API Support

- **Safaricom Daraja:** https://developer.safaricom.co.ke/documentation
- **Pesapal API:** https://developer.pesapal.com/
- **Postman Collection:** Import sandbox APIs for testing

Your payment integration is ready! 💳
