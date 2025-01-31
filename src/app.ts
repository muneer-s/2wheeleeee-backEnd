import dotenv from 'dotenv';
import connectDB from './database/mongoDB';
import userRouter from './routes/userRoutes';
import adminRouter from './routes/adminRoutes';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import hostRouter from './routes/hostRoutes';
import otpRouter from './routes/otpRoutes';
import morgan from 'morgan';
import logger from './utils/logger';
import orderRouter from './routes/orderRoutes';
import walletRouter from './routes/walletRoutes';



const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

dotenv.config();
connectDB();

const app = express();

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Routes 
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/bike', hostRouter);
app.use('/api/otp', otpRouter)
app.use('/api/order', orderRouter)
app.use('/api/wallet', walletRouter)

const port = process.env.PORT || 2000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




