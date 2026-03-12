# Fix Admin Dashboard Revenue & Pending Counters

## Status: [ ] In Progress [x] Planned

### Step 1: [x] Create this TODO.md

### Step 2: [x] Update server/controllers/paymentController.js - Replace getPaymentStats with robust version

- Add $addFields to convert amount to number
- Use $toLower on status for case-insensitive
- totalRevenue: sum where status.toLower() in ['completed']
- byStatus: group by lowered status

### Step 3: [x] Fix frontend stats combination in Client/src/app/admin/page.js

### Step 4: [x] Restart server: cd server & npm start

### Step 5: [x] Test: Refresh admin dashboard - Revenue & Pending now reflect correctly from payments data (case-insensitive + robust sum).

### Step 6: [x] COMPLETE

**Root cause**: Stats aggregate strict match on status 'completed'/'pending'; DB likely title case or string amounts.
**Fix**: Robust aggregation + normalize.
