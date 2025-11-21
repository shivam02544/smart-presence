# 🚀 Quick Setup Guide for SmartPresence

**For developers who just cloned this repository**

## Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

## Step-by-Step Setup

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Configure Environment Variables
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your settings
```

Required variables:
```env
MONGODB_URI=mongodb://localhost:27017/smart-presence
JWT_SECRET=your-super-secret-jwt-key-change-this
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3️⃣ Start MongoDB
**Local:**
```bash
mongod
```

**MongoDB Atlas:**
- Create a cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string and update `.env.local`

### 4️⃣ Create Admin User ⚠️ CRITICAL!
**Without this step, you CANNOT login to the application!**

```bash
npm run create-admin
```

Or directly:
```bash
node scripts/create-admin.js
```

This creates:
- **Email**: `admin@example.com`
- **Password**: `admin123`

### 5️⃣ Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6️⃣ Login
1. Use credentials: `admin@example.com` / `admin123`
2. **Change password immediately** after first login!

---

## 🐛 Common Errors and Solutions

### ❌ "Server Error" when trying to login
**Cause**: Admin user doesn't exist in database

**Solution**: Run the admin creation script:
```bash
npm run create-admin
```

### ❌ "MongoDB connection failed"
**Cause**: MongoDB not running or wrong connection string

**Solutions**:
1. Check if MongoDB is running: `mongod`
2. Verify `MONGODB_URI` in `.env.local`
3. For Atlas, check network access and credentials

### ❌ "JWT_SECRET is not defined"
**Cause**: Missing environment variable

**Solution**: Add to `.env.local`:
```env
JWT_SECRET=your-random-secret-key-here
```

### ❌ "Port 3000 already in use"
**Solution**: Kill the process or use different port
```bash
npx kill-port 3000
# OR
PORT=3001 npm run dev
```

### ❌ "Admin user already exists"
**Cause**: You already ran create-admin before

**Solution**: Either:
1. Use existing credentials
2. Delete admin from MongoDB and run script again
3. Modify `scripts/create-admin.js` to create admin with different email

---

## 📋 Next Steps After Setup

1. **Login as Admin** → Create users (teachers, students)
2. **Create Courses** → Add subjects/courses
3. **Create Batches** → Organize students
4. **Assign Teachers** → Link teachers to courses
5. **Start Sessions** → Teachers can begin attendance

---

## 📞 Need Help?

- Check [README.md](./README.md) for full documentation
- Check [Troubleshooting](#-common-errors-and-solutions) section above
- Verify all environment variables are set correctly
- Ensure MongoDB is accessible

---

**Happy Coding! 🎓**
