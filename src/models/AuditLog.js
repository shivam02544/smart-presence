import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    action: {
        type: String,
        required: true,
    },
    details: {
        type: mongoose.Schema.Types.Mixed, // Flexible JSON structure
    },
    ipAddress: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
