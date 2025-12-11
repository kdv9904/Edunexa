import React from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const MyEnrolledCourses = () => {
    const {userData} = useSelector(state=>state.user);
    const navigate = useNavigate();
    
  return (
    <div className='min-h-screen w-full px-4 py-9 bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10'>
        {/* Back Button */}
        <div className='relative mb-4'>
            <button 
                onClick={()=>navigate("/")}
                className='group flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-blue-300'
            >
                <FaArrowLeftLong className='w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors'/>
                <span className='text-gray-700 font-medium group-hover:text-blue-600 transition-colors'>Back to Home</span>
            </button>
        </div>

        {/* Header */}
        <div className='text-center mb-1'>
            <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4'>
                My Learning Journey
            </h1>
            <p className='text-gray-600 max-w-2xl mx-auto'>
                Continue your progress and master new skills with your enrolled courses
            </p>
        </div>

        {
            !userData?.user?.enrolledCourses || userData?.user?.enrolledCourses?.length === 0 ? (
                <div className='text-center py-16'>
                    <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center'>
                        <span className='text-3xl text-gray-400'>📚</span>
                    </div>
                    <h3 className='text-2xl font-semibold text-gray-600 mb-4'>No Courses Enrolled Yet</h3>
                    <p className='text-gray-500 mb-6'>Start your learning journey by exploring our courses</p>
                    <button 
                        onClick={() => navigate("/allcourses")}
                        className='px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105'
                    >
                        Explore Courses
                    </button>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
                    {userData?.user?.enrolledCourses?.map((course,index) => (
                        <div 
                            key={index} 
                            className='group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-200 overflow-hidden'
                        >
                            {/* Course Image */}
                            <div className='relative overflow-hidden'>
                                <img 
                                    src={course?.thumbnail} 
                                    alt={course?.title} 
                                    className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500'
                                />
                                {/* Difficulty Badge */}
                                <div className='absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-lg'>
                                    {course?.level || 'Beginner'}
                                </div>
                            </div>

                            {/* Course Content */}
                            <div className='p-6'>
                                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {course?.title}
                                </h2>
                                <p className='text-sm text-gray-600 mb-4 flex items-center gap-1'>
                                    <span className='text-purple-500'>●</span>
                                    {course?.category}
                                </p>

                                {/* Action Button */}
                                <button 
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                                    onClick={() => navigate(`/viewcourse/${course._id}`)}
                                >
                                    Continue Learning
                                </button>
                            </div>

                            {/* Hover Effect Border */}
                            <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                                <div className="w-full h-full bg-white rounded-3xl m-0.5"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
    </div>
  )
}

export default MyEnrolledCourses