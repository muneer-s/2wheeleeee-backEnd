import dotenv from 'dotenv';
import connectDB from './database/mongoDB'; // Ensure the path is correct
import userRouter from './routes/userRoutes';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'; // CORS Middleware



const corsOptions = {
  origin: 'http://localhost:5173', // Allow only this origin
  credentials: true,              // Allow cookies and credentials
  methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
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




