# 🚀 AcadMark Deployment Guide

This guide will help you deploy AcadMark to the internet using various hosting platforms.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Option 1: Deploy to Render (Recommended - Free)](#option-1-deploy-to-render-recommended---free)
3. [Option 2: Deploy to Railway (Easy)](#option-2-deploy-to-railway-easy)
4. [Option 3: Deploy to Heroku](#option-3-deploy-to-heroku)
5. [Option 4: Deploy to VPS (DigitalOcean, AWS, etc.)](#option-4-deploy-to-vps)
6. [Post-Deployment Setup](#post-deployment-setup)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account (for code repository)
- ✅ MySQL database (hosted or cloud-based)
- ✅ Admin credentials ready
- ✅ All environment variables documented

---

## Option 1: Deploy to Render (Recommended - Free)

### Why Render?

- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy MySQL integration
- ✅ Auto-deploy from GitHub

### Step 1: Prepare Your Code

1. **Initialize Git Repository**

   ```bash
   cd "c:\COLLEGE CONTRO NKT CODING CLUB\MarkIn"
   git init
   git add .
   git commit -m "Initial commit - AcadMark v1.0"
   ```

2. **Create GitHub Repository**

   - Go to https://github.com/new
   - Name: `acadmark-attendance`
   - Set to Private (recommended)
   - Don't initialize with README (we already have code)

3. **Push Code to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/acadmark-attendance.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Set Up MySQL Database

**Option A: Use Render's MySQL (Paid - $7/month)**

- Go to https://render.com
- Click "New +" → "MySQL"
- Choose a plan
- Note down the credentials

**Option B: Use Free MySQL Hosting**

- **FreeSQLDatabase.com** (Free, 5MB)
- **db4free.net** (Free, 200MB)
- **Clever Cloud** (Free tier available)

**Option C: Use PlanetScale (Recommended - Free)**

1. Go to https://planetscale.com
2. Sign up (free tier: 5GB storage, 1 billion reads/month)
3. Create new database: `acadmark_attendance`
4. Copy connection string

### Step 3: Deploy to Render

1. **Sign Up/Login to Render**

   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**

   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `acadmark-attendance`

3. **Configure Service**

   ```
   Name: acadmark
   Environment: Node
   Region: Choose closest to you
   Branch: main
   Build Command: npm install
   Start Command: node server.js
   ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"

   ```
   NODE_ENV=production
   PORT=3000

   # Database Configuration
   DB_HOST=your-mysql-host.com
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=markin_attendance
   DB_PORT=3306

   # Session Secret (generate a random string)
   SESSION_SECRET=your-super-secret-random-string-here

   # Admin Credentials
   ADMIN_USER=admin@acadmark
   ADMIN_PASSWORD=your-secure-admin-password

   # Campus Location (optional)
   CAMPUS_LATITUDE=19.0760
   CAMPUS_LONGITUDE=72.8777
   CAMPUS_RADIUS_METERS=500
   ```

5. **Deploy**

   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Wait 2-5 minutes for deployment

6. **Set Up Database**

   - Once deployed, use Render Shell or MySQL client
   - Run `database_setup.sql` to create tables:

   ```bash
   # Using Render Shell
   mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p YOUR_DB_NAME < database_setup.sql
   ```

7. **Import Data**
   - Login as admin at `https://your-app.onrender.com`
   - Use the admin dashboard to import teacher and student CSV files

### Step 4: Access Your App

- Your app will be live at: `https://your-app-name.onrender.com`
- Login with admin credentials
- Import teachers and students
- Start using AcadMark!

---

## Option 2: Deploy to Railway (Easy)

Railway offers $5 free credit monthly (enough for small apps).

### Steps:

1. **Sign Up**

   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `acadmark-attendance`

3. **Add MySQL Database**

   - Click "New" → "Database" → "Add MySQL"
   - Railway will create a database automatically

4. **Configure Environment Variables**

   - Click on your service → "Variables"
   - Add all environment variables (same as Render)
   - Railway automatically sets `DATABASE_URL`

5. **Deploy**
   - Railway auto-deploys on push
   - Access at `https://your-app.railway.app`

---

## Option 3: Deploy to Heroku

### Steps:

1. **Install Heroku CLI**

   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and Create App**

   ```bash
   heroku login
   cd "c:\COLLEGE CONTRO NKT CODING CLUB\MarkIn"
   heroku create acadmark-attendance
   ```

3. **Add MySQL Addon**

   ```bash
   heroku addons:create jawsdb:kitefin  # Free tier
   ```

4. **Set Environment Variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=your-secret
   heroku config:set ADMIN_USER=admin@acadmark
   heroku config:set ADMIN_PASSWORD=your-password
   ```

5. **Deploy**

   ```bash
   git push heroku main
   ```

6. **Open App**
   ```bash
   heroku open
   ```

---

## Option 4: Deploy to VPS

For full control, deploy to a VPS (DigitalOcean, Linode, AWS EC2, etc.)

### Quick Setup (Ubuntu 22.04):

```bash
# 1. Connect to your server
ssh root@your-server-ip

# 2. Update system
apt update && apt upgrade -y

# 3. Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# 4. Install MySQL
apt install -y mysql-server
mysql_secure_installation

# 5. Create database
mysql -u root -p
CREATE DATABASE markin_attendance;
CREATE USER 'acadmark'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON markin_attendance.* TO 'acadmark'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 6. Clone your repository
cd /var/www
git clone https://github.com/YOUR_USERNAME/acadmark-attendance.git
cd acadmark-attendance

# 7. Install dependencies
npm install --production

# 8. Create .env file
nano .env
# Add all environment variables

# 9. Import database
mysql -u acadmark -p markin_attendance < database_setup.sql

# 10. Install PM2 (process manager)
npm install -g pm2

# 11. Start application
pm2 start server.js --name acadmark
pm2 startup
pm2 save

# 12. Install and configure Nginx (reverse proxy)
apt install -y nginx
nano /etc/nginx/sites-available/acadmark

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
ln -s /etc/nginx/sites-available/acadmark /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 13. Install SSL certificate (optional but recommended)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## Post-Deployment Setup

### 1. **Initialize Database**

- Run `database_setup.sql` on your production database
- Verify all 9 tables are created

### 2. **Import Initial Data**

- Login as admin
- Import teacher CSV (50 teachers)
- Import student CSV (80 students)
- Verify teacher-student mappings created

### 3. **Test All Features**

- ✅ Admin login/logout
- ✅ Teacher login/logout
- ✅ Student login/logout
- ✅ Start attendance session
- ✅ Mark attendance
- ✅ End session
- ✅ Download CSV
- ✅ View student dashboard
- ✅ Data refresh

### 4. **Security Checklist**

- ✅ Change default admin password
- ✅ Use strong SESSION_SECRET
- ✅ Enable HTTPS (most platforms do this automatically)
- ✅ Set secure cookie settings in production
- ✅ Keep database credentials secret
- ✅ Regular backups of database

### 5. **Performance Optimization**

```javascript
// Update src/app.js for production
if (process.env.NODE_ENV === "production") {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 4,
        httpOnly: true,
        secure: true, // Enable in production with HTTPS
        sameSite: "strict",
      },
    })
  );
}
```

---

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Failed**

   - Check DB credentials in environment variables
   - Verify database host is accessible
   - Check firewall rules

2. **App Crashes on Start**

   - Check logs: `heroku logs --tail` or Render dashboard
   - Verify all environment variables are set
   - Check Node.js version compatibility

3. **Cannot Login**

   - Verify ADMIN_USER and ADMIN_PASSWORD in env vars
   - Check database has admin record
   - Clear browser cookies

4. **Attendance Not Saving**
   - Check monthly table creation
   - Verify session ID format
   - Check database permissions

---

## 📊 Monitoring & Maintenance

### Recommended Tools:

- **Uptime Monitoring**: UptimeRobot (free)
- **Error Tracking**: Sentry (free tier)
- **Analytics**: Google Analytics
- **Database Backups**: Automated daily backups

### Regular Maintenance:

1. Weekly database backups
2. Monthly dependency updates
3. Review activity logs
4. Monitor disk space (uploads folder)
5. Check error logs

---

## 🎉 Success!

Your AcadMark application is now live on the internet!

**Share with users:**

- Admin: `https://your-app-url.com` → Login → Import data
- Teachers: Share teacher IDs (TCH001-TCH050)
- Students: Share student IDs (STU001-STU080)

---

## 📞 Support

For issues or questions:

1. Check logs first
2. Review environment variables
3. Verify database connectivity
4. Test locally before deploying changes

**Good luck with your deployment!** 🚀
