import express from 'express'
import { createCourse, editCourse, getCourseById, getPublishedCourses, removeCourse, getCreatorCourses, createLecture, getCourseLecture, editLecture, removeLecture, getCreatorById, getEducatorStats} from '../controller/courseController.js'
import isAuth from './../middleware/isAuth.js';
import upload from '../middleware/multer.js';
import uploadProfileImage from '../middleware/uploadProfileImage.js';
import { searchWithAi } from '../controller/searchController.js';

const courseRouter = express.Router()

courseRouter.post("/create",isAuth,createCourse);
courseRouter.get("/getpublished",getPublishedCourses);
courseRouter.get("/getcreator",isAuth, getCreatorCourses);
courseRouter.post("/editcourse/:courseId",isAuth, uploadProfileImage.single("thumbnail"), editCourse);
courseRouter.delete("/remove/:courseId",isAuth, removeCourse);
courseRouter.get("/getcourse/:courseId",isAuth, getCourseById);
courseRouter.post("/creator",isAuth,getCreatorById );

// for Lecture
courseRouter.post("/createlecture/:courseId",isAuth, createLecture)
courseRouter.get("/courselecture/:courseId", isAuth, getCourseLecture)
courseRouter.post("/editlecture/:lectureId", isAuth, upload.single("videoUrl"), editLecture)
courseRouter.delete("/removelecture/:lectureId", isAuth, removeLecture)
courseRouter.get("/educator-stats", isAuth, getEducatorStats);

//search ai
courseRouter.post("/search", searchWithAi);

// New route to get course rating
courseRouter.get('/getcourse-rating/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).populate('reviews');  // Assuming reviews are referenced

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!course.reviews || course.reviews.length === 0) {
      return res.json({ success: true, averageRating: 0, reviewsCount: 0 });
    }

    const validReviews = course.reviews.filter(review => typeof review.rating === 'number' && !isNaN(review.rating));
    if (validReviews.length === 0) {
      return res.json({ success: true, averageRating: 0, reviewsCount: 0 });
    }

    const totalRating = validReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Number((totalRating / validReviews.length).toFixed(1));
    res.json({ success: true, averageRating, reviewsCount: validReviews.length });
  } catch (error) {
    console.error('Error fetching course rating:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default courseRouter;