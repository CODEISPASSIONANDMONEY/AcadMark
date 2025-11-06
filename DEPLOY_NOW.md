# AcadMark Deployment - Quick Start Guide

## 🎯 You're Ready to Deploy!

Your code is already on GitHub at: https://github.com/CODEISPASSIONANDMONEY/AcadMark

Now let's get it live on the internet in about 10 minutes!

---

## Step 1: Set Up Free MySQL Database (5 minutes)

### Option A: PlanetScale (Recommended - Easiest)

1. Go to https://auth.planetscale.com/sign-up
2. Sign up with GitHub
3. Click "Create a new database"
   - Name: `acadmark`
   - Region: Choose closest to you
   - Plan: **Hobby (Free)**
4. Click "Create database"
5. Wait for database to initialize (1-2 minutes)
6. Click "Connect" button
7. Select "General" from dropdown
8. Copy these values and save them:
   ```
   Host: xxxxx.connect.psdb.cloud
   Username: xxxxx
   Password: pscale_pw_xxxxx
   Database: acadmark
   ```

### Option B: FreeSQLDatabase (Free - Quick)

1. Go to https://www.freesqldatabase.com
2. Click "Sign Up Now"
3. Fill in details and verify email
4. Login and create database
5. Save the credentials shown

---

## Step 2: Deploy to Render (5 minutes)

1. **Go to Render**
   - Visit https://dashboard.render.com/register
   - Click "Sign up with GitHub"
   - Authorize Render

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Click "Connect account" if needed
   - Find and select: `CODEISPASSIONANDMONEY/AcadMark`
   - Click "Connect"

3. **Configure Service**
   Fill in these details:
   ```
   Name: acadmark
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: (leave blank)
   Environment: Node
   Build Command: npm install
   Start Command: node server.js
   Instance Type: Free
   ```

4. **Add Environment Variables**
   
   Click "Advanced" → Scroll to "Environment Variables" → Click "Add Environment Variable"
   
   Add each of these (click "Add Environment Variable" for each):

   ```
   NODE_ENV = production
   
   PORT = 3000
   
   DB_HOST = [paste from PlanetScale - e.g., xxxxx.connect.psdb.cloud]
   
   DB_USER = [paste from PlanetScale]
   
   DB_PASSWORD = [paste from PlanetScale - starts with pscale_pw_]
   
   DB_NAME = acadmark
   
   DB_PORT = 3306
   
   SESSION_SECRET = acadmark-secret-key-change-in-production-2025
   
   ADMIN_USER = admin@acadmark
   
   ADMIN_PASSWORD = Admin@2025!Secure
   
   CAMPUS_LATITUDE = 19.0760
   
   CAMPUS_LONGITUDE = 72.8777
   
   CAMPUS_RADIUS_METERS = 500
   ```

5. **Create Web Service**
   - Scroll down and click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - Watch the logs - you'll see "Deploy succeeded" when done

---

## Step 3: Set Up Database Tables (2 minutes)

After deployment succeeds:

1. **Connect to Database**
   
   Open your MySQL client (MySQL Workbench, DBeaver, or online):
   
   - Host: [your DB_HOST]
   - Username: [your DB_USER]
   - Password: [your DB_PASSWORD]
   - Database: acadmark
   - Port: 3306

2. **Run Database Setup**
   
   - Open `database_setup.sql` from your local project
   - Copy all contents
   - Run in your MySQL client
   - Verify: Should create 9 tables

   **OR use PlanetScale Console:**
   - Go to PlanetScale dashboard
   - Click on your database
   - Click "Console" tab
   - Copy and paste `database_setup.sql` contents
   - Click "Execute"

---

## Step 4: Access Your Live Application! 🎉

1. **Find Your URL**
   - In Render dashboard, your app URL is shown at top
   - Format: `https://acadmark.onrender.com` (or similar)
   - Click on it to open

2. **First Login**
   ```
   URL: https://your-app.onrender.com
   Username: admin@acadmark
   Password: Admin@2025!Secure
   ```

3. **Import Initial Data**
   - Click "Import Data" in admin dashboard
   - Download teacher template
   - Download student template
   - Upload both files
   - Wait for import to complete

---

## ✅ Success Checklist

After deployment, verify:

- [ ] App loads at your Render URL
- [ ] Login page appears
- [ ] Admin login works
- [ ] Teacher CSV imports successfully
- [ ] Student CSV imports successfully
- [ ] Teacher login works (use TCH001)
- [ ] Student login works (use STU001)
- [ ] Attendance session can be started
- [ ] Data refreshes properly

---

## 🔧 Troubleshooting

### App shows "Application Error"
- Check Render logs for errors
- Verify all environment variables are set
- Check database connection

### Can't connect to database
- Verify DB credentials in environment variables
- Check if PlanetScale database is running
- Test connection with MySQL Workbench

### Database tables not found
- Run `database_setup.sql` in your database
- Check if all 9 tables were created

### Login fails
- Verify ADMIN_USER and ADMIN_PASSWORD in env vars
- Clear browser cache/cookies
- Check Render logs for errors

---

## 📞 Quick Support Commands

**View Logs:**
- In Render dashboard → Logs tab
- Watch real-time logs as app runs

**Restart App:**
- In Render dashboard → Manual Deploy → "Clear build cache & deploy"

**Update Environment Variables:**
- In Render dashboard → Environment tab
- Add/Edit variables → Save changes (auto-deploys)

---

## 🎊 Your App is Live!

Share these URLs with your users:

**Admin Portal:**
```
URL: https://your-app.onrender.com
Username: admin@acadmark
Password: Admin@2025!Secure
```

**Teachers:**
```
URL: https://your-app.onrender.com
Login: Use Teacher ID (TCH001, TCH002, etc.)
No password needed
```

**Students:**
```
URL: https://your-app.onrender.com
Login: Use Student ID (STU001, STU002, etc.)
No password needed
```

---

## 📊 Free Tier Limits

Render Free Tier includes:
- ✅ 750 hours/month (enough for 24/7)
- ✅ Automatic HTTPS
- ✅ Auto-deploy from GitHub
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Cold starts (15-30 seconds to wake up)

PlanetScale Free Tier:
- ✅ 5 GB storage
- ✅ 1 billion row reads/month
- ✅ 10 million row writes/month

**This is perfect for a college project!**

---

Need help? Check the logs first, then review this guide. Most issues are due to:
1. Missing environment variables
2. Database not initialized
3. Wrong credentials

**Good luck! 🚀**
