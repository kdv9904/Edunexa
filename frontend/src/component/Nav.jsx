import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.jpg';
import { IoMenu, IoClose } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBook, FaSignOutAlt, FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa';

const Nav = () => {
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/login");
      setShowDropdown(false);
      setIsMobileMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const iseducator = userData?.user?.role === 'educator';
  const isStudent = userData?.user?.role === 'student';

  return (
    <nav className={`w-full h-20 fixed top-0 px-6 py-4 flex items-center justify-between 
                    transition-all duration-500 z-50 ${
                      isScrolled 
                        ? 'bg-white/10 backdrop-blur-2xl border-b border-white/20 shadow-2xl' 
                        : 'bg-transparent backdrop-blur-sm'
                    }`}>
      
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="flex items-center relative z-10">
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
          <img 
            src={logo} 
            alt="logo" 
            className="w-12 h-12 rounded-2xl border-2 border-white/30 cursor-pointer transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-400/60 relative z-10 shadow-2xl"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-end gap-4 relative z-10">
        {/* My Learning - Only for Students */}
        {isStudent && (
          <button 
            className="group relative overflow-hidden px-5 py-2.5 border border-green-400/40 text-white rounded-2xl text-sm font-medium 
                       bg-white/10 backdrop-blur-xl hover:bg-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
            onClick={() => navigate("/mycourses")}
          >
            <div className="flex items-center gap-2">
              <FaGraduationCap className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>My Learning</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        )}

        {iseducator && (
          <button 
            className="group relative overflow-hidden px-5 py-2.5 border border-cyan-400/40 text-white rounded-2xl text-sm font-medium 
                       bg-white/10 backdrop-blur-xl hover:bg-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
            onClick={() => navigate("/dashboard")}
          >
            <div className="flex items-center gap-2">
              <FaChalkboardTeacher className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Dashboard</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        )}

        {userData ? (
          <div className="flex items-center gap-3 relative">
            {/* Profile Section */}
            <div className="flex items-center gap-2" ref={dropdownRef}>
              {/* Signout Button */}
              <button 
                className="flex items-center gap-2 px-4 py-2.5 text-red-300 hover:bg-red-500/20 transition-all duration-300 group rounded-2xl border border-red-400/40 backdrop-blur-xl hover:scale-105"
                onClick={handleLogout}
                title="Sign Out"
              >
                <FaSignOutAlt className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium hidden lg:block">Sign Out</span>
              </button>

              {/* Profile Avatar */}
              <div 
                className="relative group cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-40 blur-lg transition-all duration-500"></div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg border-2 border-white/30 
                             bg-white/10 backdrop-blur-xl overflow-hidden relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-400/60 shadow-2xl">
                  {userData.user.photoUrl ? (
                    <img src={userData.user.photoUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-white">
                      {userData.user.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                {/* Online Indicator */}
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full z-20 shadow-lg"></div>
              </div>
            </div>

            {/* Enhanced Dropdown */}
            {showDropdown && (
              <div className="absolute top-full right-0 mt-3 w-72 bg-white/10 backdrop-blur-2xl text-white rounded-3xl shadow-2xl py-4 z-50 border border-white/20">
                {/* User Info Header */}
                <div className="px-5 py-4 border-b border-white/20">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-white/30 shadow-2xl">
                      {userData.user.photoUrl ? (
                        <img src={userData.user.photoUrl} alt="avatar" className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        userData.user.name?.charAt(0).toUpperCase() || "?"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg truncate">{userData.user.name}</p>
                      <p className="text-gray-200 truncate">{userData.user.email}</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/30 rounded-full border border-cyan-400/50 backdrop-blur-sm">
                    <span className="text-sm font-medium text-cyan-200">{userData.user.role}</span>
                  </div>
                </div>
                
                {/* Dropdown Items */}
                <div className="py-2">
                  <button 
                    className="flex items-center gap-4 w-full px-5 py-3 hover:bg-white/10 transition-all duration-300 group rounded-xl mx-2"
                    onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <FaUser className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-white">My Profile</span>
                  </button>
                  
                  <button 
                    className="flex items-center gap-4 w-full px-5 py-3 hover:bg-white/10 transition-all duration-300 group rounded-xl mx-2"
                    onClick={() => { 
                      if (userData?.user?.role === "educator") {
                        navigate("/courses"); 
                      } else {
                        navigate("/allcourses"); 
                      }
                      setShowDropdown(false); 
                    }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <FaBook className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-white">All Courses</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-semibold 
                       shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:scale-105 border border-cyan-400/30"
            onClick={() => navigate("/login")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative">Get Started</span>
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button 
        className={`md:hidden text-white text-2xl relative z-10 p-3 rounded-2xl transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/20 backdrop-blur-2xl border border-white/30 hover:bg-white/30' 
            : 'bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20'
        }`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
      </button>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`absolute top-20 left-0 w-full py-8 px-6 md:hidden text-white transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/15 backdrop-blur-2xl border-b border-white/20' 
            : 'bg-black/20 backdrop-blur-2xl border-b border-white/10'
        }`}>
          <div className="flex flex-col space-y-4">
            {/* My Learning - Only for Students in Mobile */}
            {isStudent && (
              <button 
                className="flex items-center gap-4 py-4 px-5 border border-green-400/40 text-white rounded-2xl text-center 
                           bg-white/10 backdrop-blur-xl hover:bg-green-500/30 transition-all duration-300 hover:scale-105"
                onClick={() => { navigate("/mycourses"); setIsMobileMenuOpen(false); }}
              >
                <FaGraduationCap className="w-5 h-5" />
                <span className="font-medium">My Learning</span>
              </button>
            )}

            {iseducator && (
              <button 
                className="flex items-center gap-4 py-4 px-5 border border-cyan-400/40 text-white rounded-2xl text-center 
                           bg-white/10 backdrop-blur-xl hover:bg-cyan-500/30 transition-all duration-300 hover:scale-105"
                onClick={() => { navigate("/dashboard"); setIsMobileMenuOpen(false); }}
              >
                <FaChalkboardTeacher className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </button>
            )}

            {userData ? (
              <>
                {/* User Info Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/20 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-white/30 shadow-2xl">
                      {userData.user.photoUrl ? (
                        <img src={userData.user.photoUrl} alt="avatar" className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        userData.user.name?.charAt(0).toUpperCase() || "?"
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{userData.user.name}</p>
                      <p className="text-gray-200 text-sm">{userData.user.email}</p>
                      <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-cyan-500/30 rounded-full border border-cyan-400/50">
                        <span className="text-xs text-cyan-200 font-medium">{userData.user.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  className="flex items-center gap-4 py-4 px-5 hover:bg-white/10 rounded-2xl transition-all duration-300 group"
                  onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <FaUser className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">My Profile</span>
                </button>

                <button 
                  className="flex items-center gap-4 py-4 px-5 hover:bg-white/10 rounded-2xl transition-all duration-300 group"
                  onClick={() => { 
                    if (userData?.user?.role === "educator") {
                      navigate("/courses"); 
                    } else {
                      navigate("/allcourses"); 
                    }
                    setIsMobileMenuOpen(false); 
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <FaBook className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">All Courses</span>
                </button>

                <button 
                  className="flex items-center gap-4 py-4 px-5 border border-red-400/40 text-red-300 rounded-2xl text-center 
                             bg-red-500/20 hover:bg-red-500/30 transition-all duration-300 mt-4 group hover:scale-105"
                  onClick={handleLogout}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <FaSignOutAlt className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">Sign Out</span>
                </button>
              </>
            ) : (
              <button 
                className="py-4 px-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl text-center 
                           shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 border border-cyan-400/30 font-semibold"
                onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </nav>
  );
};

export default Nav;
