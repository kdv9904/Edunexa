import React, { useEffect, useState } from "react";
import { FaArrowLeftLong, FaLock, FaStar } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCourse } from "../redux/courseSlice";
import img from "../assets/empty.jpg";
import { FaPlayCircle } from "react-icons/fa";
import { serverUrl } from "../App";
import axios from "axios";
import Card from "../component/Card";
import { toast } from "react-toastify";

const ViewCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [creatorCourses, setCreatorCourses] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rating,setRating] = useState(0);
  const [comment,setComment] = useState("");
  const [reviewsData, setReviewsData] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const { creatorCourseData, selectedCourse } = useSelector(
    (state) => state.course
  );

  // ✅ Reset state when courseId changes
  useEffect(() => {
    setSelectedLecture(null);
    dispatch(setSelectedCourse(null));
    setIsEnrolled(false);
    setLoading(true);
  }, [courseId, dispatch]);

  // ✅ Check enrollment status
  useEffect(() => {
    checkEnrollment();
  }, [userData, courseId, selectedCourse]);

  const checkEnrollment = async () => {
    const localCheck = userData?.enrolledCourse?.some(c => 
      (typeof c === 'string' ? c : c._id).toString() === courseId?.toString()
    );
    
    if (localCheck) {
      setIsEnrolled(true);
      return;
    }

    if (userData?.user?._id && courseId) {
      try {
        const verifyRes = await axios.post(
          `${serverUrl}/api/payment/check-enrollment`,
          { userId: userData.user._id, courseId },
          { withCredentials: true }
        );
        
        if (verifyRes.data.success && verifyRes.data.isEnrolled) {
          setIsEnrolled(true);
        }
      } catch (error) {
        console.log("❌ Error checking enrollment:", error);
        const fallbackCheck = userData?.enrolledCourse?.some(c => 
          (typeof c === 'string' ? c : c._id).toString() === courseId?.toString()
        );
        setIsEnrolled(fallbackCheck || false);
      }
    }
  };

  // ✅ Fetch course with lectures
  useEffect(() => {
    const fetchCourseWithLectures = async () => {
      try {
        setLoading(true);
        
        const freshCourse = await axios.get(
          `${serverUrl}/api/course/getcourse/${courseId}`,
          { withCredentials: true }
        );
        
        const course = freshCourse.data;
        
        if (course) {
          let detailedLectures = [];
          
          if (course.lectures && course.lectures.length > 0) {
            if (typeof course.lectures[0] === 'object' && course.lectures[0].lectureTitle) {
              detailedLectures = course.lectures.map(lec => ({
                _id: lec._id,
                lectureTitle: lec.lectureTitle || "Untitled Lecture",
                videoUrl: lec.videoUrl || "",
                isPreviewFree: lec.isPreviewFree || false,
              }));
            } else {
              for (const lectureId of course.lectures) {
                try {
                  const lectureRes = await axios.get(
                    `${serverUrl}/api/course/courselecture/${courseId}`,
                    { withCredentials: true }
                  );
                  
                  if (lectureRes.data.lectures && lectureRes.data.lectures.length > 0) {
                    detailedLectures = lectureRes.data.lectures.map(lec => ({
                      _id: lec._id,
                      lectureTitle: lec.lectureTitle || "Untitled Lecture",
                      videoUrl: lec.videoUrl || "",
                      isPreviewFree: lec.isPreviewFree || false,
                    }));
                  }
                  break;
                } catch (error) {
                  console.log("❌ Error fetching lecture details:", error);
                }
              }
            }
          }

          dispatch(setSelectedCourse({ ...course, lectures: detailedLectures }));
          
          if (detailedLectures.length > 0) {
            const firstAccessibleLecture = detailedLectures.find(lec => 
              lec.isPreviewFree || isEnrolled
            ) || detailedLectures[0];
            setSelectedLecture(firstAccessibleLecture);
          }
        }
      } catch (error) {
        console.log("❌ Error fetching course:", error);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseWithLectures();
    }
  }, [courseId, dispatch, isEnrolled]);

  // ✅ Handle lecture selection
  const handleLectureSelect = (lecture) => {
    if (lecture.isPreviewFree || isEnrolled) {
      setSelectedLecture(lecture);
      
      if (!lecture.videoUrl) {
        if (lecture.isPreviewFree) {
          toast.info("Preview video not available for this lecture");
        } else {
          toast.info("Video content will be available soon");
        }
      }
    } else {
      toast.info("Please enroll in the course to access this lecture");
    }
  };

  // ✅ Fetch creator info
  useEffect(() => {
    const handleCreator = async () => {
      const creatorId = selectedCourse?.creator?._id || selectedCourse?.creator;
      if (!creatorId) return;

      try {
        const res = await axios.post(
          `${serverUrl}/api/course/creator`,
          { userId: creatorId },
          { withCredentials: true }
        );
        setCreatorData(res.data);
      } catch (error) {
        console.log("❌ Error fetching creator:", error);
      }
    };

    if (selectedCourse) {
      handleCreator();
    }
  }, [selectedCourse]);

  // ✅ Fetch other courses by the same creator
  useEffect(() => {
    if (creatorData?._id && creatorCourseData?.length > 0) {
      const otherCourses = creatorCourseData.filter(
        (course) => course.creator === creatorData._id && course._id !== courseId
      );
      setCreatorCourses(otherCourses);
    }
  }, [creatorData, creatorCourseData, courseId]);
   
  const handleEnroll = async () => {
    const userId = userData?.user?._id;
    const currentCourseId = courseId;

    if (!userData?.user || !userId) {
      toast.error("Please log in to enroll in courses");
      navigate("/login");
      return;
    }

    if (isEnrolled) {
      navigate(`/learn/${courseId}`);
      return;
    }

    try {
      const orderData = await axios.post(
        serverUrl + "/api/payment/razorpay-order", 
        { userId, courseId: currentCourseId }, 
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.order.amount,
        currency: "INR",
        name: "AILMS",
        description: "Course Enrollment Payment",
        order_id: orderData.data.order.id,
        handler: async function (response) {
          try {
            const verifyPayment = await axios.post(
              serverUrl + "/api/payment/verify-payment", 
              { 
                ...response,
                courseId: currentCourseId, 
                userId: userId 
              }, 
              { withCredentials: true }
            );
            if (verifyPayment.data.success) {
              setIsEnrolled(true);
              toast.success("Enrollment successful! Redirecting...");
              
              setTimeout(() => {
                window.location.reload();
              }, 1500);
              
            } else {
              toast.error(verifyPayment.data.message || "Payment verification failed");
            }
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
            console.log("❌ Error in payment verification:", error);
          }
        },
        prefill: {
          name: userData?.user?.name || "",
          email: userData?.user?.email || "",
        },
        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

    } catch (error) {
      console.log("❌ Error in RazorpayOrder:", error);
      toast.error("Failed to create payment order");
    }
  };

  const handleWatchNow = () => {
    if (isEnrolled) {
      navigate(`/viewlecture/${courseId}`);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) {
      toast.error("Please provide both rating and comment");
      return;
    }

    if (!userData?.user?._id) {
      toast.error("Please login to submit review");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/review/createreview`,
        {
          rating,
          comment,
          courseId
        },
        { withCredentials: true }
      );

      if (response.data.message === "Review created successfully") {
        toast.success("Review submitted successfully!");
        setRating(0);
        setComment("");
      }
    } catch (error) {
      if (error.response?.data?.message === "Review already given by you") {
        toast.error("You have already reviewed this course");
      } else {
        toast.error("Failed to submit review");
      }
      console.log("❌ Error submitting review:", error);
    }
  };

  useEffect(() => {
    const fetchReviewDetails = async () => {
      if (selectedCourse?.reviews && selectedCourse.reviews.length > 0) {
        try {
          setReviewsLoading(true);
          
          if (typeof selectedCourse.reviews[0] === 'object' && selectedCourse.reviews[0].rating !== undefined) {
            setReviewsData(selectedCourse.reviews);
          } else {
            const reviewDetails = [];
            
            for (const reviewId of selectedCourse.reviews) {
              try {
                const reviewRes = await axios.get(
                  `${serverUrl}/api/review/${reviewId}`,
                  { withCredentials: true }
                );
                if (reviewRes.data.review) {
                  reviewDetails.push(reviewRes.data.review);
                }
              } catch (error) {
                console.log(`❌ Error fetching review ${reviewId}:`, error);
              }
            }
            
            setReviewsData(reviewDetails);
          }
        } catch (error) {
          console.log("❌ Error fetching review details:", error);
          setReviewsData([]);
        } finally {
          setReviewsLoading(false);
        }
      } else {
        setReviewsData([]);
        setReviewsLoading(false);
      }
    };

    if (selectedCourse) {
      fetchReviewDetails();
    }
  }, [selectedCourse]);

  const calculateAvgReview = (reviews) => {
    const reviewsToCalculate = reviewsData.length > 0 ? reviewsData : reviews;
    
    if (!reviewsToCalculate || !Array.isArray(reviewsToCalculate) || reviewsToCalculate.length === 0) {
      return 0;
    }
    
    const validReviews = reviewsToCalculate.filter(review => 
      review && 
      typeof review === 'object' && 
      typeof review.rating === 'number' && 
      !isNaN(review.rating)
    );
    
    if (validReviews.length === 0) return 0;
    
    const total = validReviews.reduce((sum, review) => sum + review.rating, 0);
    const avg = total / validReviews.length;
    
    return isNaN(avg) ? 0 : Number(avg.toFixed(1));
  }

  const avgRatings = calculateAvgReview(selectedCourse?.reviews);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }
        
  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
            <span className="text-3xl text-gray-400">📚</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-4">Course Not Found</h3>
          <p className="text-gray-500 mb-6 max-w-md">The course you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 p-6">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <button 
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-blue-300"
        >
          <FaArrowLeftLong className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"/>
          <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">Back to Home</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        {/* ===== Top Section ===== */}
        <div className="flex flex-col md:flex-row gap-8 p-8">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={selectedCourse.thumbnail || img}
                alt="Course Thumbnail"
                className="rounded-2xl w-full h-80 object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800 shadow-lg">
                  {selectedCourse.category}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/2 space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {selectedCourse.title || "Untitled Course"}
              </h2>
              <p className="text-gray-600 text-lg mt-2">{selectedCourse.subTitle}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-semibold">
                <FaStar className="text-amber-400 text-xl" />
                <span className="text-lg">{avgRatings}</span>
                <span className="text-gray-500 text-sm">({reviewsData.length} reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                ₹{selectedCourse.price || "0"}
              </span>
              <span className="text-xl text-gray-400 line-through">
                ₹{Math.round((selectedCourse.price || 0) * 1.5)}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                Save {Math.round(((selectedCourse.price * 1.5 - selectedCourse.price) / (selectedCourse.price * 1.5)) * 100)}%
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span>Lifetime access to course materials</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <span>{selectedCourse.lectures?.length || 0} comprehensive lectures</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <span>Certificate of completion</span>
              </div>
            </div>

            {isEnrolled ? (
              <button 
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 mt-4"
                onClick={handleWatchNow}
              >
                <FaPlayCircle className="text-xl" />
                Continue Learning
              </button>
            ) : (
              <button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mt-4"
                onClick={handleEnroll}
              >
                Enroll Now - ₹{selectedCourse.price}
              </button>
            )}
          </div>
        </div>

        {/* ===== Description Sections ===== */}
        <div className="px-8 pb-8 space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">What you will learn</h2>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Master {selectedCourse.category} from beginning to advanced level
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Build real-world projects and applications
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Learn industry best practices and standards
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">This Course is For</h2>
            <p className="text-gray-700">
              Beginners, aspiring Developers, and Professionals looking to upgrade their skills in {selectedCourse.category}.
            </p>
          </div>
        </div>

        {/* ===== Curriculum Section ===== */}
        <div className="flex flex-col lg:flex-row gap-8 p-8 bg-gray-50">
          <div className="bg-white w-full lg:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              Course Curriculum
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {selectedCourse.lectures?.length || 0} Lecture(s)
              {selectedCourse.lectures?.some(lec => lec.isPreviewFree) && 
                ` • ${selectedCourse.lectures.filter(lec => lec.isPreviewFree).length} Preview(s)`
              }
            </p>

            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
              {selectedCourse.lectures?.length > 0 ? (
                selectedCourse.lectures.map((lecture, index) => (
                  <button
                    key={lecture._id}
                    onClick={() => handleLectureSelect(lecture)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl border-2 transition-all duration-300 text-left group ${
                      lecture.isPreviewFree || isEnrolled
                        ? "hover:shadow-lg cursor-pointer border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        : "cursor-not-allowed opacity-60 border-gray-100"
                    } ${
                      selectedLecture?._id === lecture._id
                        ? "bg-blue-50 border-blue-300 shadow-md"
                        : "bg-white"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      lecture.isPreviewFree || isEnrolled
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}>
                      {lecture.isPreviewFree || isEnrolled ? (
                        <FaPlayCircle className="text-sm" />
                      ) : (
                        <FaLock className="text-sm" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800 block text-left">
                        {index + 1}. {lecture.lectureTitle || "Untitled Lecture"}
                      </span>
                    </div>
                    {lecture.isPreviewFree && !isEnrolled && (
                      <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                        Preview
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaPlayCircle className="text-gray-400 text-xl" />
                  </div>
                  <p className="text-gray-500">No lectures available yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white w-full lg:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="aspect-video w-full rounded-xl overflow-hidden mb-6 bg-black flex items-center justify-center shadow-lg">
              {selectedLecture?.videoUrl ? (
                <video
                  className="w-full h-full object-cover"
                  src={selectedLecture.videoUrl}
                  controls
                  autoPlay={false}
                >
                  Your browser does not support the video tag.
                </video>
              ) : selectedLecture ? (
                <div className="text-white text-center p-8">
                  <FaPlayCircle className="text-6xl mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">
                    {selectedLecture.isPreviewFree 
                      ? "Preview Coming Soon" 
                      : isEnrolled 
                        ? "Video Content in Progress" 
                        : "Enroll to Access"
                    }
                  </p>
                  <p className="text-sm opacity-75">
                    {selectedLecture.isPreviewFree 
                      ? "Free preview will be available shortly" 
                      : "Full video content is being prepared"
                    }
                  </p>
                </div>
              ) : (
                <div className="text-white text-center p-8">
                  <FaPlayCircle className="text-6xl mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select a Lecture</p>
                  <p className="text-sm opacity-75 mt-2">Choose from the curriculum to start learning</p>
                </div>
              )}
            </div>

            {/* Lecture Info */}
            {selectedLecture && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {selectedLecture.lectureTitle}
                </h3>
                {selectedLecture.isPreviewFree && !isEnrolled && (
                  <p className="text-green-600 font-medium text-sm">
                    ⭐ Free Preview - Enroll to access all lectures
                  </p>
                )}
                {!selectedLecture.videoUrl && (
                  <p className="text-yellow-600 text-sm">
                    ⚠️ Video content is being prepared
                  </p>
                )}
              </div>
            )}
            
            {/* ===== Review Section ===== */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Share Your Experience</h2>
              
              {/* Rating Stars */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-700 font-medium">Rate this course:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        rating >= star ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <span className="text-sm text-gray-600 ml-2">
                    ({rating} {rating === 1 ? 'star' : 'stars'})
                  </span>
                )}
              </div>

              {/* Comment Textarea */}
              <div className="mb-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this course... What did you like? What could be improved?"
                  className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:border-black transition-colors"
                  rows="4"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitReview}
                disabled={!rating || !comment.trim()}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  !rating || !comment.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                }`}
              >
                Submit Review
              </button>

              {/* Info Text */}
              <p className="text-sm text-gray-500 mt-3">
                Your review will help other students make better learning decisions.
              </p>
            </div>
          </div>
        </div>

        {/* ===== Creator Info ===== */}
        <div className="p-8 border-t border-gray-200">
          <div className="flex items-center gap-6">
            {creatorData?.photoUrl ? (
              <img
                src={creatorData.photoUrl}
                alt={creatorData.name}
                className="w-16 h-16 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-2xl shadow-lg">
                {creatorData?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {creatorData?.name || "Unknown Instructor"}
              </h3>
              {creatorData?.description && (
                <p className="text-gray-600 mt-1">{creatorData.description}</p>
              )}
              {creatorData?.email && (
                <p className="text-gray-500 text-sm mt-1">{creatorData.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* ===== Other Courses by Creator ===== */}
        {creatorCourses.length > 0 && (
          <div className="p-8 border-t border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              More Courses by {creatorData?.name || "this Instructor"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creatorCourses.map((course, index) => (
                <Card 
                  key={course._id} 
                  thumbnail={course.thumbnail} 
                  id={course._id} 
                  price={course.price} 
                  title={course.title} 
                  category={course.category}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCourse;