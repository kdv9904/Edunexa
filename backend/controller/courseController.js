import Course from "../model/coursemodel.js";
import uploadOnCloudinary from '../config/cloudinary.js';
import Lecture from "../model/lactureModel.js";
import User from '../model/userModel.js';
export const createCourse = async(req, res) =>{
    try {
        const {title, category} = req.body;
        if(!title || !category){
            return res.status(400).json({message:"title or Category is required"})
        }
        const course = await Course.create({
            title, category, creator:req.userId
        })
        return res.status(201).json(course)
    } catch (error) {
        return res.status(500).json({message:`CreateCourse error: ${error}`}) 
    }
}

export const getPublishedCourses = async(req,res)=>{
    try {
        const courses = await Course.find({isPublished:true}).populate("lectures reviews");
        if(!courses){
            return res.status(400).json({message:"Courses is not found"})
        }
        return res.status(200).json(courses)
    } catch (error) {
        console.error("Error in getPublishedCourse:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const courses = await Course.find({ creator: userId }).populate("lectures"); // ✅ populate lectures
    if (!courses) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: `failed to get creator course ${error}` });
  }
};


export const editCourse = async(req, res)=>{
    try {
        const {courseId} = req.params;
        const {title, subTitle, description, category, level, isPublished, price} = req.body;
        let thumbnail
        if(req.file){
            thumbnail = await uploadOnCloudinary(req.file.path);
        }
        let course = await Course.findById(courseId);
        if(!course){
            return res.status(400).json({message:'course not found'});
        }

        const updateData = {
            title, 
            subTitle, 
            description, 
            category, 
            level, 
            isPublished, 
            price, 
            thumbnail: thumbnail?.url || course.thumbnail // ← ONLY CHANGE THIS LINE
        }
        
        course = await Course.findByIdAndUpdate(courseId, updateData, {new:true})
        return res.status(200).json(course)
        
    } catch (error) {
        return res.status(500).json({message:`failed to edit Course ${error}`})
    }
}

export const getCourseById = async(req, res) =>{
    try {
        const {courseId} = req.params;
        let course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message:"Course is not found"})
        }
        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({message:`failed to get course ${error}`})
    }
}

export const removeCourse = async(req,res) =>{
    try{
        const {courseId} = req.params;
        let course = await Course.findById(courseId);
        if(!course){
            return res.status(400).json({message:"Course is not found"})
        }
        course = await Course.findByIdAndDelete(courseId, {new:true})
        return res.status(200).json({message:"course removed"})
    }catch(error){
        return res.status(500).json({message:`failed to delete course ${error}`})
    }
}

//for lecture
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({ message: "Lecture title is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lecture = await Lecture.create({ lectureTitle });
    course.lectures.push(lecture._id);
    await course.save();
    await course.populate("lectures");

    return res.status(201).json({ lectures: course.lectures });
  } catch (error) {
    return res.status(500).json({ message: `Failed to create lecture: ${error}` });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ lectures: course.lectures });
  } catch (error) {
    return res.status(500).json({ message: `Failed to get course lectures: ${error}` });
  }
};


export const editLecture = async(req,res)=>{
    try{
        const {lectureId} = req.params
        const {isPreviewFree, lectureTitle} = req.body
        const lecture = await Lecture.findById(lectureId)
        
        if(!lecture){
            return res.status(404).json({message:"Lecture not found"})
        }
        
        let videoUrl = lecture.videoUrl;

        if(req.file){
            console.log("Processing file upload...", req.file);
            
            const uploadResult = await uploadOnCloudinary(req.file.path);
            if(uploadResult && uploadResult.url) {
                videoUrl = uploadResult.url;
                console.log("Video uploaded successfully:", videoUrl);
            } else {
                return res.status(400).json({message:"Failed to upload video to Cloudinary"});
            }
        }
        
        // Update all lecture fields
        lecture.lectureTitle = lectureTitle || lecture.lectureTitle;
        lecture.isPreviewFree = isPreviewFree;
        lecture.videoUrl = videoUrl;
        
        await lecture.save();
        
        console.log("Lecture saved successfully, sending response...");
        
        // **CRITICAL: Make sure this response is sent**
        return res.status(200).json({
            success: true,
            message: "Lecture updated successfully",
            lecture: lecture
        });
        
    }catch(error){
        console.error("Edit lecture error:", error);
        // **CRITICAL: Make sure error response is sent**
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to edit lecture"
        });
    }
}

export const removeLecture = async(req,res)=>{
    try{
        const {lectureId} = req.params
        const lecture = await Lecture.findByIdAndDelete(lectureId) // Fixed: findByAndDelete → findByIdAndDelete
        
        if(!lecture){
            return res.status(404).json({message:"Lecture not found"})
        }
        
        await Course.updateOne(
            {lectures: lectureId},
            {$pull: {lectures: lectureId}}
        )
        return res.status(200).json({message:"Lecture removed successfully"})
    }catch(error){
        console.error("Remove lecture error:", error);
        return res.status(500).json({message:`Failed to remove lecture: ${error.message}`});
    }
}

//get Creator

export const getCreatorById = async(req,res)=>{
    try{
        const {userId} = req.body;
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json(user)
    }
    catch(error){
        return res.status(500).json({message:`Failed to get creator: ${error}`})
    }
}

// ✅ Educator Stats (for dashboard)
export const getEducatorStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all courses created by this educator
    const courses = await Course.find({ creator: userId })
      .populate("enrolledStudents", "name email");

    let totalCourses = courses.length;
    let totalStudents = 0;
    let totalEarnings = 0;

    courses.forEach(course => {
      const enrolled = course.enrolledStudents?.length || 0;
      totalStudents += enrolled;
      totalEarnings += (course.price || 0) * enrolled;
    });

    // temporary chart (later can link to payment data)
    const monthlyEarnings = [
      { month: "Jan", earning: totalEarnings * 0.05 },
      { month: "Feb", earning: totalEarnings * 0.1 },
      { month: "Mar", earning: totalEarnings * 0.15 },
      { month: "Apr", earning: totalEarnings * 0.2 },
      { month: "May", earning: totalEarnings * 0.25 },
      { month: "Jun", earning: totalEarnings * 0.3 },
    ];

    return res.status(200).json({
      totalCourses,
      totalStudents,
      totalEarnings,
      monthlyEarnings,
    });
  } catch (error) {
    console.error("Error in getEducatorStats:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
