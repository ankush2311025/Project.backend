import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date : {
        type: Date,
        default : Date.now
    },
    status:{
        type: String,
        enum : ['present','absent'],
        default: 'absent'
    }
});
export default mongoose.model('Attendance', attendanceSchema);