import React from 'react';
import { FaRegStar, FaStar, FaQuoteLeft, FaGraduationCap } from 'react-icons/fa';

const ReviewCard = ({ 
  comment, 
  rating, 
  photoUrl, 
  name, 
  description, 
  courseTitle, 
  reviewedAt 
}) => {
  
  // Default values for missing data
  const displayRating = rating || 0;
  const displayComment = comment || "No comment provided";
  const displayName = name || "Anonymous";
  const displayCourseTitle = courseTitle || "Unknown Course";
  const displayPhotoUrl = photoUrl || "/default-avatar.png";
  const displayDescription = description || "Student";
  
  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate gradient based on rating
  const getRatingGradient = (rating) => {
    if (rating >= 4.5) return "from-green-500 to-emerald-500";
    if (rating >= 4) return "from-blue-500 to-cyan-500";
    if (rating >= 3) return "from-yellow-500 to-orange-500";
    return "from-gray-400 to-gray-500";
  };

  return (
    <div className='group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-200 max-w-sm w-full overflow-hidden'>
      
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getRatingGradient(displayRating)} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
      
      {/* Floating Quote Icon */}
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
        <FaQuoteLeft className="w-3 h-3 text-white" />
      </div>

      {/* Rating Badge with Gradient */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${getRatingGradient(displayRating)} text-white text-sm font-semibold shadow-md`}>
          <FaStar className="w-3 h-3" />
          <span>{displayRating}.0</span>
        </div>
        
        {/* Star Rating */}
        <div className='flex items-center'>
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-yellow-400">
              {star <= displayRating ? 
                <FaStar className="w-4 h-4 fill-current" /> : 
                <FaRegStar className="w-4 h-4 text-yellow-400" />
              }
            </span>
          ))}
        </div>
      </div>

      {/* Course Title with Icon */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-blue-50 rounded-lg border border-blue-100">
        <FaGraduationCap className="w-4 h-4 text-blue-600" />
        <p className="text-blue-700 text-sm font-medium truncate">
          {displayCourseTitle}
        </p>
      </div>

      {/* Comment with Beautiful Typography */}
      <div className="relative mb-4">
        <div className="absolute -left-2 top-0 text-blue-200 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FaQuoteLeft />
        </div>
        <p className='text-gray-700 text-sm leading-relaxed pl-4 line-clamp-4 group-hover:line-clamp-none transition-all duration-300'>
          {displayComment}
        </p>
      </div>

      {/* Review Date */}
      {reviewedAt && (
        <p className="text-gray-400 text-xs mb-4 italic">
          Reviewed on {formatDate(reviewedAt)}
        </p>
      )}

      {/* User Information with Hover Effect */}
      <div className='flex items-center pt-4 border-t border-gray-100 group-hover:border-blue-200 transition-colors duration-300'>
        <div className="relative">
          <img 
            src={displayPhotoUrl} 
            className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-300 shadow-md" 
            alt={`${displayName}'s profile`}
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          {/* Online Status Indicator */}
          <div className="absolute bottom-0 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className='text-gray-900 font-semibold text-sm group-hover:text-blue-600 transition-colors duration-300'>
              {displayName}
            </h2>
            {/* Verified Badge */}
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className='text-gray-600 text-xs flex items-center gap-1'>
            <span>{displayDescription}</span>
          </p>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
        <div className="w-full h-full bg-white rounded-2xl m-0.5"></div>
      </div>

      {/* Floating Particles on Hover */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 animate-float"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(180deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ReviewCard;