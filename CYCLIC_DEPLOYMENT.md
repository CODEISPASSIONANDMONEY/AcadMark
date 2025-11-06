# 🚀 Deploy AcadMark to Cyclic.sh - Complete Guide

## ✨ Why Cyclic?

- ✅ **100% FREE Forever** - No credit card required
- ✅ **Zero Configuration** - Auto-detects Node.js apps
- ✅ **Never Sleeps** - Always online 24/7
- ✅ **Fast Deployment** - Live in 2 minutes
- ✅ **Easy for Beginners** - Just click buttons!

---

## 📋 What You Need

1. GitHub account (you already have: CODEISPASSIONANDMONEY/AcadMark) ✅
2. Free MySQL database (we'll set this up)
3. 10 minutes of your time

---

## 🎯 Step-by-Step Deployment

### PART 1: Get Free MySQL Database (3 minutes)

We'll use **Railway** for free MySQL database.

#### 1.1 Sign Up for Railway

1. Open your browser and go to: **https://railway.app**
2. Click the **"Login with GitHub"** button
3. GitHub will ask for permission - Click **"Authorize Railway"**
4. You're now logged into Railway! 🎉

#### 1.2 Create MySQL Database

1. Click the big **"New Project"** button (purple button in the center)
2. Click **"Provision MySQL"** from the list
3. Wait 30 seconds - Railway is creating your database...
4. You'll see a new MySQL service appear!

#### 1.3 Get Your Database Credentials

1. Click on the **MySQL** box that appeared
2. Click the **"Variables"** tab at the top
3. You'll see these important values - **COPY THEM** to a notepad:

```
MYSQLHOST = containers-us-west-123.railway.app
MYSQLUSER = root
MYSQLPASSWORD = aBcD1234XyZ (yours will be different)
MYSQLDATABASE = railway
MYSQLPORT = 6789 (yours might be different)
```

**💡 TIP**: Click the copy icon next to each value to copy it easily!

**⚠️ IMPORTANT**: Keep this tab open! You'll need these values soon.

---

### PART 2: Deploy to Cyclic (5 minutes)

#### 2.1 Sign Up for Cyclic

1. Open a new tab and go to: **https://app.cyclic.sh**
2. Click **"Login with GitHub"**
3. GitHub will ask for permission - Click **"Authorize Cyclic"**
4. Welcome to Cyclic! 🎉

#### 2.2 Deploy Your App

1. On the Cyclic dashboard, click **"Link Your Own"** button
2. You'll see a list of your GitHub repositories
3. Find **"AcadMark"** in the list (use the search box if needed)
4. Click the **"Connect"** button next to AcadMark
5. Cyclic will start deploying automatically!
6. Wait 1-2 minutes while it builds...

#### 2.3 Your App is Live! 🎉

After deployment completes, you'll see:

- ✅ Green checkmark
- 🌐 Your live URL: **https://your-app-name.cyclic.app**

**BUT WAIT!** It won't work yet - we need to add the database connection!

---

### PART 3: Connect Database to App (2 minutes)

#### 3.1 Add Environment Variables

1. On your Cyclic app page, click **"Variables"** tab (at the top)
2. Click **"Edit"** button
3. Now we'll add all the configuration one by one:

**Add these variables (Click "+ Add Variable" for each):**

```env
NODE_ENV
production

PORT
3000

DB_HOST
[Paste MYSQLHOST from Railway - the long domain name]

DB_USER
[Paste MYSQLUSER from Railway - usually "root"]

DB_PASSWORD
[Paste MYSQLPASSWORD from Railway - the long random password]

DB_NAME
[Paste MYSQLDATABASE from Railway - usually "railway"]

DB_PORT
[Paste MYSQLPORT from Railway - usually a number like 6789]

SESSION_SECRET
my-super-secret-acadmark-key-2025

ADMIN_USER
admin@acadmark

ADMIN_PASSWORD
Admin@123456

CAMPUS_LATITUDE
19.0760

CAMPUS_LONGITUDE
72.8777
```

**📝 How to add each variable:**

- Type the variable name in the "Key" field (e.g., `NODE_ENV`)
- Type the value in the "Value" field (e.g., `production`)
- Click the **"+ Add"** button
- Repeat for all variables above

#### 3.2 Save and Deploy

1. After adding all variables, click **"Save"** button at the top right
2. Cyclic will automatically redeploy your app with the new settings
3. Wait 30 seconds for redeployment...

---

### PART 4: Initialize Database (2 minutes)

Now we need to set up the database tables.

#### 4.1 Access Railway Database Console

1. Go back to the **Railway tab** in your browser
2. Click on your **MySQL** service
3. Click the **"Data"** tab at the top
4. Click **"Query"** button

#### 4.2 Run Database Setup

1. Go to your project folder on your computer:
   - Path: `C:\COLLEGE CONTRO NKT CODING CLUB\MarkIn\`
2. Open the file: **`database_setup.sql`**
3. **Select all** the content (Ctrl+A) and **copy** it (Ctrl+C)
4. Go back to Railway in your browser
5. **Paste** the SQL code into the query box
6. Click the **"Run"** button
7. You should see: ✅ **"Query executed successfully"**

**💡 Alternative Method** (if Railway Query doesn't work):

- Download **MySQL Workbench** or **DBeaver** (free tools)
- Connect using Railway credentials
- Run the `database_setup.sql` file

---

### PART 5: Import Data & Test (3 minutes)

#### 5.1 Access Your Live App

1. Go back to Cyclic dashboard
2. Click on your app name
3. You'll see your live URL: **`https://your-app-name.cyclic.app`**
4. Click the URL or copy and paste it in a new browser tab

#### 5.2 Login as Admin

1. You should see the AcadMark login page! 🎉
2. Login with:
   - **Email**: `admin@acadmark`
   - **Password**: `Admin@123456`
3. Select **"Admin"** from the dropdown
4. Click **"Login"**

#### 5.3 Import Teachers

1. You should be on the Admin Dashboard
2. Scroll down to **"Import Teachers"** section
3. Click **"Download Template"** button
4. A file `teachers_template.csv` will download
5. Click **"Choose File"** button
6. Select the `teachers_template.csv` file you just downloaded
7. Click **"Import Teachers"** button
8. Wait 2-3 seconds...
9. You should see: ✅ **"Successfully imported 50 teachers"**

#### 5.4 Import Students

1. Scroll down to **"Import Students"** section
2. Click **"Download Template"** button
3. A file `students_template.csv` will download
4. Click **"Choose File"** button
5. Select the `students_template.csv` file you just downloaded
6. Click **"Import Students"** button
7. Wait 2-3 seconds...
8. You should see: ✅ **"Successfully imported 80 students"**

---

## 🎉 Congratulations! Your App is Live!

Your AcadMark attendance system is now deployed and accessible from anywhere in the world!

**Your Live URL**: `https://your-app-name.cyclic.app`

---

## 📱 How to Use Your Live App

### For Teachers:

1. Go to your live URL
2. Login with Teacher ID (e.g., `TCH001`, `TCH002`, etc.)
3. Select **"Teacher"** from dropdown
4. Click Login (no password needed!)
5. Start taking attendance!

### For Students:

1. Go to your live URL
2. Login with Student ID (e.g., `STU001`, `STU002`, etc.)
3. Select **"Student"** from dropdown
4. Click Login
5. View your attendance statistics!

---

## 🔧 Managing Your Deployment

### View Logs (Debugging)

1. Go to Cyclic dashboard
2. Click your app name
3. Click **"Logs"** tab
4. See real-time logs of what's happening

### Redeploy App

1. If you push changes to GitHub
2. Cyclic **automatically redeploys**! 🎉
3. No manual action needed!

### Update Environment Variables

1. Click **"Variables"** tab
2. Click **"Edit"**
3. Change any value
4. Click **"Save"**
5. App redeploys automatically

---

## 🆘 Troubleshooting

### Problem: "Cannot connect to database"

**Solution:**

1. Go to Cyclic → Variables tab
2. Check that DB_HOST, DB_USER, DB_PASSWORD are correct
3. Make sure DB_PORT is a number (not a string)
4. Go to Railway → Check database is still running

### Problem: "Application Error" or blank page

**Solution:**

1. Click **"Logs"** tab in Cyclic
2. Look for red error messages
3. Common fixes:
   - DB_PASSWORD might have special characters - wrap in quotes
   - Session secret might be missing
   - Database might not be initialized (run database_setup.sql again)

### Problem: "Session expired" repeatedly

**Solution:**

1. Check SESSION_SECRET is set in Variables
2. Clear browser cookies
3. Try in incognito/private mode

### Problem: Import fails

**Solution:**

1. Make sure database_setup.sql ran successfully
2. Check CSV files are not corrupted
3. Download templates again from the app

### Problem: Railway database stops working

**Railway Free Tier**: 500 hours/month (about 16-17 hours per day)

**Solutions:**

- Upgrade Railway to Pro ($5/month) for unlimited hours
- Or use **PlanetScale** instead (see below)

---

## 🔄 Alternative: Use PlanetScale Instead of Railway

If you want unlimited database hours:

### Setup PlanetScale (3 minutes)

1. Go to: **https://auth.planetscale.com/sign-up**
2. Click **"Continue with GitHub"**
3. Click **"Create a database"**
   - Name: `acadmark`
   - Region: Choose closest to you
   - Plan: **Hobby (Free)**
4. Click **"Connect"** button
5. Copy credentials:
   ```
   Host: xxxx.us-east-1.psdb.cloud
   Username: xxxxxxxx
   Password: pscale_pw_xxxxxx
   ```

### Update Cyclic Variables

1. Go to Cyclic → Variables → Edit
2. Update:
   - `DB_HOST` = [PlanetScale host]
   - `DB_USER` = [PlanetScale username]
   - `DB_PASSWORD` = [PlanetScale password]
   - `DB_NAME` = `acadmark`
   - `DB_PORT` = `3306`
3. Save → Wait for redeploy

### Initialize PlanetScale Database

1. PlanetScale → Click your database
2. Click **"Console"** tab
3. Paste content of `database_setup.sql`
4. Click **"Execute"**

---

## 💡 Pro Tips

### 1. Custom Domain (Optional)

Want a custom domain like `acadmark.com`?

1. Buy domain from Namecheap/GoDaddy ($10/year)
2. Or get FREE domain from: **https://www.freenom.com**
3. In Cyclic:
   - Click **"Domains"** tab
   - Click **"Add Domain"**
   - Follow instructions to add DNS records

### 2. Keep Railway Database Active

To maximize Railway free hours:

- Only use app during school hours
- Railway auto-sleeps when not in use (saves hours!)

### 3. Monitor Uptime

Use **UptimeRobot** (free) to monitor your app:

1. Sign up: **https://uptimerobot.com**
2. Add your Cyclic URL
3. Get email alerts if app goes down

### 4. Backup Your Database

**Railway:**

1. Click database → **"Backups"** tab
2. Download backup before making changes

**PlanetScale:**

1. Automatic daily backups included free!

---

## 📊 Cyclic Dashboard Features

### Logs Tab

- See all console.log outputs
- View errors in real-time
- Debug issues

### Deployments Tab

- See deployment history
- Rollback to previous versions
- View build logs

### Variables Tab

- Manage environment variables
- Update secrets securely

### Domains Tab

- Add custom domains
- Manage SSL certificates (auto-generated!)

### Storage Tab

- View uploaded files (CSV files you import)
- Files persist across deployments

---

## ✅ Final Checklist

- [ ] Railway MySQL database created
- [ ] Railway credentials copied
- [ ] Cyclic account created
- [ ] AcadMark repository connected to Cyclic
- [ ] All environment variables added to Cyclic
- [ ] Database initialized with database_setup.sql
- [ ] Can access login page at Cyclic URL
- [ ] Admin login works
- [ ] Teachers imported successfully (50 teachers)
- [ ] Students imported successfully (80 students)
- [ ] Teacher login works
- [ ] Student login works
- [ ] Attendance marking works

---

## 🎓 Free Tier Limits

### Cyclic Free Tier

- ✅ Unlimited requests
- ✅ Never sleeps
- ✅ 10GB bandwidth/month
- ✅ 100GB storage
- ✅ Automatic SSL
- ✅ Unlimited deployments
- ⚠️ Limit: 3 apps per account

### Railway Free Tier

- ✅ $5 free credit/month
- ✅ 500 execution hours/month
- ✅ 100GB bandwidth
- ✅ 1GB storage
- ⚠️ Database sleeps after 10 mins inactivity

### PlanetScale Free Tier (Alternative)

- ✅ 5GB storage
- ✅ 1 billion row reads/month
- ✅ 10 million row writes/month
- ✅ Never sleeps
- ✅ Automatic backups

---

## 📞 Support Resources

### Cyclic Support

- Docs: https://docs.cyclic.sh
- Discord: https://discord.gg/cyclic
- Email: support@cyclic.sh

### Railway Support

- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Community: https://help.railway.app

### PlanetScale Support

- Docs: https://planetscale.com/docs
- Discord: https://discord.gg/planetscale
- Support: support@planetscale.com

---

## 🚀 Next Steps

1. ✅ **Share your live URL** with teachers and students
2. ✅ **Test all features** (login, attendance, import)
3. ✅ **Customize** admin password in Variables
4. ✅ **Monitor** using Cyclic Logs tab
5. ✅ **Backup** database regularly

---

## 🎉 You Did It!

Your AcadMark attendance system is now:

- ✅ Live on the internet
- ✅ Accessible from any device
- ✅ Running 24/7
- ✅ Completely FREE!

**Total Time**: 10-15 minutes
**Total Cost**: $0.00 💰
**Difficulty**: Super Easy! 😊

---

## 🔗 Quick Links

- **Your GitHub Repo**: https://github.com/CODEISPASSIONANDMONEY/AcadMark
- **Cyclic Dashboard**: https://app.cyclic.sh
- **Railway Dashboard**: https://railway.app/dashboard
- **Your Live App**: `https://[your-app-name].cyclic.app`

---

**Made with ❤️ for students by students!**

Share your success story! 🎊
