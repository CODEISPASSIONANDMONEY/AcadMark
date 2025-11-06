# 🚀 Deploy AcadMark to Render ONLY - Complete Guide

## Updated November 2025 - Simplest Method Ever!

---

## ⭐ ALL-IN-ONE RENDER DEPLOYMENT ✅

**The easiest way - 100% FREE!**

- ✅ **Render** - Free app hosting
- ✅ **Aiven** - Free MySQL database (no credit card!)
- ✅ **Total Time**: 12 minutes
- ✅ **Total Cost**: $0.00
- ✅ **Difficulty**: Copy & Paste only!

---

# 🎯 STEP-BY-STEP DEPLOYMENT

## PART 1: Create Free MySQL Database (4 minutes)

### Step 1.1: Sign Up for Aiven

1. Go to: **https://aiven.io/mysql**

2. Click **"Try for Free"**

3. Sign up with GitHub:

   - Click **"Continue with GitHub"**
   - Click **"Authorize Aiven"**

4. ✅ Logged in!

---

### Step 1.2: Create MySQL Service

1. Click **"Create Service"**

2. Select **"MySQL"**

3. Plan: Select **"Free plan"** ($0/month)

4. Cloud: **AWS**

5. Region: **US East (N. Virginia)**

6. Service name: `acadmark-mysql`

7. Click **"Create Service"**

8. Wait 2-3 minutes... (status will change to "Running")

9. ✅ MySQL database ready!

---

### Step 1.3: Get Connection Details

1. Click your **acadmark-mysql** service

2. Scroll to **"Connection Information"**

3. **Copy to Notepad:**

```
Host: acadmark-mysql-xxxxx.aivencloud.com
Port: 12345
User: avnadmin
Password: xxxxxxxxxxxx
Database: defaultdb
```

**Keep Notepad open!**

---

## PART 2: Deploy to Render (5 minutes)

### Step 2.1: Sign Up

1. Go to: **https://dashboard.render.com/register**

2. Click **"Sign in with GitHub"**

3. Click **"Authorize Render"**

4. ✅ Logged in!

---

### Step 2.2: Create Web Service

1. Click **"New +"** (top right)

2. Click **"Web Service"**

3. Find **"AcadMark"** → Click **"Connect"**

---

### Step 2.3: Configure

| Field          | Value            |
| -------------- | ---------------- |
| Name           | `acadmark`       |
| Region         | Oregon (US West) |
| Branch         | `main`           |
| Root Directory | (blank)          |
| Runtime        | `Node`           |
| Build Command  | `npm install`    |
| Start Command  | `node server.js` |
| Instance Type  | **Free** ✅      |

---

### Step 2.4: Environment Variables

Add these ONE BY ONE (click "Add Environment Variable"):

**From Aiven (Notepad):**

```
DB_HOST = [paste Host from Aiven]
DB_PORT = [paste Port from Aiven]
DB_USER = avnadmin
DB_PASSWORD = [paste Password from Aiven]
DB_NAME = defaultdb
```

**App Settings:**

```
NODE_ENV = production
SESSION_SECRET = my-acadmark-secret-2025
ADMIN_USER = admin@acadmark
ADMIN_PASSWORD = Admin@123
CAMPUS_LATITUDE = 19.19633412785383
CAMPUS_LONGITUDE = 72.97976151022274
```

---

### Step 2.5: Deploy!

1. Click **"Create Web Service"**

2. Wait 3-4 minutes (watch the logs)

3. ✅ Status: **"Live"** (green dot)

4. Your URL: `https://acadmark.onrender.com`

---

## PART 3: Database Auto-Initializes! ✅

**Good News**: The database tables are created AUTOMATICALLY on first deployment!

Your app now includes an auto-initialization script that:
- ✅ Checks if tables exist on startup
- ✅ Creates all 9 tables automatically if missing
- ✅ Inserts default admin user
- ✅ No manual SQL execution needed!

### What Happens:

1. Render deploys your app
2. App connects to Aiven MySQL
3. **Auto-initialization runs** → Creates all tables
4. App starts successfully!

You'll see this in Render logs:
```
✅ Connected to MySQL database
📦 No tables found. Initializing database...
✅ Database initialized successfully!
🚀 AcadMark server running at http://localhost:3000
```

### Nothing to Do!

Just wait for deployment to finish (3-4 minutes).

**All tables are created automatically!** 🎉

---

## PART 4: Test Your Live App! 🎉

### Step 4.1: Access Your App

1. Go to Render dashboard

2. Click on your **acadmark** service

3. Click **"Logs"** tab

4. Wait until you see:
   ```
   ✅ Database initialized successfully!
   🚀 AcadMark server running
   ```

5. Click your URL at top: `https://acadmark.onrender.com`

6. ⚠️ First load: 30-60 seconds (waking up)

7. ✅ Login page appears!

---

### Step 4.2: Login as Admin

```
Email: admin@acadmark
Password: Admin@123
Role: Admin
```

Click **Login** → ✅ Admin Dashboard!

---

### Step 4.3: Import Data

**Teachers:**

1. Click "Download Template"
2. Upload `teachers_template.csv`
3. Click "Import Teachers"
4. ✅ 50 teachers imported!

**Students:**

1. Click "Download Template"
2. Upload `students_template.csv`
3. Click "Import Students"
4. ✅ 80 students imported!

---

## 🎉 YOU'RE LIVE!

**Your URL**: `https://acadmark.onrender.com`

**Share with teachers & students!**

---

## 📱 HOW TO USE

**Teachers**: Login with `TCH001` (no password)
**Students**: Login with `STU001` (no password)

---

## 🔧 MANAGE YOUR APP

### Update App:

```powershell
git add .
git commit -m "Update"
git push origin main
```

Render auto-deploys in 2-3 min!

### View Logs:

Render Dashboard → Logs tab

### Keep Awake 24/7:

1. Sign up: https://uptimerobot.com
2. Add Monitor → HTTP(s)
3. URL: Your Render URL
4. Interval: Every 5 minutes
5. ✅ Never sleeps!

---

## 🆘 TROUBLESHOOTING

**"Cannot connect to database"**

- Check environment variables match Aiven EXACTLY
- Redeploy: Manual Deploy → Deploy latest commit

**"Application Error"**

- Click Logs tab
- Check database was initialized
- Verify all 11 environment variables are set

**Aiven 25MB full**

- Delete old attendance records
- Or use PlanetScale (5GB free): https://planetscale.com

---

## ✅ CHECKLIST

- [ ] Aiven MySQL created & running
- [ ] Aiven credentials in Notepad
- [ ] Render account created
- [ ] AcadMark connected
- [ ] 11 environment variables added
- [ ] Deployment: Live (green)
- [ ] ✅ **Database auto-initialized** (check logs!)
- [ ] Can access app URL
- [ ] Admin login works
- [ ] Teachers imported (50)
- [ ] Students imported (80)
- [ ] Teacher login works
- [ ] Student login works

---

## 🌟 FREE TIER LIMITS

**Render**: 750 hours/month, sleeps after 15 min
**Aiven**: 25MB storage, unlimited queries

**Total: $0.00 Forever!** 💰

---

## 🔗 LINKS

- **Live App**: https://acadmark.onrender.com
- **Render**: https://dashboard.render.com
- **Aiven**: https://console.aiven.io
- **GitHub**: https://github.com/CODEISPASSIONANDMONEY/AcadMark

---

**Total Time**: 12 minutes
**Total Cost**: $0.00
**Difficulty**: Super Easy! 😊

**Made with ❤️ for students!** 🎓
