# MongoDB Atlas Setup Guide

This guide will help you set up a free MongoDB Atlas cloud database for your Bravant Movers backend.

## Step 1: Create MongoDB Atlas Account

1. Open your browser and go to: **https://www.mongodb.com/cloud/atlas**
2. Click **"Start Free"** button
3. Fill in your details:
   - First name
   - Last name
   - Email address
   - Password
4. Click **"Create Account"**
5. Verify your email address (check your inbox)

## Step 2: Create Your Free Cluster

1. After login, you'll see the dashboard
2. Click **"Create"** button
3. Select **"Free"** (M0) cluster - this is free forever
4. Configure your cluster:
   - **Cloud Provider:** AWS (recommended) or Google Cloud
   - **Region:** Select a region closest to you (e.g., us-east-1 for US)
5. Click **"Create Cluster"**
6. Wait 1-3 minutes for the cluster to deploy

## Step 3: Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Create credentials:
   - **Authentication Method:** Password
   - **Username:** bravant_admin (or any username you prefer)
   - **Password:** Create a strong password (copy it, you'll need it)
   - **Database User Privileges:** Read and Write to any database
4. Click **"Add User"**

## Step 4: Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development, allow access from anywhere:
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or enter: `0.0.0.0/0`
4. Click **"Confirm"**

## Step 5: Get Connection String

1. In the left sidebar, click **"Clusters"**
2. Click **"Connect"** button on your cluster
3. Select **"Drivers"**
4. Copy the connection string - it looks like:

```
   mongodb+srv://bravant_admin:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority

```

## Step 6: Update Your Environment File

1. Open `server/.env.local` in your code editor
2. Replace `<password>` in the MongoDB URI with your actual password:

```
   MONGODB_URI=mongodb+srv://bravant_admin:YOUR_ACTUAL_PASSWORD@cluster0.xxxx.mongodb.net/bravant-movers?retryWrites=true&w=majority

```

3. Make sure the database name at the end is `bravant-movers`

## Step 7: Test the Connection

1. Open terminal and navigate to the server folder:

```
bash
   cd server

```

2. Install dependencies (if not already done):

```
bash
   npm install

```

3. Start the server:

```
bash
   npm run dev

```

4. You should see:

```
   ✅ Connected to MongoDB
   🚀 Server running on port 5000

```

5. Test the health endpoint:
   - Open browser to: http://localhost:5000/api/health
   - You should see: `{"status":"ok","message":"Bravant Movers API is running"...}`

## Troubleshooting

### "Authentication Failed" Error

- Double-check your username and password in the connection string
- Make sure the password doesn't contain special characters, or URL-encode them

### "Connection Timed Out" Error

- Verify Network Access allows your IP (0.0.0.0/0)
- Check that your cluster status is "Running" (not "Creating")

### "Database Not Found" Error

- The database name must exist or MongoDB will create it automatically
- Make sure your connection string ends with `/bravant-movers`

## Security Best Practices

For production (after development):

1. Replace 0.0.0.0/0 with specific IP addresses
2. Use environment variables for all secrets
3. Enable MongoDB Atlas encryption at rest
4. Set up Atlas alerts

## Quick Reference

| Item             | Value                      |
| ---------------- | -------------------------- |
| Free Tier        | M0 Cluster (512MB storage) |
| Connection Limit | 100 concurrent connections |
| Data Transfer    | 500MB/month                |
| Price            | FREE forever               |

---

**Need Help?**

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- MongoDB Community: https://community.mongodb.com/
