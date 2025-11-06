# 🚀 Quick Deployment Checklist

Use this checklist to deploy AcadMark to the internet quickly.

## ☐ Pre-Deployment

- [ ] Code is working locally
- [ ] All features tested
- [ ] Database schema ready (`database_setup.sql`)
- [ ] Environment variables documented
- [ ] CSV templates prepared

## ☐ GitHub Setup

- [ ] Create GitHub account (if needed)
- [ ] Create new repository: `acadmark-attendance`
- [ ] Initialize git: `git init`
- [ ] Add files: `git add .`
- [ ] Commit: `git commit -m "Initial commit"`
- [ ] Push to GitHub:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/acadmark-attendance.git
  git branch -M main
  git push -u origin main
  ```

## ☐ Database Setup

Choose ONE option:

### Option A: PlanetScale (Recommended - Free)

- [ ] Sign up at https://planetscale.com
- [ ] Create database: `acadmark_attendance`
- [ ] Copy connection string
- [ ] Note credentials (host, user, password, database name)

### Option B: Render MySQL ($7/month)

- [ ] Sign up at https://render.com
- [ ] Create MySQL database
- [ ] Copy credentials

### Option C: Railway (Free credits)

- [ ] Sign up at https://railway.app
- [ ] Add MySQL database
- [ ] Copy credentials

## ☐ Hosting Setup (Choose ONE)

### Option 1: Render (Recommended)

- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] New Web Service → Connect GitHub repo
- [ ] Configure:
  - Name: `acadmark`
  - Environment: `Node`
  - Build Command: `npm install`
  - Start Command: `node server.js`
- [ ] Add environment variables (see below)
- [ ] Deploy
- [ ] Wait for build to complete

### Option 2: Railway

- [ ] Go to https://railway.app
- [ ] New Project → Deploy from GitHub
- [ ] Select repository
- [ ] Add environment variables
- [ ] Deploy

### Option 3: Heroku

- [ ] Install Heroku CLI
- [ ] `heroku login`
- [ ] `heroku create acadmark-attendance`
- [ ] Add MySQL addon
- [ ] Set environment variables
- [ ] `git push heroku main`

## ☐ Environment Variables

Add these to your hosting platform:

```
NODE_ENV=production
PORT=3000

# Database (use credentials from your DB provider)
DB_HOST=your-db-host.com
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=markin_attendance
DB_PORT=3306

# Session (generate random string)
SESSION_SECRET=YOUR-RANDOM-SECRET-STRING-HERE

# Admin (CHANGE THESE!)
ADMIN_USER=admin@acadmark
ADMIN_PASSWORD=YOUR-SECURE-PASSWORD-HERE

# Optional
CAMPUS_LATITUDE=19.0760
CAMPUS_LONGITUDE=72.8777
CAMPUS_RADIUS_METERS=500
```

**How to generate SESSION_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## ☐ Database Initialization

After deployment:

### Method 1: Using Render Shell (Render)

- [ ] Go to Render dashboard → Shell tab
- [ ] Run:
  ```bash
  mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < database_setup.sql
  ```

### Method 2: Using MySQL Client

- [ ] Download MySQL Workbench or use CLI
- [ ] Connect to your database
- [ ] Run `database_setup.sql` script

### Method 3: Using Production Setup Script

- [ ] In your hosting platform's shell:
  ```bash
  bash setup-production.sh
  ```

## ☐ Post-Deployment

- [ ] Visit your deployed URL
- [ ] Test login page loads
- [ ] Login as admin
- [ ] Import teachers CSV
- [ ] Import students CSV
- [ ] Verify teacher-student mappings created
- [ ] Test teacher login (use TCH001)
- [ ] Test student login (use STU001)
- [ ] Start attendance session
- [ ] Mark attendance
- [ ] End session
- [ ] Download CSV
- [ ] Check student dashboard refreshes

## ☐ Security

- [ ] Change default admin password
- [ ] Use strong SESSION_SECRET
- [ ] Verify HTTPS is enabled
- [ ] Test all role-based access controls
- [ ] Set up database backups
- [ ] Monitor application logs

## ☐ Final Steps

- [ ] Share URL with users
- [ ] Provide login instructions
- [ ] Set up monitoring (UptimeRobot)
- [ ] Document any custom changes
- [ ] Celebrate! 🎉

---

## 🆘 Troubleshooting

**App won't start:**

- Check environment variables are set correctly
- View logs in hosting dashboard
- Verify database connection

**Can't login:**

- Check ADMIN_USER and ADMIN_PASSWORD in env vars
- Verify database tables were created
- Clear browser cookies

**Database connection failed:**

- Check DB_HOST, DB_USER, DB_PASSWORD
- Verify database exists
- Check firewall rules

---

## 📱 Share With Users

Once deployed, share these details:

**For Teachers:**

```
AcadMark Attendance System
URL: https://your-app.onrender.com
Login: Use your Teacher ID (TCH001, TCH002, etc.)
No password needed
```

**For Students:**

```
AcadMark Student Portal
URL: https://your-app.onrender.com
Login: Use your Student ID (STU001, STU002, etc.)
No password needed
```

**For Admin:**

```
AcadMark Admin Console
URL: https://your-app.onrender.com
Username: admin@acadmark
Password: [your secure password]
```

---

## ⏱️ Estimated Time

- GitHub setup: 5 minutes
- Database setup: 10 minutes
- Hosting configuration: 15 minutes
- Deployment: 5-10 minutes
- Testing: 10 minutes

**Total: ~45 minutes**

---

**Good luck with your deployment!** 🚀
