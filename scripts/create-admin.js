/**
 * Create Admin User Script
 * 
 * This script creates an admin user in the database.
 * Run with: node scripts/create-admin.js
 */

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'TEACHER', 'CR', 'STUDENT'],
    default: 'STUDENT',
  },
}, { timestamps: true });

async function createAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email: admin@example.com');
      console.log('If you forgot the password, delete this user from MongoDB and run this script again.');
      process.exit(0);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('═══════════════════════════════════════\n');
    console.log('⚠️  IMPORTANT: Change this password after first login!\n');

    // Create sample teacher
    const teacherExists = await User.findOne({ email: 'teacher@example.com' });
    if (!teacherExists) {
      console.log('👨‍🏫 Creating sample teacher...');
      await User.create({
        name: 'Teacher Demo',
        email: 'teacher@example.com',
        password: hashedPassword,
        role: 'TEACHER',
      });
      console.log('✅ Teacher created: teacher@example.com / admin123\n');
    }

    // Create sample student
    const studentExists = await User.findOne({ email: 'student@example.com' });
    if (!studentExists) {
      console.log('👨‍🎓 Creating sample student...');
      await User.create({
        name: 'Student Demo',
        email: 'student@example.com',
        password: hashedPassword,
        role: 'STUDENT',
      });
      console.log('✅ Student created: student@example.com / admin123\n');
    }

    console.log('🎉 Setup complete! You can now login to the application.\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure MongoDB is running');
    console.error('2. Check your MONGODB_URI in .env.local');
    console.error('3. Ensure you have internet connection (if using MongoDB Atlas)\n');
    process.exit(1);
  }
}

createAdmin();
