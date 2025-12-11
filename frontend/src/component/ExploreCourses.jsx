import React, { useState } from 'react';
import { 
  SiViaplay 
} from 'react-icons/si';
import { 
  TbDeviceDesktopAnalytics 
} from 'react-icons/tb';
import { 
  FaMobileAlt,
  FaDatabase,
  FaRobot,
  FaPaintBrush,
  FaChartLine,
  FaShieldAlt,
  FaCloud,
  FaGamepad,
  FaVideo,
  FaMusic
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ExploreCourses = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  const courseCategories = [
    {
      id: 'web',
      icon: <TbDeviceDesktopAnalytics className="w-8 h-8" />,
      title: "Web Development",
      description: "Full-stack development courses",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      courses: 125
    },
    {
      id: 'mobile',
      icon: <FaMobileAlt className="w-8 h-8" />,
      title: "Mobile Development",
      description: "iOS & Android app development",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      courses: 89
    },
    {
      id: 'ai',
      icon: <FaRobot className="w-8 h-8" />,
      title: "AI & Machine Learning",
      description: "AI algorithms and ML models",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      courses: 67
    },
    {
      id: 'data',
      icon: <FaDatabase className="w-8 h-8" />,
      title: "Data Science",
      description: "Data analysis and visualization",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      borderColor: "border-orange-200",
      courses: 94
    },
    {
      id: 'design',
      icon: <FaPaintBrush className="w-8 h-8" />,
      title: "UI/UX Design",
      description: "User interface and experience design",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
      courses: 78
    },
    {
      id: 'business',
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Business Analytics",
      description: "Data-driven business decisions",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50",
      borderColor: "border-indigo-200",
      courses: 56
    },
    {
      id: 'cyber',
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Cyber Security",
      description: "Network security and ethical hacking",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-red-50 to-orange-50",
      borderColor: "border-red-200",
      courses: 45
    },
    {
      id: 'cloud',
      icon: <FaCloud className="w-8 h-8" />,
      title: "Cloud Computing",
      description: "AWS, Azure, and Google Cloud",
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-teal-50 to-cyan-50",
      borderColor: "border-teal-200",
      courses: 72
    },
    {
      id: 'game',
      icon: <FaGamepad className="w-8 h-8" />,
      title: "Game Development",
      description: "2D/3D game design and development",
      color: "from-amber-500 to-yellow-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50",
      borderColor: "border-amber-200",
      courses: 38
    },
    {
      id: 'video',
      icon: <FaVideo className="w-8 h-8" />,
      title: "Video Editing",
      description: "Professional video production",
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
      borderColor: "border-violet-200",
      courses: 41
    },
    {
      id: 'music',
      icon: <FaMusic className="w-8 h-8" />,
      title: "Music Production",
      description: "Audio engineering and production",
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      courses: 29
    },
    {
      id: 'marketing',
      icon: <SiViaplay className="w-8 h-8" />,
      title: "Digital Marketing",
      description: "SEO, Social Media, and Analytics",
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-50",
      borderColor: "border-rose-200",
      courses: 63
    }
  ];

  const filteredCourses = activeCategory === 'all' 
    ? courseCategories 
    : courseCategories.filter(course => course.id === activeCategory);

  return (
    <div className="w-full min-h-screen py-20 bg-gradient-to-br from-white via-gray-50 to-cyan-50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-16">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-6">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Discover Your Path
              </span>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mt-2">
                Explore Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI-Powered</span> Courses
              </h2>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg mb-8 hover:shadow-xl transition-all duration-300">
              <p className="text-lg text-gray-600 leading-relaxed">
                Dive into our comprehensive curriculum powered by artificial intelligence. 
                Get personalized course recommendations, real-time progress tracking, and 
                adaptive learning paths tailored to your goals and learning style.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { number: "500+", label: "Expert Courses", gradient: "from-blue-500 to-cyan-500" },
                { number: "50+", label: "Categories", gradient: "from-purple-500 to-pink-500" },
                { number: "10K+", label: "Happy Students", gradient: "from-orange-500 to-red-500" },
                { number: "24/7", label: "AI Support", gradient: "from-green-500 to-emerald-500" }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.number}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => navigate("/allcourses")}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center gap-3">
                Explore All Courses
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Category</h3>
              <div className="space-y-2">
                {['all', 'web', 'ai', 'data', 'design', 'business', 'cyber', 'cloud'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md border border-blue-500/20'
                        : 'bg-gray-50 text-gray-600 hover:bg-white hover:shadow-md border border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : courseCategories.find(c => c.id === category)?.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course, index) => (
            <div
              key={course.id}
              className={`group relative p-6 rounded-2xl ${course.bgColor} border ${course.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105`}
            >
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              
              {/* Icon */}
              <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {course.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                {course.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed group-hover:text-gray-700 transition-colors">
                {course.description}
              </p>

              {/* Course Count */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium group-hover:text-gray-600 transition-colors">
                  {course.courses} courses
                </span>
                <div className={`w-2 h-2 bg-gradient-to-r ${course.color} rounded-full group-hover:scale-150 transition-transform duration-300`}></div>
              </div>

              {/* Hover Effect Line */}
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${course.color} group-hover:w-3/4 transition-all duration-500 rounded-full`}></div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate("/allcourses")}
            className="px-8 py-4 border-2 border-blue-500 text-blue-500 rounded-2xl font-semibold bg-white hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            View All Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExploreCourses;