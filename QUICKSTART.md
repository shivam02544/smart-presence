# ⚡ Quick Start Guide

Get Smart Presence running in 5 minutes!

## Step 1: Choose Your Database Option

### Option A: MongoDB Atlas (Recommended - No Installation) ⭐

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free M0 cluster
4. Create a database user (username: `smartpresence`, password: your choice)
5. Whitelist IP: Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere"
6. Get connection string: Click "Connect" → "Connect your application" → Copy the string

**Update `.env.local`:**
```env
MONGODB_URI=mongodb+srv://smartpresence:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/smart-presence?retryWrites=true&w=majority
```

### Option B: Local MongoDB

**Windows:**
```powershell
# Download and install from: https://www.mongodb.com/try/download/community
# After installation, start MongoDB:
net start MongoDB
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Your `.env.local` is already configured for local MongoDB!**

---

## Step 2: Install Dependencies

```bash
npm install
```

---

## Step 3: Create Admin User

```bash
node scripts/create-admin.js
```

This creates:
- **Admin**: admin@example.com / admin123
- **Teacher**: teacher@example.com / admin123  
- **Student**: student@example.com / admin123

---

## Step 4: Start the App

```bash
npm run dev
```

---

## Step 5: Login & Explore! 🎉

Open http://localhost:3000

**Login with:**
- Email: `admin@example.com`
- Password: `admin123`

---

## What's Next?

### As Admin:
1. Go to **Admin Dashboard**
2. Create **Courses** (Admin → Courses → Create New Course)
3. Create **Batches** (Admin → Batches → Create New Batch)
4. Create more **Users** (Admin → Users → Create New User)

### As Teacher:
1. Login as teacher (teacher@example.com / admin123)
2. Click **"Start New Session"**
3. Select course and batch
4. Share the **6-digit code** or **QR code** with students

### As Student:
1. Login as student (student@example.com / admin123)
2. Click **"Mark Attendance"**
3. Enter the **6-digit session code**
4. Done! ✅

---

## Troubleshooting

### Can't connect to MongoDB?

**MongoDB Atlas:**
- Check your username/password in connection string
- Make sure IP is whitelisted (0.0.0.0/0 for development)
- Wait 2-3 minutes after creating cluster

**Local MongoDB:**
- Make sure MongoDB is running: `mongod --version`
- Windows: `net start MongoDB`
- Mac: `brew services start mongodb-community`

### Port 3000 already in use?

```bash
npx kill-port 3000
# Then run again
npm run dev
```

### Need to reset admin password?

Delete the user from MongoDB and run:
```bash
node scripts/create-admin.js
```

---

## 📚 Full Documentation

- [Complete README](README.md) - Full documentation
- [Setup Guide](SETUP_GUIDE.md) - Detailed setup instructions
- [API Documentation](README.md#-api-documentation) - API endpoints

---

**Need help? Open an issue on GitHub!** 🚀
