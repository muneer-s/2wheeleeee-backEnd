import dotenv from 'dotenv';
import connectDB from './database/mongoDB'; 
import userRouter from './routes/userRoutes';
import adminRouter from './routes/adminRoutes';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'; 
import { adminAuthMiddleware } from './config/adminAuthMiddleware';


const corsOptions = {
  origin: 'http://localhost:5175', 
  credentials: true,             
  methods: 'GET,POST,PUT,DELETE', 
  allowedHeaders: 'Content-Type,Authorization',
};

dotenv.config(); 
connectDB();

const app = express();
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes 
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

const port = process.env.PORT || 2000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




