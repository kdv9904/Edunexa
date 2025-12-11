import React, { useState, useEffect } from "react";
import Nav from "../component/Nav";
import home from "../assets/home1.jpg";
import Logos from "../component/Logos";
import ExploreCourses from "../component/ExploreCourses";
import CardPage from "../component/CardPage";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import ReviewPage from "../component/ReviewPage";
import { FaRocket, FaStar, FaPalette, FaSearch, FaBook } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setIsVisible(true);

    // Generate floating particles matching Profile page
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 3 + 1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        <Nav />

        {/* Animated Background with Profile Matching Style */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={home}
            alt="home"
            className="w-full h-full object-cover transform scale-105"
          />
          {/* Removed blue gradient overlay - keeping only dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-purple-900/50 to-indigo-900/60"></div>

          {/* Geometric Background Elements matching Profile */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl"></div>

          {/* Animated Grid Pattern with subtle effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
        </div>

        {/* Floating Particles matching Profile */}
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

        {/* Floating Icons matching Profile */}
        <div className="absolute top-20 right-20 hidden lg:flex flex-col gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
            <FaRocket className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center border border-white/10 hover:border-purple-400/30 transition-all duration-300">
            <FaStar className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center border border-white/10 hover:border-pink-400/30 transition-all duration-300">
            <FaPalette className="w-5 h-5 text-pink-400" />
          </div>
        </div>

        {/* Hero Content */}
        <div
          className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Main Heading with Profile-style Gradients */}
          <div className="mb-2 mt-16 max-w-6xl">
            <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Learn Smarter
              </span>
              <br />
              <span className="flex items-center justify-center gap-4 text-4xl md:text-6xl">
                with{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AI
                </span>
                <span className="text-cyan-400 animate-pulse">🚀</span>
              </span>
            </h1>

            {/* Subtitle with glass morphism */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 max-w-3xl mx-auto mb-12 hover:border-cyan-500/30 transition-all duration-500">
              <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed">
                Transform your learning experience with personalized AI-powered
                courses. Start your journey to mastery today.
              </p>
            </div>
          </div>

          {/* CTA Buttons with Profile-style effects */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-16">
            <button
              onClick={() => navigate("/allcourses")}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 overflow-hidden border border-cyan-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center gap-3">
                <FaBook className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Explore All Courses
              </span>
            </button>

            <button
              onClick={() => navigate("/search")}
              className="group relative px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-2xl font-semibold text-lg backdrop-blur-sm bg-cyan-400/10 hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/25 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <FaSearch className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Search With AI
              </span>
              <div className="absolute inset-0 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>

          {/* Stats with glass morphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                number: "10K+",
                label: "Active Students",
                color: "from-cyan-400 to-blue-500",
              },
              {
                number: "500+",
                label: "Expert Courses",
                color: "from-purple-400 to-pink-500",
              },
              {
                number: "24/7",
                label: "AI Support",
                color: "from-yellow-400 to-orange-500",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 group"
              >
                <div
                  className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}
                >
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of Components with dark theme wrapper */}
      <div className="relative z-20 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <div className="bg-white/5 backdrop-blur-sm">
          <Logos />
        </div>
        <div className="bg-gradient-to-br from-slate-800/40 to-purple-900/40 backdrop-blur-sm">
          <ExploreCourses />
        </div>
        <div className="bg-white/5 backdrop-blur-sm">
          <CardPage />
        </div>
        <div className="bg-gradient-to-br from-slate-800/40 to-purple-900/40 backdrop-blur-sm">
          <ReviewPage />
        </div>
        <Footer />
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
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

export default Home;