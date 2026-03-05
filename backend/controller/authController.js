import User from "../model/userModel.js";
import validator from 'validator';
import bcrypt from 'bcryptjs'
import generateToken from "../config/token.js";
import sendMail from "../config/sendMail.js";

export const signUp = async(req, res)=>{
    try{
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if(!validator.isStrongPassword(password)){
            return res.status(400).json({ message: 'Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.' });
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        let token = await generateToken(newUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async(req, res) => {
    try{
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid password" });
        }
        let token = await generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        res.status(200).json({ message: "Login successful", user });
    } catch(error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' }); 
    }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/"
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Internal server error' }); 
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendMail({ to: email, otp });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error during send OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isOtpVerified = true;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error during verifyOTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async(req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }   
        if(!user.isOtpVerified){
            return res.status(400).json({ message: "OTP not verified" });
        }
        if(!validator.isStrongPassword(password)){
            return res.status(400).json({ message: 'Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.' });
        }
        let hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpire = null;
        user.isOtpVerified = false;
        await user.save();
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }   
}

export const googleAuth = async(req, res) => {
    try {
        const { name, email, role, photoUrl } = req.body;

        // ✅ FIX: use let not const, so we can reassign when creating new user
        let user = await User.findOne({ email });

        if (!user) {
            // ✅ FIX: reassign let variable instead of const
            user = await User.create({
                name,
                email,
                role,
                photoUrl: photoUrl || "",
            });
        }

        let token = await generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        res.status(200).json({ user });
    } catch(error) {
        console.error('Error during Google auth:', error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}