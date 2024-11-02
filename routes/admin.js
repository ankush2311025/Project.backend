
import express from 'express';
import User from '../models/User.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/users', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Delete a user by ID (Admin only)
router.delete('/user/:id', verifyAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

// Update user role (Admin only)
router.put('/user/:id/role', verifyAdmin, async (req, res) => {
    const { role } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
    }
});

export default router;