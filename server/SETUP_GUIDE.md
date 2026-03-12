# MongoDB Atlas Step-by-Step Setup Guide

## If your cluster is NOT yet created:

### Step 1: Select Free Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. You should see options: **Free**, **Flex**, **Dedicated**
3. Click on **"Free"** (the first option, usually highlighted)
4. It might be called "M0" - this is the free forever cluster

### Step 2: Create the Cluster

After clicking Free:

- Keep the default settings
- Click **"Create Cluster"** button (usually at the bottom)
- Wait 2-3 minutes for deployment
- You'll see "Cluster0" in your dashboard when ready

---

## If your cluster IS already created:

### Step 3: Create Database User (Critical!)

1. In the left sidebar, click **"Database Access"** (looks like a key icon)
2. Click **"Add New Database User"** (blue button)
3. Fill in:
   - **Authentication Method:** Password
   - **Username:** `bravant_admin`
   - **Password:** Create a strong password (write it down!)
   - **Database User Privileges:** "Read and Write to any database"
4. Click **"Add User"**

### Step 4: Allow Network Access

1. In the left sidebar, click **"Network Access"** (looks like a shield icon)
2. Click **"Add IP Address"** (blue button)
3. Under "Access List Entry", type: `0.0.0.0/0`
4. Click **"Confirm"**

### Step 5: Get Connection String

1. In the left sidebar, click **"Clusters"** (looks like blocks)
2. Find your cluster (Cluster0) and click **"Connect"** (blue button)
3. A modal appears - select **"Drivers"**
4. Copy the connection string - it looks like:

```
   mongodb+srv://bravant_admin:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority

```

5. Replace `<password>` with the password you created in Step 3

---

## Quick Visual Checklist:

```
✅ Created Free Cluster (M0)
✅ Created Database User (bravant_admin)
✅ Added Network Access (0.0.0.0/0)
✅ Copied Connection String
```

---

## What to do NEXT:

Once you have your connection string, it should look like this:

```
mongodb+srv://bravant_admin:YourPassword123@cluster0.abcde.mongodb.net/bravant-movers?retryWrites=true&w=majority
```

Please copy and paste your connection string here, and I'll configure it in your project!
