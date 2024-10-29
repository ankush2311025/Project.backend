import express from "express"; 
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import User from '../models/user.js'; 
const router = express.Router();

//Sign Up
router.post('/signup', async(req,res) => {
    const {email,password,} = req.body;
    //Basic validation
    if(!email || !password){
        return res.status(400).json({
            error : 'Email and password are required.'
        });
    }
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({email,password: hashedPassword});
        await newUser.save();

        //Respond with success
        res.status(201).json({
            message : 'User created'
        });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({
        error : 'User creation failed'
    })

    }
});

//Sign In 
router.post('/signin', async(req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user || !(await bcrypt.compare(password,user.password)))
    
        return res.status(400).json({error : 'Invalid Details'});

    const token = jwt.sign({
        id:user._id,
        role:user.role
    },
    process.env.JWT_SECRET,
    {expiresIn:'600s'}
);
res.json({token})
});

export default router; 