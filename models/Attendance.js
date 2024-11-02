import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['present', 'absent', ],
        required: true,
    },
    remarks: {
        type: String,
        default: '',
    },

}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;