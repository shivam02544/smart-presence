import mongoose from 'mongoose';

const StudentProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true,
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    deviceIds: {
        type: [String], // Array of registered device IDs for anti-proxy
        default: [],
    },
}, { timestamps: true });

export default mongoose.models.StudentProfile || mongoose.model('StudentProfile', StudentProfileSchema);
