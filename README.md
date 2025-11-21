# 🎓 Smart Presence - Intelligent Attendance Management System

<div align="center">

![Smart Presence](https://img.shields.io/badge/Smart-Presence-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A modern, secure, and intelligent attendance tracking system for educational institutions**

[Features](#-features) • [Quick Start](#-quick-start) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [User Roles](#-user-roles)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Smart Presence** is a next-generation attendance management system designed for modern educational institutions. It combines QR code technology, real-time updates, and anti-proxy detection to ensure accurate and secure attendance tracking.

### Why Smart Presence?

- ✅ **Real-time Tracking**: Live attendance updates with automatic refresh
- ✅ **QR Code Technology**: Fast and contactless attendance marking
- ✅ **Anti-Proxy Detection**: Device fingerprinting prevents proxy attendance
- ✅ **Role-Based Access**: Separate dashboards for Admin, Teacher, and Student
- ✅ **Modern UI/UX**: Clean, responsive design with smooth animations
- ✅ **Secure Authentication**: JWT-based session management with HTTP-only cookies

---

## ✨ Features

### For Teachers
- 🎯 **Quick Session Creation**: Start attendance sessions in seconds
- 📊 **Live Dashboard**: Monitor student attendance in real-time
- 🔄 **Auto-Refreshing QR Codes**: Enhanced security with rotating tokens
- 📈 **Session Management**: View, control, and close sessions easily
- 👥 **Batch Management**: Organize students by batches and sections

### For Students
- 📱 **Easy Check-in**: Mark attendance via QR code or session code
- 🔒 **Device Binding**: Secure device registration for anti-proxy
- 📊 **Attendance History**: Track your attendance records
- ⚡ **Fast & Simple**: Minimal steps to mark attendance

### For Administrators
- 👤 **User Management**: Create and manage users (teachers, students)
- 📚 **Course Management**: Add and organize courses
- 🎓 **Batch Management**: Create and manage student batches
- 📊 **System Overview**: Monitor system-wide attendance data

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.0.3 (App Router)
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **QR Codes**: qrcode.react

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jose library)
- **Password Hashing**: bcryptjs

### Development Tools
- **Build Tool**: Turbopack
- **Linting**: ESLint
- **Package Manager**: npm

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v6.0 or higher (local or Atlas)
- **Git**: For cloning the repository

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-presence.git
cd smart-presence
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/smart-presence
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-presence

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
- Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string and add it to `.env.local`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `NEXT_PUBLIC_APP_URL` | Application URL | No | `http://localhost:3000` |

### Database Setup

The application will automatically create collections on first use. No manual database setup required!

---

## 📖 Usage Guide

### First Time Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your MongoDB URI and JWT secret.

3. **Start MongoDB**
   
   Make sure MongoDB is running (locally or use MongoDB Atlas).

4. **Create Admin User** ⚠️ **CRITICAL STEP**
   
   Run the admin creation script:
   ```bash
   node scripts/create-admin.js
   ```
   
   This will create an admin user with:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
   - **Role**: `ADMIN`
   
   > 🔐 **Important**: Change the default password after first login!

5. **Start the Application**
   ```bash
   npm run dev
   ```

6. **Login**
   - Navigate to `http://localhost:3000`
   - Login with: `admin@example.com` / `admin123`
   - Change your password immediately!

### For Administrators

#### Creating Users

1. Navigate to **Admin Dashboard** → **Users**
2. Click **Create New User**
3. Fill in user details:
   - Name
   - Email
   - Password
   - Role (ADMIN, TEACHER, STUDENT, CR)
4. Click **Create User**

#### Creating Courses

1. Navigate to **Admin Dashboard** → **Courses**
2. Click **Create New Course**
3. Enter course details:
   - Course Name
   - Course Code
   - Department
   - Semester
4. Click **Create Course**

#### Creating Batches

1. Navigate to **Admin Dashboard** → **Batches**
2. Click **Create New Batch**
3. Enter batch details:
   - Batch Name
   - Section
   - Department
   - Year
4. Click **Create Batch**

### For Teachers

#### Starting an Attendance Session

1. Login to your **Teacher Dashboard**
2. Click **Start New Session**
3. Select:
   - Subject/Course
   - Batch/Class
   - Session Duration (10-180 minutes)
4. Click **Create & Start Session**
5. Share the QR code or 6-digit session code with students

#### Managing Live Sessions

- **View Live Attendees**: See students as they mark attendance
- **Close Session**: Click "Close Session" to stop accepting attendance
- **Re-open Session**: Reactivate a closed session if needed
- **Monitor Flags**: Check for suspicious activity (device sharing, etc.)

### For Students

#### Marking Attendance

**Method 1: QR Code (Recommended)**
1. Login to your **Student Dashboard**
2. Click **Mark Attendance**
3. Scan the QR code displayed by your teacher
4. Attendance marked instantly!

**Method 2: Session Code**
1. Login to your **Student Dashboard**
2. Click **Mark Attendance**
3. Enter the 6-digit session code
4. Click **Submit Attendance**

#### Device Registration

- On first attendance, your device is automatically registered
- Device ID is stored securely in browser localStorage
- Prevents proxy attendance from other devices

---

## 👥 User Roles

### ADMIN
- Full system access
- User management (create, edit, delete)
- Course and batch management
- System-wide reports

### TEACHER
- Create and manage attendance sessions
- View live attendance
- Access to assigned courses
- Session history and reports

### STUDENT
- Mark attendance via QR or code
- View attendance history
- Check attendance percentage
- Personal dashboard

### CR (Class Representative)
- Student privileges
- Additional access to batch information
- Can assist with attendance management

---

## 🔌 API Documentation

### Authentication

#### POST `/api/auth/login`
Login user and create session

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "STUDENT"
  },
  "redirectUrl": "/student/dashboard"
}
```

#### POST `/api/auth/logout`
Logout user and destroy session

### Sessions

#### POST `/api/sessions`
Create new attendance session (Teacher only)

**Request:**
```json
{
  "subjectId": "course_id",
  "batchId": "batch_id",
  "duration": 60
}
```

#### GET `/api/sessions/[id]`
Get session details with attendees

#### PATCH `/api/sessions/[id]`
Update session status

**Request:**
```json
{
  "status": "CLOSED"
}
```

### Attendance

#### POST `/api/attendance/mark`
Mark student attendance (Student only)

**Request:**
```json
{
  "sessionCode": "123456",
  "deviceId": "uuid-device-id"
}
```

### Courses & Batches

#### GET `/api/courses`
Get all courses

#### POST `/api/courses`
Create new course (Admin only)

#### GET `/api/batches`
Get all batches

#### POST `/api/batches`
Create new batch (Admin only)

---

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure session management
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Role-Based Access Control**: Middleware protection for routes
- **Password Hashing**: bcrypt with salt rounds

### Anti-Proxy Detection
- **Device Fingerprinting**: UUID-based device identification
- **Device Registration**: First-time device binding
- **Suspicious Activity Flags**: Detects multiple logins from same device
- **Session Validation**: Real-time session status checking

### Data Security
- **MongoDB Injection Prevention**: Mongoose schema validation
- **Input Sanitization**: Server-side validation
- **Secure Headers**: Next.js security best practices

---

## 📁 Project Structure

```
smart-presence/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin pages
│   │   ├── teacher/           # Teacher pages
│   │   ├── student/           # Student pages
│   │   ├── api/               # API routes
│   │   ├── login/             # Login page
│   │   ├── layout.js          # Root layout
│   │   ├── page.js            # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components
│   │   └── layout/           # Layout components
│   ├── lib/                   # Utility functions
│   │   ├── auth.js           # Authentication helpers
│   │   └── db.js             # Database connection
│   └── models/                # Mongoose models
│       ├── User.js
│       ├── ClassSession.js
│       ├── AttendanceRecord.js
│       ├── Course.js
│       └── Batch.js
├── public/                    # Static assets
├── middleware.js              # Next.js middleware
├── .env.local                 # Environment variables
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
└── README.md                  # This file
```

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# Start MongoDB
mongod

# Or check if it's running
ps aux | grep mongod
```

#### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution**: Kill the process or use a different port
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

#### JWT Secret Not Set
```
Error: JWT_SECRET is not defined
```
**Solution**: Add JWT_SECRET to `.env.local`
```env
JWT_SECRET=your-secret-key-here
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Workflow

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make Your Changes**
4. **Test Thoroughly**
   ```bash
   npm run build
   npm run lint
   ```
5. **Commit Your Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Write clean, readable code

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database
- Tailwind CSS for the styling system
- Lucide for the beautiful icons
- All contributors who help improve this project

---

## 📞 Support

Need help? Here's how to get support:

- 📧 **Email**: support@smartpresence.com
- 💬 **Discord**: [Join our community](https://discord.gg/smartpresence)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/smart-presence/issues)
- 📖 **Documentation**: [Full Docs](https://docs.smartpresence.com)

---

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] Mobile app (React Native)
- [ ] Offline mode with sync
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Export reports (PDF, Excel)
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Biometric authentication

### Version 1.5 (In Progress)
- [ ] Attendance reports
- [ ] Student attendance history
- [ ] Teacher analytics
- [ ] Bulk user import
- [ ] API documentation (Swagger)

---

<div align="center">

**Made with ❤️ by the Smart Presence Team**

⭐ Star us on GitHub — it helps!

[Website](https://smartpresence.com) • [Documentation](https://docs.smartpresence.com) • [Blog](https://blog.smartpresence.com)

</div>
