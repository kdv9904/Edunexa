import React from 'react'
import { FaArrowLeftLong, FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import img from "../../assets/empty.jpg"
import {useSelector} from "react-redux"
import useCreatorCourses from "../../customHooks/getCreatorCourse"
import { FaEdit } from 'react-icons/fa';

const Courses = () => {
  useCreatorCourses();
  const navigate = useNavigate();
  const { creatorCourseData } = useSelector(state=>state.course);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4 sm:p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className='relative z-10 max-w-7xl mx-auto'>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
           <div className='flex items-center gap-4'>
              <button 
                onClick={()=>navigate("/dashboard")}
                className="group w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl rotate-45 shadow-2xl transition-all duration-500 hover:rotate-90 hover:scale-110 flex items-center justify-center"
              >
                <FaArrowLeftLong className="w-5 h-5 text-white -rotate-45 transition-transform duration-500 group-hover:-rotate-90" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  My Courses
                </h1>
                <p className="text-gray-300 mt-1">Manage and create your courses</p>
              </div>
           </div>
           <button 
             className='group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-semibold px-6 py-3 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 flex items-center gap-2'
             onClick={()=>navigate("/create-course")}
           >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
             <FaPlus className="w-4 h-4 relative z-10" />
             <span className="relative z-10">Create Course</span>
           </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-6 overflow-x-auto">
           <table className='min-w-full'>
            <thead className='border-b border-white/10'>
              <tr className=''>
                <th className='text-left py-4 px-6 text-gray-300 font-semibold'>Course</th>
                <th className='text-left py-4 px-6 text-gray-300 font-semibold'>Price</th>
                <th className='text-left py-4 px-6 text-gray-300 font-semibold'>Status</th>
                <th className='text-left py-4 px-6 text-gray-300 font-semibold'>Action</th>
              </tr>
            </thead>
            <tbody>
              {creatorCourseData?.map((course,index)=>(
              <tr key={index} className='border-b border-white/10 hover:bg-white/5 transition duration-300 group'>
                <td className='py-4 px-6 flex items-center gap-4'>
                  {course?.thumbnail ? 
                    <img src={course?.thumbnail} alt='course name' className='w-20 h-12 object-cover rounded-lg border border-white/10'/> :
                    <img src={img} alt='course name' className='w-20 h-12 object-cover rounded-lg border border-white/10'/>
                  }
                  <span className="text-white font-medium group-hover:text-cyan-300 transition-colors">{course?.title}</span>
                </td>
                {course?.price ?
                  <td className='py-4 px-6 text-cyan-400 font-semibold'>{course?.price}₹</td> :
                  <td className='py-4 px-6 text-gray-400'>₹ NA</td>
                }
                <td className="px-6 py-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    course.isPublished ? 
                    "bg-green-500/20 text-green-400 border border-green-400/30" : 
                    "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30"
                  }`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={()=>navigate(`/editcourse/${course?._id}`)}
                    className="group w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-500/10 transition-all duration-300"
                  >
                    <FaEdit className='w-4 h-4 group-hover:scale-110 transition-transform'/>
                  </button>
                </td>
              </tr>
              ))}
            </tbody>
           </table>
           
           {(!creatorCourseData || creatorCourseData.length === 0) && (
             <div className="text-center py-12">
               <div className="text-6xl mb-4">📚</div>
               <h3 className="text-xl font-semibold text-white mb-2">No courses yet</h3>
               <p className="text-gray-400">Create your first course to get started</p>
             </div>
           )}
        </div>

        {/* Mobile Cards */}
        <div className='md:hidden space-y-4'>
          {creatorCourseData?.map((course,index)=>(
           <div key={index} className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-2xl border border-white/10 p-4 hover:border-cyan-400/30 transition-all duration-300 group">
              <div className='flex gap-4 items-center'>
                {course?.thumbnail ? 
                  <img src={course?.thumbnail} alt="image" className='w-16 h-16 rounded-lg object-cover border border-white/10'/> :
                  <img src={img} alt="image" className='w-16 h-16 rounded-lg object-cover border border-white/10'/>
                }
                <div className='flex-1'>
                  <h2 className='font-semibold text-white group-hover:text-cyan-300 transition-colors'>{course.title}</h2>
                  {course?.price ?
                    <p className='text-cyan-400 font-medium text-sm mt-1'>{course?.price}₹</p> :
                    <p className='text-gray-400 text-sm mt-1'>₹ NA</p>
                  }
                </div>
                <button 
                  onClick={()=>navigate(`/editcourse/${course?._id}`)}
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <FaEdit className='w-4 h-4'/>
                </button>
              </div>
              <div className="mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  course.isPublished ? 
                  "bg-green-500/20 text-green-400 border border-green-400/30" : 
                  "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30"
                }`}>
                  {course.isPublished ? "Published" : "Draft"}
                </span>
              </div>
           </div>
          ))}
          
          {(!creatorCourseData || creatorCourseData.length === 0) && (
            <div className="text-center py-8 bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-2xl border border-white/10">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-lg font-semibold text-white mb-1">No courses yet</h3>
              <p className="text-gray-400 text-sm">Create your first course to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default Courses