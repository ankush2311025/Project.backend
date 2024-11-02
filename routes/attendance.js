import express from 'express';
import Attendance from '../models/Attendance.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token and check if the user is admin
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

// Route for admin to update attendance
router.post('/update', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Only admin can update attendance' });
    }

    const { userId, date, status, remarks } = req.body;

    try {
        // Update or create attendance record
        const attendance = await Attendance.findOneAndUpdate(
            { userId, date },
            { status, remarks },
            { new: true, upsert: true }  // `upsert: true` creates a new record if it doesn't exist
        );
        
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Error updating attendance', error });
    }
});

// Route to get a user's attendance (restricted to logged-in users)
router.get('/user-attendance', verifyToken, async (req, res) => {
    try {
        const attendance = await Attendance.find({ userId: req.userId });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Error check attendance', error });
    }
});

export default router;