import mongoose from 'mongoose';

const AttendanceRecordSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassSession',
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'],
        default: 'PRESENT',
    },
    markedAt: {
        type: Date,
        default: Date.now,
    },
    markedBy: {
        type: String,
        enum: ['STUDENT', 'TEACHER', 'CR'],
        required: true,
    },
    deviceId: {
        type: String, // From local storage
    },
    ipAddress: {
        type: String,
    },
    location: {
        lat: Number,
        lng: Number,
    },
    flags: {
        type: [String], // e.g., "SUSPICIOUS_DEVICE", "MULTIPLE_LOGINS"
        default: [],
    },
    isSynced: {
        type: Boolean, // For offline sync tracking
        default: true,
    },
}, { timestamps: true });

// Compound index to prevent duplicate attendance for same session + student
AttendanceRecordSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

export default mongoose.models.AttendanceRecord || mongoose.model('AttendanceRecord', AttendanceRecordSchema);
