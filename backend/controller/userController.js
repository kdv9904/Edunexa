import User from './../model/userModel.js';
import path from "path";
import uploadOnCloudinary from "../config/cloudinary.js";

// Get current logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    // Make sure JWT middleware sets req.userId
    const user = await User.findById(req.userId).select('-password').populate("enrolledCourses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Wrap in `user` key for frontend consistency
    return res.status(200).json({ user });
  } catch (error) {
    console.error("GetCurrentUser Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, description } = req.body;

    let photoUrl;
    if (req.file) {
      const absolutePath = path.resolve(req.file.path);
      const cloudRes = await uploadOnCloudinary(absolutePath);
      photoUrl = cloudRes.url; // <-- store only the URL string
    }

    const updateData = { name, description };
    if (photoUrl) updateData.photoUrl = photoUrl;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (error) {
    console.error("UpdateProfile Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
