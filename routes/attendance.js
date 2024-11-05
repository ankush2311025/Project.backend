import express from 'express';
import Attendance from '../models/Attendance.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token and check if the user is admin
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({message: 'Not auhorized'});

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({message: 'Not authorized'});
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

// Route for admin to update attendance
router.post('/update', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') {
        return res.status(400).json({ message: 'Only admin can update attendance' });
    }

    const { userId, date, status, remarks,name } = req.body;

    try {
        // Update or create attendance record
        const attendance = await Attendance.findOneAndUpdate(
            { userId, date },
            { status, remarks, name },
            { new: true, upsert: true }  // `upsert: true` creates a new record if it doesn't exist
        );
        
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Error updating attendance', error });
    }
});

//route to mark attendance as present or absent
router.post('/mark',verifyToken, async (req,res) => {
    const {status} = req.body;
    const date = new Date().toISOString().split('T')[0];

    //validation the status
    if(!['present', 'absent'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status.'});
    }
    try {
        const attendance = await Attendance.findOneAndUpdate(
            { userId: req.userId, date},
            {status},
            
            {new: true, upsert: true}
        );
        res.json({message: 'Attendance marked succefully', attendance});
    } catch (error){
        res.status(500).json({message:'Error marking attendance', error});
    }

});


// Route to get a user's attendance (restricted to logged-in users)
router.get('/user-attendance', verifyToken, async (req, res) => {
    try {
        const attendance = await Attendance.find();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Error check attendance', error });
    }

    //  attendance percentage
router.get('/attendance-percentage', verifyToken, async (req, res) => {
    try {
        const totalDays = await Attendance.countDocuments({ userId: req.userId });
        const presentDays = await Attendance.countDocuments({ userId: req.userId, status: 'Present' });

        if (totalDays === 0) {
            return res.json({ percentage: 0, message: "No attendance records found" });
        }

        const attendancePercentage = (presentDays / totalDays) * 100;
        res.json({ percentage: attendancePercentage.toFixed(2) });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating attendance percentage', error });
    }
});

});

export default router;