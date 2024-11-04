/*import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();


//middleware to verify token 
const verifyToken = (req,res,next) => {
    const token = req.headers['authorization'];
    if(!token) return res.sendStatus(403);
    jwt.verify(token,process.env.JWT_SECERT,
        (err,decoded) => {
            if (err) return res.sendStatus(403);
            req.userId = decoded.id;
            next();
        }
    )};

    //Get user profile 
    router.get('/', verifyToken, async(req,res) => {
        const user = await User.findById (req.userId).select("-password");

        if (!user) return res.sendStatus(404);
        res.json(user);
    });
     
    //Update user profile
router.put('/', verifyToken, async (req,res) => {
    const {name,image}= req.body;
    const updateUser = await User.findByIdAndUpdate(req.userId,{name,image},
        {new:true}.select()
    )
})*/