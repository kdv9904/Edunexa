import express from 'express'
import { signUp, login, logout, verifyOTP, resetPassword, sendOTP, googleAuth } from './../controller/authController.js';

const authRoute = express.Router()

authRoute.post('/signup',signUp);
authRoute.post('/login',login)
authRoute.post('/logout',logout);
authRoute.post('/sendotp',sendOTP);
authRoute.post('/verifyotp',verifyOTP);
authRoute.post('/resetpassword',resetPassword);
authRoute.post('/googleauth',googleAuth);

export default authRoute;

