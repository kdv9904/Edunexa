import express from 'express';
import isAuth from './../middleware/isAuth.js';
import { getCurrentUser, updateProfile } from '../controller/userController.js';
import upload from '../middleware/multer.js';
import uploadProfileImage from '../middleware/uploadProfileImage.js';

const userRoute = express.Router();

userRoute.get("/getcurrentuser", isAuth, getCurrentUser);
userRoute.post("/profile", isAuth, uploadProfileImage.single("photoUrl"), updateProfile);

export default userRoute;
