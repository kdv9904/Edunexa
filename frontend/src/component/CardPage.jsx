import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "./Card";
import { FaRocket, FaFire, FaChartLine, FaAward } from "react-icons/fa";

const CardPage = () => {
  const { creatorCourseData } = useSelector((state) => state.course);
  const [popularCourses, setPopularCourses] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    // Filter only published courses
    const publishedCourses = creatorCourseData
      .filter((course) => course.isPublished)
      .slice(0, 8);
    setPopularCourses(publishedCourses);
  }, [creatorCourseData]);

  const filters = [
    { id: "all", label: "All Courses", icon: <FaRocket />, gradient: "from-blue-500 to-cyan-500" },
    { id: "trending", label: "Trending", icon: <FaFire />, gradient: "from-orange-500 to-red-500" },
    { id: "bestseller", label: "Bestseller", icon: <FaChartLine />, gradient: "from-green-500 to-emerald-500" },
    { id: "featured", label: "Featured", icon: <FaAward />, gradient: "from-purple-500 to-pink-500" }
  ];

  return (
    <div className="w-full min-h-screen py-20 bg-gradient-to-br from-white via-gray-50 to-cyan-50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section - Matching ExploreCourses */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-16">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-6">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Featured Courses
              </span>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mt-2">
                Most <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Popular</span> Courses
              </h2>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg mb-8 hover:shadow-xl transition-all duration-300">
              <p className="text-lg text-gray-600 leading-relaxed">
                Discover our top-rated courses loved by thousands of learners. 
                These handpicked courses feature cutting-edge content, expert instructors, 
                and proven results to accelerate your learning journey.
              </p>
            </div>

            {/* Stats - Matching ExploreCourses Style */}
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { number: "4.9/5", label: "Average Rating", gradient: "from-blue-500 to-cyan-500" },
                { number: "10K+", label: "Enrollments", gradient: "from-purple-500 to-pink-500" },
                { number: "500+", label: "5-Star Reviews", gradient: "from-orange-500 to-red-500" },
                { number: "98%", label: "Completion Rate", gradient: "from-green-500 to-emerald-500" }
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
                Browse All Courses
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Filter Section - Matching ExploreCourses Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Courses</h3>
              <div className="space-y-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeFilter === filter.id
                        ? `bg-gradient-to-r ${filter.gradient} text-white shadow-md border border-transparent`
                        : 'bg-gray-50 text-gray-600 hover:bg-white hover:shadow-md border border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`transition-transform duration-300 ${
                        activeFilter === filter.id ? "scale-110" : ""
                      }`}>
                        {filter.icon}
                      </span>
                      {filter.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid - SIMPLIFIED: Remove wrapper divs around Card */}
        <div className="mb-16">
          {popularCourses && popularCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularCourses.map((course, index) => (
                <Card 
                  key={course._id}
                  thumbnail={course.thumbnail} 
                  title={course.title} 
                  category={course.category} 
                  price={course.price} 
                  id={course._id}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <FaAward className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">No Courses Available</h3>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm max-w-md mx-auto">
                <p className="text-gray-500">
                  We're preparing amazing courses for you. Check back soon!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* View More - Matching ExploreCourses */}
        <div className="text-center">
          <button className="px-8 py-4 border-2 border-blue-500 text-blue-500 rounded-2xl font-semibold bg-white hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Load More Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardPage;