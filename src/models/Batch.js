import mongoose from 'mongoose';

const BatchSchema = new mongoose.Schema({
    name: {
        type: String, // e.g., "MCA 2024-2026"
        required: true,
    },
    section: {
        type: String, // e.g., "A"
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    // Optional: Array of student IDs for quick lookup, though StudentProfile also links back
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

export default mongoose.models.Batch || mongoose.model('Batch', BatchSchema);
