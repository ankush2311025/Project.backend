import express from "express";
import Attendance from "../models/Attendance.js";
import jwt from "jsonwebtoken";
const router = express.Router();

const verifyToken = (req,res,next)=>{
    const token = req.headers['authorization'];
    if(!token) return res.sendstatus (403);
    jwt.verify(token , process.env.JWT_SECRET,(err , decoded) => {
        if(err) return res.sendStatus (403);
        req.userId = decoded.id;
        req.userRole= decoded.role;
        next();
    });
    
};
// protected route eg.
router.get('/protected-route', verifyToken, (req, res) => {
    res.send('This is a protected route.');
});


//Update attendance (Admin and user)
router.post('/up-attendance', verifyToken, async(req,res) => {
    if (req.userRole !== 'admin' && req.userId !== userId)
        return res.sendStatus(403);

    const {userId,date,status} =req.body;
    const attendance = await Attendance.findOneAndupdate (
        { userId , date},
        {status},
        {new : true,
         upsert : true 
        }
    );
    res.json(attendance); 
    })

    //Get attendance for a user 
     router.get('/', verifyToken, async(req , res ) => {
        const attendance = await Attendance.find({
            userId: req.userId});
            res.json(attendance);
        });
export default router;


