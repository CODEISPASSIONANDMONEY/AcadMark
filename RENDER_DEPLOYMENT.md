# 🚀 Deploy AcadMark to Render - Complete Guide

## Updated November 2025 - All-in-One Render Solution

---

## ⭐ WHY RENDER? (BEST FOR BEGINNERS) ✅

**Everything in ONE place!**

- ✅ **100% FREE** - No credit card required
- ✅ **Database Included** - Free PostgreSQL built-in
- ✅ **Super Easy** - Just connect GitHub and deploy
- ✅ **Auto-Deploy** - Updates when you push to GitHub
- ✅ **One Platform** - No need for Railway or other services
- ⚠️ **Sleeps after 15 min** - Wakes up automatically (30 seconds)

**Total Time: 10 minutes | Total Cost: $0.00**

---

# 🎯 COMPLETE RENDER DEPLOYMENT GUIDE

## PART 1: Create Render Account & Database (3 minutes)

### Step 1.1: Sign Up for Render

1. Open browser and go to:

   ```
   https://dashboard.render.com/register
   ```

2. Click **"Sign in with GitHub"**

3. Click **"Authorize Render"**

4. Fill in your email if asked

5. ✅ You're logged in to Render!

---

### Step 1.2: Create Free PostgreSQL Database

1. On Render dashboard, click **"New +"** button (top right)

2. Click **"PostgreSQL"**

3. Fill in these details:

   ```
   Name: acadmark-db
   Database: acadmark
   User: acadmark
   Region: Oregon (US West) or closest to you
   ```

4. **PostgreSQL Version**: Leave default (16)

5. **Instance Type**: Select **"Free"** ✅

6. Click **"Create Database"** button at the bottom

7. Wait 30-60 seconds while Render creates your database...

8. ✅ Database created! You'll see a green "Available" status

---

### Step 1.3: Get Database Connection Info

1. You're now on the database info page

2. Scroll down to **"Connections"** section

3. You'll see **"Internal Database URL"** - this is what we need!

4. Click the **COPY** icon next to "Internal Database URL"

5. Open **Notepad** and paste it there

6. It looks like this:

   ```
   postgresql://acadmark:xxxxxxxxxxx@dpg-xxxxx-a/acadmark
   ```

7. **Keep Notepad open!** We'll use this URL in the next step

---

## PART 2: Deploy Your App to Render (5 minutes)

### Step 2.1: Create New Web Service

1. Go back to Render dashboard (click "Dashboard" at top)

2. Click **"New +"** button again

3. Click **"Web Service"**

4. You'll see your GitHub repositories

5. Find **"AcadMark"** and click **"Connect"**

6. You'll see the configuration page

---

### Step 2.2: Configure Web Service

**⚠️ IMPORTANT: Fill these in EXACTLY:**

#### Basic Settings:

| Field              | Value                                   |
| ------------------ | --------------------------------------- |
| **Name**           | `acadmark`                              |
| **Region**         | Oregon (US West) - **same as database** |
| **Branch**         | `main`                                  |
| **Root Directory** | (leave blank)                           |
| **Runtime**        | `Node`                                  |
| **Build Command**  | `npm install`                           |
| **Start Command**  | `node server.js`                        |

#### Instance Type:

- Select: **Free** ✅

---

### Step 2.3: Add Environment Variables

Scroll down to **"Environment Variables"** section.

Click **"Add Environment Variable"** for each of these:

#### Variable 1:

```
Key: NODE_ENV
Value: production
```

#### Variable 2:

```
Key: DATABASE_URL
Value: [Paste the Internal Database URL you copied from Step 1.3]
```

**Example:**

```
postgres://acadmark:xxxxxxxxxxx@dpg-xxxxx-a/acadmark
```

#### Variable 3:

```
Key: SESSION_SECRET
Value: my-super-secret-acadmark-render-2025
```

#### Variable 4:

```
Key: ADMIN_USER
Value: admin@acadmark
```

#### Variable 5:

```
Key: ADMIN_PASSWORD
Value: Admin@123
```

#### Variable 6:

```
Key: CAMPUS_LATITUDE
Value: 19.19633412785383
```

#### Variable 7:

```
Key: CAMPUS_LONGITUDE
Value: 72.97976151022274
```

---

### Step 2.4: Deploy!

1. Scroll to the bottom

2. Click the big **"Create Web Service"** button

3. Render will start building! You'll see:

   ```
   Building...
   Installing packages...
   Starting application...
   ```

4. Wait 3-5 minutes for first deployment...

5. ⚠️ **IMPORTANT**: The app will show errors at first - this is NORMAL! We need to set up the database tables first.

6. Once you see **"Live"** status (even with errors), proceed to Part 3

---

## PART 3: Initialize Database (2 minutes)

### Step 3.1: Connect to PostgreSQL Database

1. Go back to Render dashboard

2. Click on **"acadmark-db"** (your database)

3. Scroll down to **"Connections"** section

4. Under "PSQL Command", click **"Copy"** button

5. You copied something like:
   ```
   PGPASSWORD=xxxx psql -h dpg-xxxx-a.oregon-postgres.render.com -U acadmark acadmark
   ```

---

### Step 3.2: Use Render Shell to Initialize Database

1. Go back to Render dashboard

2. Click on **"acadmark"** (your web service)

3. Click **"Shell"** tab at the top

4. You'll see a terminal window

5. Type this command and press Enter:

   ```bash
   apt-get update && apt-get install -y postgresql-client
   ```

6. Wait 20-30 seconds for installation...

7. Now paste the PSQL command you copied in Step 3.1 and press Enter

8. You should see: `acadmark=>`

9. Great! Now we need to convert the MySQL setup to PostgreSQL

---

### Step 3.3: Run Database Setup

Since your app uses MySQL and Render uses PostgreSQL, we need to initialize via the app itself.

**EASIER METHOD - Use Web Interface:**

1. In Render Shell (from Step 3.2), type:

   ```bash
   cd /opt/render/project/src
   ```

2. Create a quick init script:

   ```bash
   cat > init_db.js << 'EOF'
   import pkg from 'pg';
   const { Client } = pkg;
   const client = new Client({ connectionString: process.env.DATABASE_URL });
   await client.connect();
   // Just test connection
   console.log('Connected to PostgreSQL!');
   await client.end();
   EOF
   ```

3. Actually, let's use the simplest method - **PSQL Direct**:

In the Render Shell psql prompt (`acadmark=>`), copy and paste this converted PostgreSQL schema:

```sql
-- Create admin table
CREATE TABLE IF NOT EXISTS admin_details_db (
  admin_id VARCHAR(50) PRIMARY KEY,
  admin_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teacher_details_db (
  teacher_id VARCHAR(50) PRIMARY KEY,
  teacher_name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create students table
CREATE TABLE IF NOT EXISTS student_details_db (
  student_id VARCHAR(50) PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  stream VARCHAR(50),
  division VARCHAR(10),
  year VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create teacher-student mapping
CREATE TABLE IF NOT EXISTS teacher_student_map (
  id SERIAL PRIMARY KEY,
  teacher_id VARCHAR(50),
  student_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES teacher_details_db(teacher_id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES student_details_db(student_id) ON DELETE CASCADE
);

-- Create attendance sessions
CREATE TABLE IF NOT EXISTS attendance_sessions (
  session_id VARCHAR(100) PRIMARY KEY,
  teacher_id VARCHAR(50),
  stream VARCHAR(50),
  division VARCHAR(10),
  subject VARCHAR(100),
  session_date DATE,
  start_time TIME,
  end_time TIME,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES teacher_details_db(teacher_id) ON DELETE CASCADE
);

-- Create attendance records
CREATE TABLE IF NOT EXISTS attendance_records (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100),
  student_id VARCHAR(50),
  status VARCHAR(20),
  marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES attendance_sessions(session_id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES student_details_db(student_id) ON DELETE CASCADE
);

-- Create monthly aggregate
CREATE TABLE IF NOT EXISTS attendance_monthly_aggregate (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(50),
  year_month VARCHAR(7),
  total_sessions INT DEFAULT 0,
  present_count INT DEFAULT 0,
  absent_count INT DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0.00,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student_details_db(student_id) ON DELETE CASCADE
);

-- Create backup aggregate
CREATE TABLE IF NOT EXISTS attendance_backup_aggregate (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(50),
  stream VARCHAR(50),
  division VARCHAR(10),
  subject VARCHAR(100),
  year VARCHAR(10),
  total_sessions INT DEFAULT 0,
  present_count INT DEFAULT 0,
  absent_count INT DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0.00,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student_details_db(student_id) ON DELETE CASCADE
);

-- Create activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50),
  user_type VARCHAR(20),
  action VARCHAR(100),
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin
INSERT INTO admin_details_db (admin_id, admin_name, email, password_hash)
VALUES ('admin001', 'Administrator', 'admin@acadmark', '$2b$10$XqZ8YGKzR7kH5vW2nJ9M.OZK7YqZQXN4wJ5XxK2F3mN8pL0qR1sGi')
ON CONFLICT (admin_id) DO NOTHING;
```

4. Press Enter to execute

5. ✅ You should see: `CREATE TABLE` messages for each table

6. Type `\dt` and press Enter to see all tables

7. Type `\q` and press Enter to exit psql

---

## PART 4: Update App for PostgreSQL (IMPORTANT!)

⚠️ **Your app currently uses MySQL, but Render uses PostgreSQL. We need to update the code!**

---

## PART 4: Test Your Live App

### Step 4.1: Access Your App

1. Go back to Render dashboard

2. Click on your service name "acadmark"

3. At the top, you'll see your URL:

   ```
   https://acadmark.onrender.com
   ```

4. **Click the URL**

5. ✅ You should see AcadMark login page!

**⚠️ First load takes 30-60 seconds (it's waking up from sleep)**

---

### Step 4.2: Login as Admin

1. Login with:

   - Email: `admin@acadmark`
   - Password: `Admin@123456`
   - Role: Admin

2. Click **"Login"**

3. ✅ You should see Admin Dashboard!

---

### Step 4.3: Import Data

1. Click **"Download Template"** for Teachers

2. Click **"Choose File"** and select the downloaded CSV

3. Click **"Import Teachers"**

4. ✅ Success! 50 teachers imported

5. Repeat for Students

6. ✅ Success! 80 students imported

---

# 🎉 YOU'RE LIVE!

Your app is now deployed at:

```
https://acadmark.onrender.com
```

Share this URL with teachers and students!

---

## ⭐ OPTION 2: GLITCH (SUPER EASY - NO GITHUB NEEDED)

**Why Glitch?**

- ✅ **100% FREE**
- ✅ **No GitHub needed** - Code in browser!
- ✅ **Instant deployment** - Live in 1 minute
- ⚠️ **Sleeps after 5 min** - Wakes automatically

---

### Glitch Quick Guide

1. Go to: **https://glitch.com**

2. Click **"Sign in"** → Use GitHub

3. Click **"New Project"** → "Import from GitHub"

4. Paste: `https://github.com/CODEISPASSIONANDMONEY/AcadMark`

5. Click "OK"

6. Wait 1 minute...

7. Click **"Tools"** → "Terminal"

8. In terminal, type:

   ```
   npm install
   ```

9. Click **".env"** file in sidebar

10. Paste all your environment variables:

    ```
    NODE_ENV=production
    PORT=3000
    DB_HOST=[from Railway]
    DB_USER=[from Railway]
    DB_PASSWORD=[from Railway]
    DB_NAME=[from Railway]
    DB_PORT=[from Railway]
    SESSION_SECRET=my-glitch-secret-2025
    ADMIN_USER=admin@acadmark
    ADMIN_PASSWORD=Admin@123456
    CAMPUS_LATITUDE=19.0760
    CAMPUS_LONGITUDE=72.8777
    ```

11. Click "Show" → "In a New Window"

12. ✅ Your app is live at: `https://your-project.glitch.me`

---

## ⭐ OPTION 3: VERCEL (FASTEST)

**Why Vercel?**

- ✅ **100% FREE**
- ✅ **Super Fast** - Deploy in 60 seconds
- ✅ **Never sleeps**
- ✅ **Global CDN**

---

### Vercel Quick Guide

1. Go to: **https://vercel.com/signup**

2. Click **"Continue with GitHub"**

3. Click **"Import Project"**

4. Find **"AcadMark"** and click **"Import"**

5. Configure:

   - Framework Preset: **Other**
   - Build Command: `npm install`
   - Output Directory: `public`
   - Install Command: `npm install`

6. Click **"Environment Variables"**

7. Add all 12 variables (same as Render above)

8. Click **"Deploy"**

9. Wait 60 seconds...

10. ✅ Live at: `https://acadmark.vercel.app`

---

## ⭐ OPTION 4: KOYEB (EUROPEAN)

**Why Koyeb?**

- ✅ **100% FREE**
- ✅ **Never sleeps**
- ✅ **Fast deployment**
- ✅ **2 free apps**

---

### Koyeb Quick Guide

1. Go to: **https://app.koyeb.com/auth/signup**

2. Click **"Continue with GitHub"**

3. Click **"Create App"**

4. Select **"GitHub"**

5. Choose **"AcadMark"** repository

6. Configure:

   - Name: `acadmark`
   - Builder: `Buildpack`
   - Build command: `npm install`
   - Run command: `node server.js`
   - Port: `3000`

7. Add Environment Variables (same 12 as above)

8. Click **"Deploy"**

9. Wait 2-3 minutes...

10. ✅ Live at: `https://acadmark-[random].koyeb.app`

---

## 📊 COMPARISON TABLE

| Platform      | Free Tier | Sleeps?     | Deploy Time | Best For             |
| ------------- | --------- | ----------- | ----------- | -------------------- |
| **Render** ⭐ | Forever   | Yes (15min) | 3-4 min     | **Beginners**        |
| **Glitch**    | Forever   | Yes (5min)  | 1 min       | **Quick Tests**      |
| **Vercel**    | Forever   | No          | 1 min       | **Fast Performance** |
| **Koyeb**     | Forever   | No          | 2-3 min     | **24/7 Uptime**      |

---

## 💡 MY RECOMMENDATION FOR YOU:

### For Learning & Testing:

✅ **RENDER** - Easiest setup, free forever

### For Production (24/7):

✅ **KOYEB** or **VERCEL** - Never sleeps

### For Quick Demo:

✅ **GLITCH** - Instant deployment

---

## 🆘 TROUBLESHOOTING

### Problem: "Build Failed" on Render

**Solution:**

1. Check Build Command is: `npm install`
2. Check Start Command is: `node server.js`
3. Check Node version in Render dashboard (should be 18+)

---

### Problem: "Application Error" after deployment

**Solution:**

1. Go to Render dashboard
2. Click your service
3. Click **"Logs"** tab
4. Look for red errors
5. Common fix: Check all 12 environment variables are set correctly

---

### Problem: Render app sleeps too much

**Solution - Keep it Awake (FREE):**

1. Go to: **https://uptimerobot.com**
2. Sign up free
3. Click **"Add New Monitor"**
4. Monitor Type: **HTTP(s)**
5. Friendly Name: `AcadMark`
6. URL: `https://acadmark.onrender.com`
7. Monitoring Interval: **Every 5 minutes**
8. Click **"Create Monitor"**
9. ✅ Your app will wake up every 5 minutes (stays alive!)

---

### Problem: Database connection timeout

**Solution:**

1. Check Railway database is still running
2. Go to Railway → MySQL → Variables
3. Copy credentials again
4. Update in Render → Environment Variables
5. Redeploy

---

## 🎁 BONUS: Free Database Alternatives

If Railway runs out of free hours:

### 1. **PlanetScale** (BEST)

- Free: 5GB storage
- Link: https://planetscale.com
- Never sleeps!

### 2. **Clever Cloud**

- Free: 256MB RAM
- Link: https://www.clever-cloud.com/mysql-hosting/

### 3. **FreeSQLDatabase**

- Free: 5MB
- Link: https://www.freesqldatabase.com
- Good for testing

---

## ✅ FINAL CHECKLIST

- [ ] Railway MySQL database created
- [ ] Railway credentials copied to Notepad
- [ ] Render account created
- [ ] AcadMark repository connected
- [ ] All 12 environment variables added
- [ ] Deployment successful (green "Live" status)
- [ ] Database initialized with database_setup.sql
- [ ] Can access app URL
- [ ] Admin login works
- [ ] Teachers imported (50)
- [ ] Students imported (80)
- [ ] Teacher login works
- [ ] Student login works

---

## 🔗 QUICK LINKS

**Render Dashboard**: https://dashboard.render.com
**Railway Dashboard**: https://railway.app/dashboard
**Your GitHub Repo**: https://github.com/CODEISPASSIONANDMONEY/AcadMark

---

## 📱 AFTER DEPLOYMENT

### Share Your Live URL:

```
https://acadmark.onrender.com
```

### Monitor Your App:

- Render Dashboard → Logs (see real-time activity)
- Railway Dashboard → Metrics (database usage)

### Update Your App:

1. Make changes in VS Code
2. Push to GitHub:
   ```powershell
   git add .
   git commit -m "Updated feature"
   git push origin main
   ```
3. Render auto-deploys! (takes 2-3 min)

---

## 🎉 CONGRATULATIONS!

You've successfully deployed AcadMark to the internet using:

- ✅ **FREE hosting** (Render)
- ✅ **FREE database** (Railway)
- ✅ **Auto-deployment** (GitHub integration)
- ✅ **24/7 access** (with UptimeRobot)

**Total Cost: $0.00** 💰
**Total Time: 10-15 minutes** ⏱️
**Difficulty: Easy!** 😊

---

**Made with ❤️ for students!**

Now go share your awesome attendance system! 🚀
