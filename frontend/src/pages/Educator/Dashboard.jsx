import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Line, Bar } from 'react-chartjs-2';
import { 
  FaChartLine, 
  FaUsers, 
  FaEdit, 
  FaBook, 
  FaStar, 
  FaArrowLeft,
  FaRocket,
  FaPalette,
  FaFilter,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// ✅ Chart.js v4 required imports & registration
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);


const Dashboard = () => {
  const { userData } = useSelector(state => state.user);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [particles, setParticles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    // Generate floating particles matching Home page
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);

    const fetchEducatorData = async () => {
      if (!userData?.user?._id) {
        toast.error('Please log in as an educator');
        return;
      }
      try {
        setLoading(true);
        // Get creator courses
        const coursesRes = await axios.get(`${serverUrl}/api/course/getcreator`, { 
          withCredentials: true 
        });
        
       const coursesData = Array.isArray(coursesRes.data?.courses)
  ? coursesRes.data.courses
  : Array.isArray(coursesRes.data)
  ? coursesRes.data
  : [];

        // Fetch detailed ratings for each course
        const coursesWithRatings = await Promise.all(
          coursesData.map(async (course) => {
            try {
              // Fetch full course details with reviews
              const courseDetailRes = await axios.get(
                `${serverUrl}/api/course/getcourse/${course._id}`, 
                { withCredentials: true }
              );
              
              const detailedCourse = courseDetailRes.data;
              
              // Calculate rating for this course (same logic as your Card component)
              let courseRating = 0;
              let reviewsCount = 0;
              
              if (detailedCourse?.reviews && detailedCourse.reviews.length > 0) {
                let validReviews = [];
                
                if (typeof detailedCourse.reviews[0] === 'object' && detailedCourse.reviews[0].rating !== undefined) {
                  // Reviews are already full objects
                  validReviews = detailedCourse.reviews.filter(
                    review => typeof review.rating === 'number' && !isNaN(review.rating)
                  );
                } else {
                  // Reviews are IDs - Fetch each review's details
                  validReviews = await Promise.all(
                    detailedCourse.reviews.map(async (reviewId) => {
                      try {
                        const reviewRes = await axios.get(
                          `${serverUrl}/api/review/${reviewId}`, 
                          { withCredentials: true }
                        );
                        return reviewRes.data.review;
                      } catch (error) {
                        console.error(`Error fetching review ${reviewId}:`, error);
                        return null;
                      }
                    })
                  ).then(reviews => 
                    reviews.filter(review => 
                      review && typeof review.rating === 'number' && !isNaN(review.rating)
                    )
                  );
                }
                
                if (validReviews.length > 0) {
                  const totalRating = validReviews.reduce((sum, review) => sum + review.rating, 0);
                  courseRating = Number((totalRating / validReviews.length).toFixed(1));
                  reviewsCount = validReviews.length;
                }
              }
              
              return {
                ...course,
                averageRating: courseRating,
                reviewsCount: reviewsCount,
                enrollments: course.enrolledStudents?.length || course.enrollments || 0
              };
            } catch (error) {
              console.error(`Error fetching details for course ${course._id}:`, error);
              return {
                ...course,
                averageRating: 0,
                reviewsCount: 0,
                enrollments: course.enrolledStudents?.length || course.enrollments || 0
              };
            }
          })
        );
        
        setCourses(coursesWithRatings);

        // Calculate total enrollments
        const totalEnrollments = coursesWithRatings.reduce(
          (sum, course) => sum + course.enrollments, 0
        );
        setEnrollments(totalEnrollments);

        // Calculate overall average rating
        const coursesWithRatingsOnly = coursesWithRatings.filter(
          course => course.averageRating > 0
        );
        const overallAvg = coursesWithRatingsOnly.length > 0 
          ? (coursesWithRatingsOnly.reduce((sum, course) => sum + course.averageRating, 0) / 
             coursesWithRatingsOnly.length).toFixed(1)
          : 0;
        setAverageRating(parseFloat(overallAvg));

      } catch (error) {
        console.error('Error fetching educator data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchEducatorData();
  }, [userData, filter]);

  // Filtered courses
  const filteredCourses = courses.filter(course => {
    if (filter === 'active') return course.isPublished;
    if (filter === 'draft') return !course.isPublished;
    return true;
  });

  // Chart data with enhanced colors
  const lineChartData = {
    labels: filteredCourses.map(course => course.title),
    datasets: [
      {
        label: 'Enrollments',
        data: filteredCourses.map(course => course.enrollments),
        borderColor: 'rgba(34, 211, 238, 1)',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(34, 211, 238, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const barChartData = {
    labels: filteredCourses.map(course => course.title),
    datasets: [
      {
        label: 'Average Ratings',
        data: filteredCourses.map(course => course.averageRating),
        backgroundColor: filteredCourses.map(course => 
          course.averageRating >= 4 ? 'rgba(34, 211, 238, 0.8)' :
          course.averageRating >= 3 ? 'rgba(192, 132, 252, 0.8)' :
          'rgba(248, 113, 113, 0.8)'
        ),
        borderColor: filteredCourses.map(course => 
          course.averageRating >= 4 ? 'rgba(34, 211, 238, 1)' :
          course.averageRating >= 3 ? 'rgba(192, 132, 252, 1)' :
          'rgba(248, 113, 113, 1)'
        ),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          color: '#6B7280'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#6B7280'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background matching Home page */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl"></div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 opacity-20 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      <div className="absolute top-8 right-8 hidden lg:flex flex-col gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
          <FaRocket className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center border border-white/10 hover:border-purple-400/30 transition-all duration-300">
          <FaChartLine className="w-5 h-5 text-purple-400" />
        </div>
      </div>

      <div className={`relative z-10 p-6 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="group relative px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <FaArrowLeft className="relative z-10 group-hover:-translate-x-1 transition-transform" />
              <span className="relative z-10">Back to Home</span>
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Educator Dashboard
            </h1>
          </div>
        </div>

        {/* Interactive Filter with enhanced design */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md">
            <label className="block text-sm font-medium text-cyan-300 mb-3 flex items-center gap-2">
              <FaFilter className="text-cyan-400" />
              Filter Courses:
            </label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
              className="w-full p-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm"
            >
              <option value="all" className="bg-slate-800">All Courses</option>
              <option value="active" className="bg-slate-800">Published Courses</option>
              <option value="draft" className="bg-slate-800">Draft Courses</option>
            </select>
          </div>
        </div>

        {/* Summary Cards with glass morphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: FaBook,
              label: "Total Courses",
              value: filteredCourses.length,
              color: "from-cyan-500 to-blue-600",
              bgColor: "bg-cyan-500/10",
              borderColor: "border-cyan-500/30"
            },
            {
              icon: FaUsers,
              label: "Total Enrollments",
              value: enrollments,
              color: "from-purple-500 to-pink-600",
              bgColor: "bg-purple-500/10",
              borderColor: "border-purple-500/30"
            },
            {
              icon: FaStar,
              label: "Average Rating",
              value: averageRating > 0 ? `${averageRating}/5` : 'N/A',
              color: "from-yellow-500 to-orange-500",
              bgColor: "bg-yellow-500/10",
              borderColor: "border-yellow-500/30"
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/30 transition-all duration-500 hover:scale-105 group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 ${stat.bgColor} rounded-xl border ${stat.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`text-2xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
                <div>
                  <p className="text-sm text-gray-300 font-medium">{stat.label}</p>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Charts */}
        {filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/30 transition-all duration-500">
              <h2 className="text-xl font-semibold mb-4 text-cyan-300 flex items-center gap-2">
                <FaChartLine />
                Enrollment Trends
              </h2>
              <div className="h-64">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </div>
            
            <div className="p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-500">
              <h2 className="text-xl font-semibold mb-4 text-purple-300 flex items-center gap-2">
                <FaStar />
                Course Ratings
              </h2>
              <div className="h-64">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Course List with Enhanced Design */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-500">
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Your Courses
              </h2>
              <button 
                onClick={() => navigate('/create-course')}
                className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 overflow-hidden border border-cyan-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center gap-3">
                  <FaBook className="text-sm group-hover:rotate-12 transition-transform" />
                  Create New Course
                </span>
              </button>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center p-12">
              <FaBook className="text-gray-400 text-5xl mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">No courses found</p>
              <p className="text-gray-400">Create your first course to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-cyan-300">Course Title</th>
                    <th className="p-4 text-left text-sm font-semibold text-cyan-300">Status</th>
                    <th className="p-4 text-left text-sm font-semibold text-cyan-300">Enrollments</th>
                    <th className="p-4 text-left text-sm font-semibold text-cyan-300">Rating</th>
                    <th className="p-4 text-left text-sm font-semibold text-cyan-300">Reviews</th>
                    <th className="p-4 text-left text-sm font-semibold text-cyan-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredCourses.map(course => (
                    <tr key={course._id} className="hover:bg-white/5 transition-colors duration-150">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {course.thumbnail && (
                            <img 
                              src={course.thumbnail} 
                              alt={course.title}
                              className="w-12 h-12 object-cover rounded-xl border border-white/10"
                            />
                          )}
                          <div>
                            <p className="font-medium text-white">{course.title}</p>
                            <p className="text-sm text-gray-400">{course.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          course.isPublished 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {course.isPublished ? (
                            <>
                              <FaEye className="mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <FaEyeSlash className="mr-1" />
                              Draft
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FaUsers className="text-cyan-400 text-sm" />
                          <span className="font-medium text-white">{course.enrollments}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FaStar className="text-yellow-400" />
                          <span className="font-medium text-white">
                            {course.averageRating > 0 ? course.averageRating : 'N/A'}
                          </span>
                          {course.averageRating > 0 && (
                            <span className="text-sm text-gray-400">/5</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300">{course.reviewsCount} reviews</span>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => navigate(`/editcourse/${course._id}`)} 
                          className="group flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 text-sm"
                        >
                          <FaEdit className="group-hover:rotate-12 transition-transform" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;