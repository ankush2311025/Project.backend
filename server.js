import cors from "cors"; 
import express from "express"; 
import mongoose from "mongoose"; 
import bodyParser from "body-parser"; 
import authRoutes from "./routes/auth.js"; 
import dotenv from "dotenv";
import attendanceRotes from "./routes/attendance.js" ;
import adminRoutes from './routes/admin.js';
//const timetableRoutes = require('../routes/timetable.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT||5000;
app.use(cors()); 

//Middleware
app.use(bodyParser.json());
app.use(cors());


//Data base connection
mongoose.connect(process.env.MONGODB_URI,)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error',err));

//Routes
app.use('/api/auth',authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance',attendanceRotes);
//app.use('/api/timetable',timetableRoutes);
//app.use('/app/profile', profileRotes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});  