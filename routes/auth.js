import express from "express"; 
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import User from '../models/User.js';
//import multer from "multer"; 

const router = express.Router();  

// Sign Up
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;
    
    // Basic validation
    if (!email || !password || !name) {
        return res.status(400).json({
            error: 'Email, password and name are required.'
        });
    }
    
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Respond with success
        res.status(201).json({
            message: 'User created',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'User creation failed'
        });
    }
});

// Sign In
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid Details' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: 'Server error: Missing JWT secret' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signin failed' });
    }
    });    


export default router; 