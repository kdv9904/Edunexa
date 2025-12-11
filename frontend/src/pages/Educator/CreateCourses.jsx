import React, { useState } from 'react'
import { FaArrowLeftLong, FaPlus } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { serverUrl } from "../../App"
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners';

const CreateCourses = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateCourse = async () => {
    if (!title.trim() || !category.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/course/create",
        { title, category },
        { withCredentials: true }
      );
      setLoading(false);
      navigate("/courses");
      toast.success("🎉 Course created successfully!");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden'>
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
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 opacity-20 animate-float cursor-pointer"
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

      {/* Back Button */}
      <button 
        onClick={() => navigate("/courses")}
        className="absolute top-6 left-6 z-20 group cursor-pointer"
      >
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl rotate-45 shadow-2xl transition-all duration-500 group-hover:rotate-90 group-hover:scale-110 flex items-center justify-center cursor-pointer">
            <FaArrowLeftLong className="w-5 h-5 text-white -rotate-45 transition-transform duration-500 group-hover:-rotate-90 cursor-pointer" />
          </div>
        </div>
      </button>

      <div className='bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 w-full max-w-md p-8 relative z-10'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaPlus className="w-6 h-6 text-white" />
          </div>
          <h2 className='text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2'>
            Create Course
          </h2>
          <p className='text-gray-300'>Start building your new course</p>
        </div>

        <form className='space-y-6' onSubmit={(e) => e.preventDefault()}>
          {/* Title Input */}
          <div className='group'>
            <label htmlFor='title' className='block text-sm font-medium text-gray-300 mb-3 cursor-pointer'>
              Course Title
            </label>
            <input
              type="text"
              id="title"
              placeholder='Enter course title...'
              className='w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 cursor-text hover:border-white/20'
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          {/* Category Select */}
          <div className='group'>
            <label htmlFor="cat" className="block text-sm font-medium text-gray-300 mb-3 cursor-pointer">
              Course Category
            </label>
            <select
              id="cat"
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 cursor-pointer hover:border-white/20 appearance-none"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="" className="bg-slate-800 text-white">Select category</option>
              <option value="App Development" className="bg-slate-800 text-white cursor-pointer">App Development</option>
              <option value="Web Development" className="bg-slate-800 text-white cursor-pointer">Web Development</option>
              <option value="Data Science" className="bg-slate-800 text-white cursor-pointer">Data Science</option>
              <option value="Machine Learning" className="bg-slate-800 text-white cursor-pointer">Machine Learning</option>
              <option value="Artificial Intelligence" className="bg-slate-800 text-white cursor-pointer">Artificial Intelligence</option>
              <option value="Cloud Computing" className="bg-slate-800 text-white cursor-pointer">Cloud Computing</option>
              <option value="Cyber Security" className="bg-slate-800 text-white cursor-pointer">Cyber Security</option>
              <option value="Blockchain" className="bg-slate-800 text-white cursor-pointer">Blockchain</option>
              <option value="Game Development" className="bg-slate-800 text-white cursor-pointer">Game Development</option>
              <option value="UI/UX Design" className="bg-slate-800 text-white cursor-pointer">UI/UX Design</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            className="group relative overflow-hidden w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold py-3 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
            onClick={handleCreateCourse}
            disabled={loading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="relative flex items-center justify-center gap-2 cursor-pointer">
              {loading ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                <>
                  <FaPlus className="w-4 h-4" />
                  Create Course
                </>
              )}
            </div>
          </button>
        </form>

        {/* Helper Text */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-gray-400 text-sm text-center">
            You can add course content, videos, and resources after creation
          </p>
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
        
        /* Custom select arrow */
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        select:focus {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2306B6D4' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  )
}

export default CreateCourses