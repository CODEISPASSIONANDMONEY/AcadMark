# 🆓 FREE Deployment Guide for AcadMark

## Zero Money Required - Perfect for Students & Beginners

Your GitHub Repository: https://github.com/CODEISPASSIONANDMONEY/AcadMark

---

## 🎯 Best Free Options (Ranked by Easiness)

### ⭐ OPTION 1: Render + Railway MySQL (EASIEST - RECOMMENDED)

**Time: 10 minutes | Forever Free | No Credit Card**

#### Step 1A: Get Free MySQL Database from Railway

1. **Sign Up**

   - Go to: https://railway.app
   - Click "Login with GitHub"
   - Authorize Railway

2. **Create Database**

   - Click "New Project"
   - Click "Provision MySQL"
   - Wait 30 seconds for database to spin up

3. **Get Database Credentials**
   - Click on the MySQL service
   - Go to "Variables" tab
   - Copy these values:
     ```
     MYSQLHOST = containers-us-west-xxx.railway.app
     MYSQLUSER = root
     MYSQLPASSWORD = xxxxxxxxxxx
     MYSQLDATABASE = railway
     MYSQLPORT = 6379
     ```
   - **Important**: Keep this tab open!

#### Step 1B: Deploy App to Render

1. **Sign Up on Render**

   - Go to: https://dashboard.render.com/register
   - Click "Sign in with GitHub"
   - Authorize Render

2. **Create Web Service**

   - Click "New +" button (top right)
   - Click "Web Service"
   - Select your repository: `CODEISPASSIONANDMONEY/AcadMark`
   - Click "Connect"

3. **Configure (Copy-Paste These)**

   ```
   Name: acadmark
   Region: Oregon (US West)
   Branch: main
   Root Directory: (leave blank)
   Runtime: Node
   Build Command: npm install
   Start Command: node server.js
   Instance Type: Free
   ```

4. **Add Environment Variables**

   Scroll down to "Environment Variables" section, click "Add Environment Variable" and add these ONE BY ONE:

   ```
   NODE_ENV = production
   PORT = 3000
   DB_HOST = [paste MYSQLHOST from Railway]
   DB_USER = [paste MYSQLUSER from Railway]
   DB_PASSWORD = [paste MYSQLPASSWORD from Railway]
   DB_NAME = [paste MYSQLDATABASE from Railway]
   DB_PORT = [paste MYSQLPORT from Railway]
   SESSION_SECRET = my-super-secret-key-acadmark-2025
   ADMIN_USER = admin@acadmark
   ADMIN_PASSWORD = Admin@123456
   CAMPUS_LATITUDE = 19.0760
   CAMPUS_LONGITUDE = 72.8777
   ```

5. **Deploy**

   - Click "Create Web Service" button at bottom
   - Wait 3-5 minutes for deployment
   - You'll see build logs in real-time

6. **Get Your Live URL**
   - Once deployed, you'll see: "Your service is live 🎉"
   - URL will be: `https://acadmark.onrender.com` (or similar)

#### Step 1C: Initialize Database

1. **Go Back to Railway**

   - Click on your MySQL database
   - Click "Data" tab
   - Click "Query"

2. **Run Database Setup**

   - Copy all content from `database_setup.sql` file
   - Paste into the query box
   - Click "Run Query"
   - You should see "Query executed successfully"

3. **Done!** 🎉
   - Visit your Render URL: `https://acadmark.onrender.com`
   - Login with: `admin@acadmark` / `Admin@123456`

---

### ⭐ OPTION 2: Vercel + PlanetScale (FASTEST DEPLOYMENT)

**Time: 8 minutes | Forever Free | Requires GitHub Only**

#### Step 2A: Database Setup (PlanetScale)

1. **Sign Up**

   - Go to: https://auth.planetscale.com/sign-up
   - Click "Continue with GitHub"
   - Authorize PlanetScale

2. **Create Database**

   - Click "Create a database"
   - Name: `acadmark`
   - Region: AWS / us-east-1 (or closest)
   - Plan: **Hobby (Free)**
   - Click "Create database"

3. **Get Connection String**

   - Click "Connect" button
   - Select "Node.js"
   - Copy the connection details:
     ```
     Host: xxxx.us-east-1.psdb.cloud
     Username: xxxxxxxx
     Password: pscale_pw_xxxxxx
     ```

4. **Initialize Database**
   - Click "Console" tab
   - Copy content from your `database_setup.sql`
   - Paste and click "Execute"

#### Step 2B: Deploy to Vercel

1. **Sign Up**

   - Go to: https://vercel.com/signup
   - Click "Continue with GitHub"

2. **Import Project**

   - Click "Add New..." → "Project"
   - Find `AcadMark` repository
   - Click "Import"

3. **Configure**

   - Framework Preset: **Other**
   - Build Command: `npm install`
   - Output Directory: `public`
   - Install Command: `npm install`

4. **Environment Variables**
   Click "Environment Variables" and add:

   ```
   NODE_ENV = production
   PORT = 3000
   DB_HOST = [from PlanetScale]
   DB_USER = [from PlanetScale]
   DB_PASSWORD = [from PlanetScale]
   DB_NAME = acadmark
   DB_PORT = 3306
   SESSION_SECRET = vercel-acadmark-secret-2025
   ADMIN_USER = admin@acadmark
   ADMIN_PASSWORD = Admin@Vercel123
   CAMPUS_LATITUDE = 19.0760
   CAMPUS_LONGITUDE = 72.8777
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Live URL: `https://acadmark.vercel.app`

---

### ⭐ OPTION 3: Cyclic.sh (ONE-CLICK DEPLOY)

**Time: 5 minutes | Super Easy | No Configuration**

1. **Sign Up**

   - Go to: https://app.cyclic.sh
   - Click "Login with GitHub"

2. **Deploy**

   - Click "Link Your Own"
   - Find `CODEISPASSIONANDMONEY/AcadMark`
   - Click "Connect"
   - **That's it!** Cyclic auto-detects everything

3. **Add Environment Variables**

   - Click "Variables" tab
   - Add same variables as above

4. **Database**
   - Use Railway MySQL (from Option 1A) or
   - Use free tier from Clever Cloud: https://www.clever-cloud.com/mysql-hosting/

---

### ⭐ OPTION 4: Koyeb (European Alternative)

**Time: 7 minutes | Free Forever | 2 Apps Limit**

1. **Sign Up**: https://app.koyeb.com/auth/signup
2. **Create App** → "Deploy from GitHub"
3. **Select Repository**: `AcadMark`
4. **Configure**:
   - Name: `acadmark`
   - Build: `npm install`
   - Run: `node server.js`
   - Port: 3000
5. **Add Environment Variables** (same as above)
6. **Deploy**

---

## 🗄️ FREE MySQL Database Options (Ranked)

### 1. Railway ⭐ BEST

- **Free Tier**: 500 hours/month (enough for learning)
- **Setup**: 2 minutes
- **Link**: https://railway.app
- **No Credit Card**: Yes!

### 2. PlanetScale ⭐ PROFESSIONAL

- **Free Tier**: 5GB storage, 1 billion reads/month
- **Setup**: 3 minutes
- **Link**: https://planetscale.com
- **Best For**: Production-ready apps

### 3. FreeSQLDatabase ⭐ QUICK

- **Free Tier**: 5MB (good for testing)
- **Setup**: 1 minute
- **Link**: https://www.freesqldatabase.com
- **Best For**: Quick tests

### 4. db4free.net ⭐ SIMPLE

- **Free Tier**: Unlimited time
- **Setup**: 2 minutes
- **Link**: https://www.db4free.net
- **Best For**: Small projects

### 5. Clever Cloud ⭐ GENEROUS

- **Free Tier**: 256MB RAM, 2GB storage
- **Setup**: 4 minutes
- **Link**: https://www.clever-cloud.com/mysql-hosting/

---

## 📱 Complete Deployment Workflow (Recommended Path)

### Path A: For Absolute Beginners

```
1. Railway (Database) → 3 minutes
2. Render (App Hosting) → 5 minutes
3. Initialize Database → 2 minutes
Total: 10 minutes ✅
```

### Path B: For Fast Deployment

```
1. PlanetScale (Database) → 3 minutes
2. Vercel (App Hosting) → 3 minutes
3. Initialize Database → 1 minute
Total: 7 minutes ✅
```

### Path C: Simplest (One Platform)

```
1. Cyclic (App + Variables) → 3 minutes
2. Railway (Database) → 3 minutes
3. Connect & Initialize → 2 minutes
Total: 8 minutes ✅
```

---

## 🚀 Step-by-Step: Recommended for YOU (Railway + Render)

### Part 1: Database (Railway)

```bash
1. Open: https://railway.app
2. Click: "Login with GitHub"
3. Click: "New Project"
4. Click: "Provision MySQL"
5. Copy credentials from "Variables" tab
```

### Part 2: App Hosting (Render)

```bash
1. Open: https://dashboard.render.com/register
2. Click: "Sign in with GitHub"
3. Click: "New +" → "Web Service"
4. Select: "AcadMark" repository
5. Fill configuration (see above)
6. Paste Railway credentials in environment variables
7. Click: "Create Web Service"
```

### Part 3: Initialize Database

```bash
1. Back to Railway → Click MySQL database
2. Click "Data" → "Query"
3. Copy content from: MarkIn/database_setup.sql
4. Paste and click "Run Query"
```

### Part 4: Import Data

```bash
1. Visit your Render URL
2. Login: admin@acadmark / Admin@123456
3. Go to Admin Dashboard
4. Click "Import Teachers" → Upload: templates/teachers_template.csv
5. Click "Import Students" → Upload: templates/students_template.csv
```

---

## ✅ After Deployment Checklist

- [ ] Can access login page at your live URL
- [ ] Can login as admin
- [ ] Teachers CSV imports successfully
- [ ] Students CSV imports successfully
- [ ] Can login as teacher (use any teacher ID from template)
- [ ] Can login as student (use any student ID from template)
- [ ] Teacher can start session
- [ ] Student can see attendance

---

## 🆘 Troubleshooting

### "Cannot connect to database"

- Check DB_HOST doesn't have `mysql://` prefix
- Verify DB_PORT is correct (usually 3306)
- Check DB_PASSWORD is copied correctly (Railway passwords are long!)

### "Application Error"

- Go to Render dashboard → Click your service → "Logs"
- Look for error messages
- Common fix: Re-deploy by clicking "Manual Deploy" → "Deploy latest commit"

### "Session not working"

- Check SESSION_SECRET is set
- Make sure it's a long random string

### "Port already in use"

- This is normal on free tiers
- Render/Vercel/Railway handle ports automatically

---

## 💡 Pro Tips for Free Tier

1. **Render Free Tier Sleep**

   - App sleeps after 15 minutes of inactivity
   - Wakes up automatically when visited (takes 30 seconds)
   - Use UptimeRobot (free) to ping every 14 minutes to keep it awake: https://uptimerobot.com

2. **Railway Free Hours**

   - 500 hours/month = ~16 hours/day
   - More than enough for development/testing

3. **Database Backups**

   - Railway: Use "Backups" tab (automatic)
   - PlanetScale: Use "Backups" feature (automatic daily)

4. **Custom Domain (Optional)**
   - Get free domain: https://www.freenom.com
   - Connect to Render: Settings → Custom Domain
   - Add DNS records from Render

---

## 🎓 Free Hosting Comparison Table

| Platform                 | Database   | App Hosting | Easy Setup | Sleep Time | Build Time |
| ------------------------ | ---------- | ----------- | ---------- | ---------- | ---------- |
| **Railway + Render**     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐ | 15 min     | 2-3 min    |
| **PlanetScale + Vercel** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐    | ⭐⭐⭐⭐   | No sleep   | 1-2 min    |
| **Cyclic + Railway**     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐ | No sleep   | 2-3 min    |
| **Koyeb + Clever Cloud** | ⭐⭐⭐⭐   | ⭐⭐⭐⭐    | ⭐⭐⭐     | No sleep   | 3-4 min    |

---

## 📞 Need Help?

1. **Render Community**: https://community.render.com
2. **Railway Discord**: https://discord.gg/railway
3. **PlanetScale Docs**: https://planetscale.com/docs

---

## 🎉 You're All Set!

Your AcadMark attendance system is now live on the internet for FREE!

Share your live URL with teachers and students. Enjoy! 🚀

**Estimated Total Time**: 10-15 minutes
**Total Cost**: $0.00 💰
**Technical Skills Required**: Copy & Paste 😄
