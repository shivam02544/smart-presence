# 🚀 Quick Setup Guide for Smart Presence

## MongoDB Setup (Choose One Option)

### Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

**Easiest option - No installation required!**

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select a cloud provider and region (closest to you)
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `smartpresence`
   - Password: Generate a secure password (save it!)
   - User Privileges: "Atlas admin"
   - Click "Add User"

4. **Whitelist Your IP Address**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go back to "Database" (Clusters)
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://smartpresence:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update .env.local**
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://smartpresence:yourpassword@cluster0.xxxxx.mongodb.net/smart-presence?retryWrites=true&w=majority`
   - Save the file

### Option 2: Local MongoDB Installation

**For offline development**

#### Windows:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer (choose "Complete" installation)
3. Install as a Windows Service (check the box)
4. MongoDB Compass will be installed automatically
5. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```

#### Mac (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Connection String for Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/smart-presence
```

---

## Complete Setup Steps

### 1. Environment Variables ✅

Your `.env.local` file should look like this:

```env
# MongoDB Connection (choose one)
# Option 1: MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-presence

# Option 2: Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/smart-presence

# JWT Secret
JWT_SECRET=smart-presence-secret-key-change-this-in-production-2024

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Access the Application

Open your browser and go to: **http://localhost:3000**

---

## Creating Your First Admin User

Since this is a fresh installation, you need to create an admin user manually.

### Method 1: Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Connect to your database
3. Create database: `smart-presence`
4. Create collection: `users`
5. Insert document:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "ADMIN",
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

**Note**: You need to hash the password first!

### Method 2: Using Node.js Script (Recommended)

Create a file `scripts/create-admin.js`:

```javascript
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect('YOUR_MONGODB_URI_HERE');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create user
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String
    }));
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN'
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();
```

Run it:
```bash
node scripts/create-admin.js
```

### Method 3: Quick Hash Generator

Use this online tool to hash your password:
https://bcrypt-generator.com/

- Enter your password (e.g., `admin123`)
- Rounds: 10
- Copy the hash
- Use it in MongoDB Compass

---

## Testing the Application

### 1. Login

- Go to http://localhost:3000
- Email: `admin@example.com`
- Password: `admin123` (or whatever you set)

### 2. Create Users

- Navigate to Admin Dashboard → Users
- Create Teacher and Student accounts

### 3. Create Courses

- Navigate to Admin Dashboard → Courses
- Add your courses

### 4. Create Batches

- Navigate to Admin Dashboard → Batches
- Add student batches

### 5. Test Attendance Flow

**As Teacher:**
1. Login as teacher
2. Go to Dashboard
3. Click "Start New Session"
4. Select course and batch
5. Share QR code or session code

**As Student:**
1. Login as student
2. Go to Dashboard
3. Click "Mark Attendance"
4. Enter session code or scan QR
5. Attendance marked!

---

## Troubleshooting

### MongoDB Connection Issues

**Error: `ECONNREFUSED`**
- MongoDB is not running
- Start MongoDB service
- Check connection string

**Error: `Authentication failed`**
- Wrong username/password in connection string
- Check MongoDB Atlas user credentials

**Error: `IP not whitelisted`**
- Add your IP to MongoDB Atlas Network Access
- Or allow access from anywhere (0.0.0.0/0)

### Application Issues

**Error: `JWT_SECRET is not defined`**
- Add JWT_SECRET to `.env.local`

**Port 3000 already in use**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

**Build errors**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

---

## Next Steps

1. ✅ Set up MongoDB (Atlas or Local)
2. ✅ Configure `.env.local`
3. ✅ Create admin user
4. ✅ Start development server
5. ✅ Login and explore!

---

## Need Help?

- 📖 Read the main [README.md](README.md)
- 🐛 Check [Troubleshooting](#troubleshooting) section
- 💬 Open an issue on GitHub

---

**Happy coding! 🎉**
