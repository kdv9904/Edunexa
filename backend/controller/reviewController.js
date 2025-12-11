import Review from '../model/reviewModel.js';
import Course from './../model/courseModel.js';

export const createReview = async(req, res) =>{
    try {
        const {rating, comment, courseId} = req.body;
        const userId = req.userId;
        const course = await Course.findById(courseId);
        if(!course) {
            return res.status(404).json({message: "Course not found"});
        }
        const alreadyReviewed = await Review.findOne({course: courseId, user: userId});
        if(alreadyReviewed){
            return res.status(400).json({message: "Review already given by you"});
        }
        const review = new Review({
            course: courseId,
            user: userId,
            rating,
            comment
        });
        await review.save();
        course.reviews.push(review._id);
        await course.save();
        return res.status(201).json({message: "Review created successfully", review});
    } catch (error) {
        console.error("CreateReview Error:", error);
        return res.status(500).json({message: "Internal server error", error: error.message});
    }
}

export const getReviews = async(req, res)=>{
     try {
         const reviews = await Review.find({})
           .populate("user", "name photoUrl description") // populate user with specific fields
           .populate("course", "title instructor") // populate course with specific fields
           .sort({reviewedAt: -1});
         
         return res.status(200).json({ 
           success: true,
           review: reviews // Keep as 'review' to match your existing structure
         });
     } catch (error) {
         console.error("GetReviews Error:", error);
         return res.status(500).json({
           success: false,
           message: "Internal server error", 
           error: error.message
         });
     }
}

export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id).populate('user', 'name photoUrl description');
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    return res.status(200).json({ review });
  } catch (error) {
    console.error("GetReviewById Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}