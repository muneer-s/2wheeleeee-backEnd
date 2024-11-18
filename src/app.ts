import dotenv from 'dotenv';
import connectDB from './database/mongoDB'; 
import userRouter from './routes/userRoutes';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'; 



const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true,             
  methods: 'GET,POST,PUT,DELETE', 
  allowedHeaders: 'Content-Type,Authorization',
};

dotenv.config();

// Connect to the database
connectDB();

const app = express();
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes 
app.use('/api', userRouter);

const port = process.env.PORT || 2000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




