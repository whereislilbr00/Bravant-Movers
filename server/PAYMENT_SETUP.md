# Payment & Email Setup Guide

This guide explains how to get your Stripe, PesaPal, and Gmail credentials.

---

## 1. Stripe Setup (International Payments)

### Step 1: Create Stripe Account

1. Go to: https://dashboard.stripe.com/register
2. Enter your email and create a password
3. Verify your email address

### Step 2: Get API Keys

1. After login, click **"Developers"** in the left sidebar
2. Click **"API keys"**
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`) - Used in frontend
   - **Secret key** (starts with `sk_test_`) - Used in backend

### Step 3: Copy Keys

- Copy the **Secret key** and update `STRIPE_SECRET_KEY` in `.env.local`
- Copy the **Publishable key** and update `STRIPE_PUBLISHABLE_KEY` in `.env.local`

---

## 2. PesaPal Setup (Kenya Payments)

### Step 1: Register for PesaPal

1. Go to: https://developer.pesapal.com/
2. Click **"Register"** or **"Sign Up"**
3. Fill in your business details
4. Wait for account approval (may take 1-2 business days)

### Step 2: Get API Credentials

1. After approval, go to: https://developer.pesapal.com/
2. Login to your account
3. Go to **"API Keys"** or **"Settings"**
4. Copy your:
   - **Consumer Key**
   - **Consumer Secret**

### Step 3: Update Environment

- Update `PESAPAL_CONSUMER_KEY` in `.env.local`
- Update `PESAPAL_CONSUMER_SECRET` in `.env.local`
- Keep `PESAPAL_MODE=sandbox` for testing

---

## 3. Gmail Setup (Email Notifications)

### Step 1: Enable 2-Step Verification

1. Go to: https://myaccount.google.com/
2. Click **"Security"** in left sidebar
3. Under "How you sign in to Google", enable **"2-Step Verification"**

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in if prompted
3. In "Select app", choose **"Mail"**
4. In "Select device", choose **"Other"** and type "Bravant Movers"
5. Click **"Generate"**
6. Copy the 16-character password shown

### Step 3: Update Environment

- Update `EMAIL_USER` with your Gmail address (e.g., yourname@gmail.com)
- Update `EMAIL_PASS` with the App Password you just generated

---

## Environment File Format

Your `.env.local` should look like this after adding credentials:

```
env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

# PesaPal
PESAPAL_CONSUMER_KEY=your_consumer_key
PESAPAL_CONSUMER_SECRET=your_consumer_secret
PESAPAL_MODE=sandbox

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxxxxxxxxxxxxxx
```

---

## Testing Payments

### Test Stripe (Use Test Cards)

- Card Number: `4242424242424242`
- Expiry: Any future date (e.g., 12/30)
- CVC: Any 3 digits (e.g., 123)

### Test PesaPal

- Use PesaPal sandbox test credentials
- Follow their testing guide at https://developer.pesapal.com/

---

## Need Help?

- Stripe Support: https://support.stripe.com/
- PesaPal Support: https://support.pesapal.com/
- Gmail Help: https://support.google.com/mail
