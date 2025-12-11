import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong, FaUpload } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../assets/empty.jpg";
import axios from "axios";
import { serverUrl } from "./../../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateCreatorCourse } from "../../redux/courseSlice";
import { ClipLoader } from "react-spinners";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const EditCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const thumb = useRef();
  const { courseId } = useParams();

  const [isPublished, setIsPublished] = useState(false);
  const [selectCourse, setSelectCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState(img);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  // Handle thumbnail upload
  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  // Fetch course by ID
  const getCourseById = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/course/getcourse/${courseId}`,
        { withCredentials: true }
      );
      setSelectCourse(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Prefill form when course is fetched
  useEffect(() => {
    if (selectCourse) {
      setTitle(selectCourse.title || "");
      setSubTitle(selectCourse.subTitle || "");
      setDescription(selectCourse.description || "");
      setCategory(selectCourse.category || "");
      setLevel(selectCourse.level || "");
      setPrice(selectCourse.price || "");
      setFrontendImage(selectCourse.thumbnail || img);
      setIsPublished(selectCourse.isPublished || false);
    }
  }, [selectCourse]);

  useEffect(() => {
    getCourseById();
  }, []);

  // Save / Edit course
  const handleEditCourse = async () => {
    if (!title.trim() || !category.trim() || !level.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subTitle);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("level", level);
      formData.append("price", price);
      formData.append("isPublished", isPublished);
      if (backendImage) formData.append("thumbnail", backendImage);

      const { data } = await axios.post(
        `${serverUrl}/api/course/editcourse/${courseId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(updateCreatorCourse(data));
      toast.success("🎉 Course updated successfully!");
      navigate("/courses");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourse = async () => {
    setLoading1(true);
    try {
      await axios.delete(serverUrl + `/api/course/remove/${courseId}`, { withCredentials: true });
      setLoading1(false);
      toast.success("Course removed successfully");
      navigate("/courses");
    } catch (error) {
      console.log(error);
      setLoading1(false);
      toast.error(error.response?.data?.message || "Remove failed");
    }
  };

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

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Edit Course
            </h1>
            <p className="text-gray-300 mt-1">Update your course information</p>
          </div>
          <button 
  className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-semibold px-6 py-3 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 cursor-pointer"
  onClick={() => navigate(`/create-lecture/${courseId}`)} // Fixed path
>
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
  <span className="relative z-10">Go To Lecture Page</span>
</button>
        </div>

        {/* Main Form Container */}
        <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-6 lg:p-8">
          {/* Publish/Remove Actions */}
          <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
            {!isPublished ? (
              <button
                className="group flex items-center gap-2 bg-green-500/20 text-green-400 border border-green-400/30 px-4 py-2 rounded-xl hover:bg-green-500/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => setIsPublished(true)}
              >
                <span>📢</span>
                Publish Course
              </button>
            ) : (
              <button
                className="group flex items-center gap-2 bg-yellow-500/20 text-yellow-400 border border-yellow-400/30 px-4 py-2 rounded-xl hover:bg-yellow-500/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => setIsPublished(false)}
              >
                <span>⏸️</span>
                Unpublish Course
              </button>
            )}
            <button 
              className="group flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-400/30 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-50"
              onClick={handleRemoveCourse}
              disabled={loading1}
            >
              {loading1 ? <ClipLoader size={16} color="#ef4444" /> : <FaTimes className="w-4 h-4" />}
              Remove Course
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Title */}
            <div className="group">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-3 cursor-pointer">
                Course Title *
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 cursor-text hover:border-white/20"
                placeholder="Enter course title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </div>

            {/* Subtitle */}
            <div className="group">
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-300 mb-3 cursor-pointer">
                Course Subtitle
              </label>
              <input
                id="subtitle"
                type="text"
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 cursor-text hover:border-white/20"
                placeholder="Enter course subtitle"
                onChange={(e) => setSubTitle(e.target.value)}
                value={subTitle}
              />
            </div>

            {/* Description */}
            <div className="group">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-3 cursor-pointer">
                Course Description
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 cursor-text hover:border-white/20 resize-none h-32"
                placeholder="Describe your course..."
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </div>

            {/* Category + Level */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 cursor-pointer">
                  Course Category *
                </label>
                <select
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 cursor-pointer hover:border-white/20 appearance-none"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="" className="bg-slate-800 text-white">Select Category</option>
                  <option value="App Development" className="bg-slate-800 text-white cursor-pointer">App Development</option>
                  <option value="Web Development" className="bg-slate-800 text-white cursor-pointer">Web Development</option>
                  <option value="Data Science" className="bg-slate-800 text-white cursor-pointer">Data Science</option>
                  <option value="Artificial Intelligence" className="bg-slate-800 text-white cursor-pointer">Artificial Intelligence</option>
                  <option value="Machine Learning" className="bg-slate-800 text-white cursor-pointer">Machine Learning</option>
                  <option value="Cloud Computing" className="bg-slate-800 text-white cursor-pointer">Cloud Computing</option>
                  <option value="Cyber Security" className="bg-slate-800 text-white cursor-pointer">Cyber Security</option>
                  <option value="Blockchain" className="bg-slate-800 text-white cursor-pointer">Blockchain</option>
                  <option value="Game Development" className="bg-slate-800 text-white cursor-pointer">Game Development</option>
                  <option value="UI/UX Design" className="bg-slate-800 text-white cursor-pointer">UI/UX Design</option>
                </select>
              </div>

              {/* Level */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 cursor-pointer">
                  Course Level *
                </label>
                <select
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 cursor-pointer hover:border-white-20 appearance-none"
                  onChange={(e) => setLevel(e.target.value)}
                  value={level}
                >
                  <option value="" className="bg-slate-800 text-white">Select Level</option>
                  <option value="Beginner" className="bg-slate-800 text-white cursor-pointer">Beginner</option>
                  <option value="Intermediate" className="bg-slate-800 text-white cursor-pointer">Intermediate</option>
                  <option value="Advanced" className="bg-slate-800 text-white cursor-pointer">Advanced</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div className="group">
              <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-3 cursor-pointer">
                Course Price (INR)
              </label>
              <input
                type="number"
                id="price"
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 cursor-text hover:border-white/20"
                placeholder="Enter price in INR"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </div>

            {/* Thumbnail Upload */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-3 cursor-pointer">
                Course Thumbnail
              </label>
              <input
                type="file"
                hidden
                ref={thumb}
                accept="image/*"
                onChange={handleThumbnail}
              />
              <div
                className="relative w-full max-w-md border-2 border-dashed border-white/20 rounded-2xl overflow-hidden cursor-pointer group hover:border-cyan-400/50 transition-all duration-300"
                onClick={() => thumb.current.click()}
              >
                <img
                  src={frontendImage}
                  alt="thumbnail"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <FaUpload className="w-8 h-8 text-white mx-auto mb-2" />
                    <span className="text-white font-medium">Click to change thumbnail</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                  <FaEdit className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button
                type="button"
                className="group flex items-center justify-center gap-2 px-8 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => navigate("/courses")}
              >
                <FaTimes className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditCourse}
                disabled={loading}
                className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold px-8 py-3 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-2 cursor-pointer">
                  {loading ? <ClipLoader size={20} color="#ffffff" /> : <FaSave className="w-4 h-4" />}
                  {loading ? "Saving..." : "Save Changes"}
                </div>
              </button>
            </div>
          </form>
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
        
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
        
        select:focus {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2306B6D4' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
};

export default EditCourses;