import mongoose from 'mongoose';

const ClassSessionSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true,
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'CLOSED', 'ARCHIVED'],
        default: 'ACTIVE',
    },
    sessionCode: {
        type: String, // Short numeric code for manual entry
    },
    currentQRToken: {
        type: String, // Dynamic token for QR
    },
    isOfflineMode: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Could be Teacher or CR
    },
}, { timestamps: true });

export default mongoose.models.ClassSession || mongoose.model('ClassSession', ClassSessionSchema);
