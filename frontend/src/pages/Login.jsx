import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'
import { FaEye, FaEyeSlash, FaGoogle, FaLock, FaEnvelope, FaRocket } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';

const Login = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/auth/login", {
        email, password
      }, {
        withCredentials: true
      });
      dispatch(setUserData(result.data));
      setLoading(false);
      navigate("/");
      toast.success("Login Successful");
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err.response?.data?.message || "Login failed");
    }
  }

  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let user = response.user;
      let name = user.displayName;
      let email = user.email;
      let role = ""
      const result = await axios.post(serverUrl + "/api/auth/googleauth", {
        name,
        email,
        role
      }, {
        withCredentials: true
      });
      dispatch(setUserData(result.data));
      toast.success("Google Login Successful");
      navigate("/");

    } catch (error) {
      console.error("Google Login Error:", error.code, error.message);

      if (error.code !== "auth/popup-closed-by-user") {
        toast.error("Google sign in failed: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 px-4 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl"></div>
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
              animationDuration: `${8 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl flex items-center justify-center">
        {/* Main Container - Made Smaller */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden w-full max-w-3xl">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Login Form - Made More Compact */}
            <div className="w-full md:w-1/2 p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaRocket className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                  Welcome Back
                </h1>
                <p className="text-gray-200 text-xs">
                  Login to continue your learning journey
                </p>
              </div>

              {/* Login Form */}
              <form className="space-y-4" onSubmit={(e) => {e.preventDefault(); handleLogin();}}>
                {/* Email Input */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-200 mb-1 flex items-center gap-2">
                    <FaEnvelope className="w-3 h-3 text-cyan-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300 group-hover:border-cyan-300 text-sm"
                    placeholder="Enter your email address"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                {/* Password Input */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-200 mb-1 flex items-center gap-2">
                    <FaLock className="w-3 h-3 text-purple-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300 pr-10 text-sm"
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                      onClick={() => setShow(prev => !prev)}
                    >
                      {show ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <button
                    className="text-cyan-300 hover:text-cyan-200 text-xs transition-colors duration-200"
                    onClick={() => navigate('/forget-password')}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  className="group relative w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? <ClipLoader size={16} color="white" /> : "Login to Account"}
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="px-3 text-xs text-gray-300">or continue with</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* Google Login */}
              <button
                className="group w-full flex items-center justify-center gap-2 py-2 px-4 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 text-sm"
                onClick={googleLogin}
              >
                <FaGoogle className="w-4 h-4 text-red-400" />
                <span className="font-medium">Login with Google</span>
              </button>

              {/* Sign Up Link */}
              <div className="text-center mt-4">
                <p className="text-gray-300 text-xs">
                  Don't have an account?{" "}
                  <button
                    className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors duration-200"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>

            {/* Right Side - Brand Section - Made More Compact */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border-l border-white/20 flex-col items-center justify-center p-6 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400 rounded-full blur-xl"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <img
                    src={logo}
                    alt="logo"
                    className="w-15 h-15 rounded-lg object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  AI LMS
                </h2>
                <p className="text-gray-200 text-sm mb-4 max-w-xs">
                  Transform your learning experience with AI-powered courses.
                </p>
                <div className="flex items-center justify-center gap-2 text-cyan-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-xs">Join 10,000+ learners worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default Login