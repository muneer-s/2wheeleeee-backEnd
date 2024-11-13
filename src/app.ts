import dotenv from 'dotenv';
import connectDB from './database/mongoDB'; // Ensure the path is correct
import userRouter from './routes/users';
import cookieParser from 'cookie-parser';
import express from 'express';

dotenv.config();

// Connect to the database
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes 
app.use('/api', userRouter);

const port = process.env.PORT || 2000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




