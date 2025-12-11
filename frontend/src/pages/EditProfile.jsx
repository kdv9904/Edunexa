import axios from 'axios';
import React, { useState, useRef } from 'react'
import { FaArrowLeftLong, FaCamera, FaUser, FaEnvelope, FaShield } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { toast } from 'react-toastify';
import { FaEdit, FaSave } from 'react-icons/fa';
const EditProfile = () => {
  const { userData } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: userData?.user?.name || "",
    description: userData?.user?.description || "",
    photoUrl: null
  });
  
  const [previewImage, setPreviewImage] = useState(userData?.user?.photoUrl || "");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setImageLoading(true);
      handleInputChange('photoUrl', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleEdit = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("description", formData.description);
      if (formData.photoUrl) {
        submitFormData.append("photoUrl", formData.photoUrl);
      }

      const result = await axios.post(`${serverUrl}/api/user/profile`, submitFormData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(setUserData({ user: result.data.user }));
      toast.success("🎉 Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-2xl w-full relative z-10 transform hover:scale-[1.01] transition-all duration-500">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate("/profile")}
            className="group flex items-center gap-3 text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 border border-white/20 group-hover:border-white/30">
              <FaArrowLeftLong className="w-4 h-4" />
            </div>
            <span className="font-medium">Back to Profile</span>
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Edit Profile
            </h2>
            <p className="text-white/60 text-sm mt-1">Customize your personal information</p>
          </div>
          
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Image */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="relative group">
              {/* Profile Image Container */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                
                <div className="relative w-40 h-40 rounded-2xl border-4 border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl">
                  {imageLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : previewImage ? (
                    <img 
                      src={previewImage} 
                      className="w-full h-full object-cover"
                      alt="Profile preview"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center text-white">
                      <span className="text-4xl font-bold">
                        {userData?.user?.name ? userData.user.name.slice(0,1).toUpperCase() : "?"}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Camera Icon Overlay */}
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-3 right-3 w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-110 group"
                >
                  <FaCamera className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </button>
                
                {/* Hidden File Input */}
                <input 
                  ref={fileInputRef}
                  id="image" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </div>
            </div>
            
            {/* Upload Hint */}
            <p className="text-white/60 text-sm text-center mt-4 max-w-xs">
              Click the camera icon to upload a new profile picture. Max 5MB.
            </p>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Name Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-400/30">
                  <FaUser className="w-3 h-3 text-cyan-400" />
                </div>
                Full Name
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field (Disabled) */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-400/30">
                  <FaEnvelope className="w-3 h-3 text-purple-400" />
                </div>
                Email Address
              </label>
              <input
                type="email"
                value={userData?.user?.email || ""}
                disabled
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white/60 cursor-not-allowed opacity-70"
              />
            </div>

            {/* Role Field (Disabled) */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-400/30">
                  <FaShield className="w-3 h-3 text-green-400" />
                </div>
                Account Role
              </label>
              <input
                type="text"
                value={userData?.user?.role || ""}
                disabled
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white/60 cursor-not-allowed opacity-70 capitalize"
              />
            </div>

            {/* Description Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center border border-pink-400/30">
                  <FaEdit className="w-3 h-3 text-pink-400" />
                </div>
                Bio Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/30 transition-all duration-300 resize-none"
                placeholder="Tell us something about yourself..."
              />
              <p className="text-white/40 text-xs mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleEdit}
                disabled={loading}
                className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="flex items-center gap-3 relative">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaSave className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                  <span>{loading ? "Saving..." : "Save Changes"}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EditProfile;