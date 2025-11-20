import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            maxlength: [60, 'Name cannot be more than 60 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            select: false, // Do not return password by default
        },
        role: {
            type: String,
            enum: ['ADMIN', 'TEACHER', 'CR', 'STUDENT'],
            default: 'STUDENT',
        },
        // Optional: Link to specific profile ID if needed, or just query by userId in profile models
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
