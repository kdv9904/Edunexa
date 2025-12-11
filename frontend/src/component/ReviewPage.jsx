import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReviewCard from './ReviewCard';
import useGetAllReviews from '../customHooks/getAllReviews';
import { FaStar, FaQuoteLeft, FaRocket, FaUsers, FaHeart } from 'react-icons/fa';

const ReviewPage = () => {
  useGetAllReviews();
  
  const { reviewData } = useSelector(state => state.review);
  const [latestReview, setLatestReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (reviewData) {
      if (Array.isArray(reviewData) && reviewData.length > 0) {
        setLatestReview(reviewData.slice(0, 6));
      } else {
        console.log("reviewData is empty or not an array");
        setLatestReview([]);
      }
    }
    setLoading(false);
    setIsVisible(true);
  }, [reviewData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-white via-gray-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-20 bg-gradient-to-br from-white via-gray-50 to-cyan-50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section - Matching CardPage Structure */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-16">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-6">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Student Testimonials
              </span>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mt-2">
                Real <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Reviews</span>, Real Results
              </h2>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg mb-8 hover:shadow-xl transition-all duration-300">
              <p className="text-lg text-gray-600 leading-relaxed">
                Discover what our learners have to say about their experiences with our courses. 
                Read authentic reviews and testimonials from students who have transformed their 
                skills and careers through our platform.
              </p>
            </div>

            {/* Stats - Matching CardPage Style */}
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { number: "4.9/5", label: "Average Rating", gradient: "from-blue-500 to-cyan-500" },
                { number: "10K+", label: "Happy Students", gradient: "from-purple-500 to-pink-500" },
                { number: "500+", label: "Courses Rated", gradient: "from-orange-500 to-red-500" },
                { number: "98%", label: "Satisfaction", gradient: "from-green-500 to-emerald-500" }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.number}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center gap-3">
                Share Your Experience
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Filter Section - Matching CardPage Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <FaStar className="text-yellow-500" />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">4.9/5 Average</div>
                    <div className="text-xs text-gray-600">Based on 2,500+ reviews</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <FaUsers className="text-purple-500" />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">10K+ Students</div>
                    <div className="text-xs text-gray-600">Shared their experiences</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <FaHeart className="text-green-500" />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">98% Positive</div>
                    <div className="text-xs text-gray-600">Would recommend to others</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid - Matching CardPage Card Style */}
        <div className="mb-16">
          {latestReview.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <FaQuoteLeft className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">No Reviews Yet</h3>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm max-w-md mx-auto">
                <p className="text-gray-500">
                  Be the first to share your learning experience!
                </p>
              </div>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {latestReview.map((review, index) => (
                <div 
                  key={review._id || index}
                  className="group relative bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
                >
                  <ReviewCard 
                    comment={review.comment}
                    rating={review.rating}
                    photoUrl={review.user?.photoUrl}
                    name={review.user?.name}
                    description={review.user?.description}
                    courseTitle={review.course?.title}
                    reviewedAt={review.reviewedAt}
                  />
                  
                  {/* Hover Effects - Matching CardPage */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-purple-500/3 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>
                  
                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-3/4 transition-all duration-500 rounded-full"></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View More - Matching CardPage */}
        <div className="text-center">
          <button className="px-8 py-4 border-2 border-blue-500 text-blue-500 rounded-2xl font-semibold bg-white hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Read More Reviews
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewPage;