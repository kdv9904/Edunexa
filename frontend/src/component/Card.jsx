import React, { useState, useEffect } from "react";
import { FaStar, FaUsers, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";

function Card({ thumbnail, title, category, price, id, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [courseRating, setCourseRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);

  const getGradientByIndex = (index) => {
    const gradients = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
      "from-teal-500 to-cyan-500",
      "from-rose-500 to-pink-500",
      "from-amber-500 to-yellow-500"
    ];
    return gradients[index % gradients.length];
  };

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!userData?.user?._id || !id) return;
      try {
        const localCheck = userData?.enrolledCourse?.some(c => (typeof c === 'string' ? c : c._id).toString() === id.toString());
        if (localCheck) {
          setIsEnrolled(true);
          return;
        }
        const verifyRes = await axios.post(`${serverUrl}/api/payment/check-enrollment`, { userId: userData.user._id, courseId: id }, { withCredentials: true });
        if (verifyRes.data.success && verifyRes.data.isEnrolled) {
          setIsEnrolled(true);
        }
      } catch (error) {
        console.log("❌ Error checking enrollment in Card:", error);
        const fallbackCheck = userData?.enrolledCourse?.some(c => (typeof c === 'string' ? c : c._id).toString() === id.toString());
        setIsEnrolled(fallbackCheck || false);
      }
    };
    checkEnrollment();
  }, [userData, id]);

  useEffect(() => {
    const fetchCourseRating = async () => {
      if (!id) return;
      try {
        setRatingLoading(true);
        const courseRes = await axios.get(`${serverUrl}/api/course/getcourse/${id}`, { withCredentials: true });
        const course = courseRes.data;
        
        if (course?.reviews && course.reviews.length > 0) {
          let validReviews = [];
          if (typeof course.reviews[0] === 'object' && course.reviews[0].rating !== undefined) {
            // Reviews are already full objects
            validReviews = course.reviews.filter(review => typeof review.rating === 'number' && !isNaN(review.rating));
          } else {
            // Reviews are IDs - Fetch each review's details
            validReviews = await Promise.all(course.reviews.map(async (reviewId) => {
              try {
                const reviewRes = await axios.get(`${serverUrl}/api/review/${reviewId}`, { withCredentials: true });
                return reviewRes.data.review;  // Assuming it returns { review: { rating: number, ... } }
              } catch (error) {
                console.error(`Error fetching review ${reviewId}:`, error);
                return null;  // Skip invalid reviews
              }
            })).then(reviews => reviews.filter(review => review && typeof review.rating === 'number' && !isNaN(review.rating)));
          }
          
          if (validReviews.length > 0) {
            const totalRating = validReviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = Number((totalRating / validReviews.length).toFixed(1));
            setCourseRating(averageRating);
            setReviewsCount(validReviews.length);
          } else {
            setCourseRating(0);
            setReviewsCount(0);
          }
        } else {
          setCourseRating(0);
          setReviewsCount(0);
        }
      } catch (error) {
        console.error("❌ Error fetching course rating in Card:", error);
        setCourseRating(0);
        setReviewsCount(0);
        toast.error("Error loading ratings");
      } finally {
        setRatingLoading(false);
      }
    };
    fetchCourseRating();
  }, [id]);

  const handleCardClick = () => {
    if (!userData?.user?._id) {
      toast.error("Please log in to access courses");
      navigate("/login");
      return;
    }
    navigate(`/viewcourse/${id}`);
  };

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border border-gray-100" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handleCardClick} style={{ animationDelay: `${index * 100}ms` }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradientByIndex(index)} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      <div className="relative overflow-hidden">
        <img src={thumbnail || "/fallback.jpg"} alt={title} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-white text-4xl transform scale-75 group-hover:scale-100 transition-transform duration-300">▶</div>
        </div>
        <div className="absolute top-4 left-4"><span className={`px-3 py-1 bg-gradient-to-r ${getGradientByIndex(index)} text-white text-xs font-semibold rounded-full backdrop-blur-sm`}>{category || "General"}</span></div>
        {isEnrolled && <div className="absolute bottom-4 left-4"><span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full backdrop-blur-sm">Enrolled</span></div>}
        <div className={`absolute inset-0 border-2 border-transparent bg-gradient-to-r ${getGradientByIndex(index)} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}><div className="w-full h-full bg-white rounded-3xl m-0.5"></div></div>
      </div>
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-gray-900 transition-colors leading-tight">{title}</h2>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1"><FaUsers className="text-gray-400" /><span>{formatNumber(1200)}</span></div>
            <div className="flex items-center gap-1"><FaClock className="text-gray-400" /><span>8h</span></div>
          </div>
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-semibold">
            <FaStar className="text-amber-400" />
            {ratingLoading ? <span className="text-gray-300">Loading...</span> : courseRating > 0 ? <><span>{courseRating}</span><span className="text-xs text-gray-400 ml-1">({formatNumber(reviewsCount)} reviews)</span></> : <span className="text-xs text-gray-400">No ratings</span>}
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{price ? `₹${price}` : "Free"}</span>
            {price && <span className="text-sm text-gray-400 line-through">₹{Math.round(price * 1.5)}</span>}
          </div>
          <div className={`px-4 py-2 text-sm font-semibold rounded-xl ${isEnrolled ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"}`}>{isEnrolled ? "Enrolled" : "View Course"}</div>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">{[...Array(3)].map((_, i) => (<div key={i} className={`absolute w-2 h-2 bg-gradient-to-r ${getGradientByIndex(index)} rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 animate-float`} style={{ left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${3 + Math.random() * 2}s` }}></div>))}</div>
    </div>
  );
}

export default Card;
