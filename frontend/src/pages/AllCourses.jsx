import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaSearch, FaRobot, FaFire, FaStar, FaUsers, FaTimes, FaSlidersH, FaBookOpen } from "react-icons/fa";
import Nav from "../component/Nav";
import Card from "../component/Card";
import usePublishedCourse from "../customHooks/getPublishedCourse";

const AllCourses = () => {
  const navigate = useNavigate();
  const { creatorCourseData: courseData = [] } = useSelector((state) => state.course);
  const [category, setCategory] = useState([]);
  const [filterCourses, setFilterCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [difficulty, setDifficulty] = useState("all");
  const [particles, setParticles] = useState([]);

  // Fetch courses using custom hook
  usePublishedCourse();

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 3 + 1,
    }));
    setParticles(newParticles);
  }, []);

  // Categories with icons and colors
  const categories = [
    { name: "App Development", icon: "📱", color: "from-cyan-500 to-blue-600" },
    { name: "Web Development", icon: "🌐", color: "from-purple-500 to-pink-600" },
    { name: "Data Science", icon: "📊", color: "from-green-500 to-emerald-600" },
    { name: "Machine Learning", icon: "🤖", color: "from-orange-500 to-red-600" },
    { name: "Artificial Intelligence", icon: "🧠", color: "from-indigo-500 to-purple-600" },
    { name: "Cloud Computing", icon: "☁️", color: "from-blue-500 to-cyan-600" },
    { name: "Cyber Security", icon: "🔒", color: "from-red-500 to-orange-600" },
    { name: "Blockchain", icon: "⛓️", color: "from-yellow-500 to-orange-600" },
    { name: "Game Development", icon: "🎮", color: "from-pink-500 to-rose-600" },
    { name: "UI/UX Design", icon: "🎨", color: "from-teal-500 to-cyan-600" },
  ];

  // Filter and sort courses
  useEffect(() => {
    let filtered = [...courseData];

    // Category filter
    if (category.length > 0) {
      filtered = filtered.filter((c) =>
        category.includes(c.category)
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter - FIXED: Handle case sensitivity and null/undefined values
    if (difficulty !== "all") {
      filtered = filtered.filter((c) => 
        c.difficulty?.toLowerCase() === difficulty.toLowerCase()
      );
    }

    // Sort courses
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        // Popular (default) - sort by enrollment count
        filtered.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
    }

    setFilterCourses(filtered);
  }, [category, courseData, searchTerm, sortBy, difficulty]);

  const toggleCategory = (catName) => {
    setCategory(prev =>
      prev.includes(catName) 
        ? prev.filter(c => c !== catName)
        : [...prev, catName]
    );
  };

  const clearAllFilters = () => {
    setCategory([]);
    setSearchTerm("");
    setSortBy("popular");
    setDifficulty("all");
  };

  const stats = [
    { label: "Total Courses", value: courseData?.length || 0, icon: FaBookOpen, color: "text-cyan-400" },
    { label: "Categories", value: categories.length, icon: FaFilter, color: "text-purple-400" },
    { label: "New This Week", value: "12+", icon: FaFire, color: "text-orange-400" },
    { label: "Active Learners", value: "2.5K+", icon: FaUsers, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 opacity-20 animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Geometric Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-pink-500/5 rounded-full blur-2xl"></div>

      <Nav />
      
      {/* Main Container */}
      <div className="pt-24 pb-12 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Discover Your Next Skill
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore our curated collection of premium courses and start your learning journey today
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search courses, topics, or instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 shadow-2xl transition-all duration-300 text-lg"
                />
                <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar - Desktop */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-6 sticky top-32">
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <FaSlidersH className="w-5 h-5 text-cyan-400" />
                    Filters
                  </h2>
                  {(category.length > 0 || searchTerm || sortBy !== "popular" || difficulty !== "all") && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* AI Search Button */}
                <button className="w-full group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl p-4 mb-6 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105">
                  <div className="flex items-center justify-center gap-3">
                    <FaRobot className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">AI Course Finder</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>

                {/* Sort Options */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    Sort By
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Categories</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => toggleCategory(cat.name)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group text-left ${
                          category.includes(cat.name) 
                            ? 'bg-cyan-500/20 border border-cyan-400/30 shadow-lg' 
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-r ${cat.color}`}>
                          <span className="text-sm">{cat.icon}</span>
                        </div>
                        <span className={`font-medium flex-1 ${
                          category.includes(cat.name) ? 'text-cyan-300' : 'text-gray-300'
                        }`}>
                          {cat.name}
                        </span>
                        {category.includes(cat.name) && (
                          <FaTimes className="w-4 h-4 text-cyan-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-6 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {filterCourses.length} {filterCourses.length === 1 ? 'Course' : 'Courses'} Found
                    </h2>
                    <p className="text-gray-400 mt-1">
                      {category.length > 0 
                        ? `in ${category.join(", ")}` 
                        : "Across all categories"
                      }
                    </p>
                  </div>
                  
                  {/* Active Filters */}
                  <div className="flex flex-wrap gap-2">
                    {category.map((cat) => (
                      <span
                        key={cat}
                        className="px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium flex items-center gap-2 border border-cyan-400/30"
                      >
                        {cat}
                        <button
                          onClick={() => setCategory(category.filter(c => c !== cat))}
                          className="hover:text-cyan-300 transition-colors"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {(searchTerm || sortBy !== "popular" || difficulty !== "all") && (
                      <button
                        onClick={clearAllFilters}
                        className="px-3 py-2 bg-white/10 text-gray-300 rounded-full text-sm font-medium hover:bg-white/20 transition-colors border border-white/10"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Courses Grid */}
              {filterCourses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filterCourses.map((course, index) => (
                    <div
                      key={course._id || index}
                      className="transform hover:scale-105 transition-all duration-500"
                    >
                      <Card
                        thumbnail={course.thumbnail}
                        title={course.title}
                        category={course.category}
                        price={course.price}
                        id={course._id}
                        rating={course.rating}
                        enrollmentCount={course.enrollmentCount}
                        duration={course.duration}
                        difficulty={course.difficulty}
                        review = {course.reviews}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-white mb-3">No courses found</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
      >
        <FaFilter className="w-6 h-6" />
      </button>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />
          
          {/* Filter Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-gradient-to-b from-slate-800 to-purple-900 shadow-2xl overflow-y-auto border-l border-white/10">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Mobile Filter Content */}
              <div className="space-y-6">
                {/* Sort Options */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Categories</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => toggleCategory(cat.name)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group text-left ${
                          category.includes(cat.name) 
                            ? 'bg-cyan-500/20 border border-cyan-400/30' 
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-r ${cat.color}`}>
                          <span className="text-xs">{cat.icon}</span>
                        </div>
                        <span className={`font-medium flex-1 text-sm ${
                          category.includes(cat.name) ? 'text-cyan-300' : 'text-gray-300'
                        }`}>
                          {cat.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={clearAllFilters}
                  className="w-full py-3 bg-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/10"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations */}
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
  );
};

export default AllCourses;