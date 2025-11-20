import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    name: {
        type: String, // e.g., "Data Structures & Algorithms"
        required: true,
    },
    code: {
        type: String, // e.g., "CS101"
        required: true,
        unique: true,
    },
    department: {
        type: String,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
