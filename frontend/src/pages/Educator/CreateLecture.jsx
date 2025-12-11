import React, { useState, useEffect } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from './../../App';
import { ClipLoader } from 'react-spinners';
import { setLectureData } from "../../redux/lectureSlice";
import { FaEdit } from "react-icons/fa";

const CreateLecture = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { lectureData } = useSelector(state => state.lecture);

  const handleCreateLecture = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Please enter a lecture title");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + `/api/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true }
      );
      dispatch(setLectureData(result.data.lectures || []));
      setLoading(false);
      toast.success("🎉 Lecture Added Successfully");
      setLectureTitle("");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCourseLecture = async () => {
      try {
        const result = await axios.get(
          serverUrl + `/api/course/courselecture/${courseId}`,
          { withCredentials: true }
        );
        dispatch(setLectureData(result.data.lectures || []));
      } catch (error) {
        console.log(error);
      }
    };
    getCourseLecture();
  }, [courseId, dispatch]);

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

      {/* Back Button */}
      <button 
        onClick={() => navigate(`/editcourse/${courseId}`)}
        className="absolute top-6 left-6 z-20 group cursor-pointer"
      >
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl rotate-45 shadow-2xl transition-all duration-500 group-hover:rotate-90 group-hover:scale-110 flex items-center justify-center">
            <FaArrowLeftLong className="w-5 h-5 text-white -rotate-45 transition-transform duration-500 group-hover:-rotate-90" />
          </div>
        </div>
      </button>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Create New Lecture
            </h1>
            <p className="text-gray-300">
              Add engaging video lectures to enrich your course content
            </p>
          </div>

          {/* Main Form Container */}
          <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-6 md:p-8">
            {/* Input Section */}
            <div className="mb-8">
              <label htmlFor="lectureTitle" className="block text-sm font-medium text-gray-300 mb-3">
                Lecture Title *
              </label>
              <input
                id="lectureTitle"
                type="text"
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 hover:border-white/20"
                placeholder="e.g. Introduction to MERN Stack - Building Modern Web Applications"
                onChange={(e) => setLectureTitle(e.target.value)}
                value={lectureTitle}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleCreateLecture()}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 hover:scale-105"
                disabled={loading}
                onClick={() => navigate(`/editcourse/${courseId}`)}
              >
                <FaArrowLeftLong /> Back to Course
              </button>
              <button
                className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold px-6 py-3 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={handleCreateLecture}
                disabled={loading || !lectureTitle.trim()}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <ClipLoader size={18} color="#ffffff" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">+</span>
                      <span>Create Lecture</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Lectures List */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-100">
                  Existing Lectures <span className="text-cyan-400">({lectureData?.length || 0})</span>
                </h2>
                {lectureData?.length > 0 && (
                  <span className="text-sm text-gray-400">
                    Click edit icon to modify
                  </span>
                )}
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {Array.isArray(lectureData) && lectureData.length > 0 ? (
                  lectureData.map((lecture, index) => (
                    <div 
                      key={lecture._id || index} 
                      className="group bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center border border-white/10 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-bold text-sm shadow-lg">
                          {index + 1}
                        </div>
                        <div>
                          <span className="font-medium text-gray-100">
                            {lecture.lectureTitle}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            Click edit to add video content
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}
                        className="p-3 rounded-xl bg-white/10 text-gray-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-600/20 hover:text-cyan-400 transition-all duration-300 group-hover:scale-110"
                        aria-label="Edit lecture"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center mb-5 border border-white/10">
                      <span className="text-3xl">📚</span>
                    </div>
                    <p className="text-gray-400 text-lg font-medium">No lectures added yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Create your first lecture to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Footer */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{lectureData?.length || 0}</div>
              <div className="text-sm text-gray-300">Total Lectures</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {lectureData?.length > 0 ? lectureData.length : 0}
              </div>
              <div className="text-sm text-gray-300">Available</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 backdrop-blur-sm rounded-2xl border border-pink-500/20 p-4 text-center">
              <div className="text-2xl font-bold text-pink-400">0</div>
              <div className="text-sm text-gray-300">In Progress</div>
            </div>
          </div>
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

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #7c3aed);
        }
      `}</style>
    </div>
  );
};

export default CreateLecture;