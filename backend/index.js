import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/connectDB.js';
import cookieParser from 'cookie-parser';
import authRoute from './route/authRoute.js';
import cors from 'cors';
import userRoute from './route/userRoute.js';
import courseRouter from './route/courseRoute.js';
import paymentRouter from './route/paymentRoute.js';
import reviewRouter from './route/reviewRoute.js';

dotenv.config();

const port = process.env.PORT || 8000;
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:"http://localhost:5173",
credentials:true,
}))

app.use('/api/auth',authRoute);
app.use('/api/user',userRoute);
app.use('/api/course',courseRouter);
app.use('/api/payment',paymentRouter);
app.use('/api/review',reviewRouter)
app.get('/', (req, res) => {
  res.send('Hello World!')
})
const server = app.listen(port, () => {
    connectDB();
  console.log(`Server is running on http://localhost:${port}`)
})

server.timeout = 300000; 