# Bravant Movers Backend API

A production-ready backend API for Bravant Movers & Cleaners website.

## Features

- ✅ **Express.js API Server** - Fast and scalable Node.js server
- ✅ **MongoDB Database** - Data persistence with Mongoose ODM
- ✅ **User Authentication** - JWT-based auth with bcrypt password hashing
- ✅ **Booking System** - Complete booking management
- ✅ **Quote Calculator** - Real-time pricing calculation
- ✅ **Contact Form API** - With email notifications
- ✅ **Payment Processing** - Stripe & PesaPal integration
- ✅ **Admin Dashboard** - Full backend support
- ✅ **Rate Limiting** - Security middleware
- ✅ **Email Notifications** - Nodemailer integration
- ✅ **Environment Configuration** - Secure secrets management

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- Bcrypt (Password Hashing)
- Nodemailer (Email)
- Stripe (International Payments)
- PesaPal (Kenya Payments)
- Helmet (Security)
- Express Rate Limit

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB Atlas Account** (free cloud database)
3. **Stripe Account** (for international payments)
4. **PesaPal Account** (for Kenya payments)
5. **Gmail Account** (for sending emails) or SendGrid

## Quick Setup

### 1. Install Dependencies

```
bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```
bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```
env
# Server
PORT=5000
NODE_ENV=development

# MongoDB Atlas (get from https://www.mongodb.com/cloud/atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bravant-movers

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=30d

# Email (Gmail with App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Bravant Movers <noreply@bravantmovers.com>
ADMIN_EMAIL=admin@bravantmovers.com

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# PesaPal (get from https://developer.pesapal.com)
PESAPAL_CONSUMER_KEY=your_key
PESAPAL_CONSUMER_SECRET=your_secret
PESAPAL_MODE=sandbox

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 3. Get MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a free cluster
4. Create a database user
5. Network Access: Allow all IPs (0.0.0.0/0)
6. Get connection string and replace in `.env.local`

### 4. Start the Server

```
bash
# Development
npm run dev

# Production
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check

```
GET /api/health
```

### Authentication

```
POST /api/users/register - Register new user
POST /api/users/login - Login user
POST /api/users/forgot-password - Request password reset
POST /api/users/reset-password - Reset password
GET  /api/users/profile - Get user profile (protected)
PUT  /api/users/profile - Update user profile (protected)
```

### Bookings

```
POST /api/bookings - Create new booking
POST /api/bookings/quote - Calculate quote
GET  /api/bookings/:id - Get booking by ID
GET  /api/bookings/ - Get all bookings (admin)
PUT  /api/bookings/:id - Update booking (protected)
DELETE /api/bookings/:id - Cancel booking (protected)
PUT  /api/bookings/:id/status - Update status (admin)
```

### Contact

```
POST /api/contact - Submit contact form
GET  /api/contact - Get all contacts (admin)
GET  /api/contact/:id - Get contact by ID (admin)
PUT  /api/contact/:id - Update contact status (admin)
DELETE /api/contact/:id - Delete contact (admin)
```

### Quotes

```
POST /api/quotes/calculate - Calculate quote
POST /api/quotes - Submit quote request
GET  /api/quotes - Get all quotes (admin)
GET  /api/quotes/:id - Get quote by ID (admin)
PUT  /api/quotes/:id - Update quote (admin)
POST /api/quotes/:id/send - Send quote to customer (admin)
POST /api/quotes/:id/convert - Convert to booking (admin)
```

### Payments

```
POST /api/payments/stripe/create - Create Stripe payment
POST /api/payments/stripe/confirm - Confirm Stripe payment
POST /api/payments/pesapal/create - Create PesaPal payment
POST /api/payments/pesapal/callback - PesaPal callback
POST /api/payments/cash - Record cash payment
GET  /api/payments - Get all payments (admin)
GET  /api/payments/:id - Get payment by ID (admin)
POST /api/payments/:id/refund - Refund payment (admin)
```

## Admin Access

To create an admin user:

1. Register a new user via `/api/users/register`
2. Manually update the user's `role` to `admin` in MongoDB

Or use a MongoDB client (like MongoDB Compass):

```
javascript
db.users.updateOne(
  { email: "admin@bravantmovers.com" },
  { $set: { role: "admin" } }
)
```

## Frontend Integration

The Next.js frontend connects to this API. Set the environment variable:

```
env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Project Structure

```
server/
├── controllers/       # Route handlers
│   ├── bookingController.js
│   ├── contactController.js
│   ├── paymentController.js
│   ├── quoteController.js
│   └── userController.js
├── middleware/       # Express middleware
│   ├── auth.js
│   └── rateLimiter.js
├── models/           # Mongoose models
│   ├── Booking.js
│   ├── Contact.js
│   ├── Payment.js
│   ├── Quote.js
│   └── User.js
├── routes/           # API routes
│   ├── bookingRoutes.js
│   ├── contactRoutes.js
│   ├── paymentRoutes.js
│   ├── quoteRoutes.js
│   └── userRoutes.js
├── .env.example      # Environment template
├── .env.local        # Local environment (not committed)
├── package.json
└── server.js         # Main server file
```

## License

MIT
