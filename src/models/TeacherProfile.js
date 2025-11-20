import mongoose from 'mongoose';

const TeacherProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    employeeId: {
        type: String,
        required: true,
        unique: true,
    },
    department: {
        type: String,
        required: true,
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
}, { timestamps: true });

export default mongoose.models.TeacherProfile || mongoose.model('TeacherProfile', TeacherProfileSchema);
