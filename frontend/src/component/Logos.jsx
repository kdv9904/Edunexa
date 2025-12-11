import React, { useState, useEffect } from 'react';
import { 
  RiRobot2Line, 
  RiBrainLine, 
  RiLightbulbFlashLine, 
  RiUserVoiceLine,
  RiShieldCheckLine,
  RiGlobalLine,
  RiBarChartBoxLine,
  RiTimeLine
} from 'react-icons/ri';

const Logos = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <RiRobot2Line className="text-2xl" />,
      title: "AI-Powered Learning",
      description: "Smart course recommendations",
      gradient: "from-cyan-500 to-blue-600",
      border: "border-cyan-200",
      theme: "light"
    },
    {
      icon: <RiBrainLine className="text-2xl" />,
      title: "Adaptive Paths", 
      description: "Personalized learning journeys",
      gradient: "from-purple-500 to-pink-600",
      border: "border-purple-200",
      theme: "light"
    },
    {
      icon: <RiLightbulbFlashLine className="text-2xl" />,
      title: "Smart Analytics",
      description: "Real-time progress tracking",
      gradient: "from-orange-500 to-red-600",
      border: "border-orange-200", 
      theme: "light"
    },
    {
      icon: <RiUserVoiceLine className="text-2xl" />,
      title: "AI Tutor 24/7",
      description: "Instant doubt resolution",
      gradient: "from-green-500 to-emerald-600",
      border: "border-green-200",
      theme: "light"
    },
    {
      icon: <RiShieldCheckLine className="text-2xl" />,
      title: "Certified Courses",
      description: "Industry-recognized credentials",
      gradient: "from-indigo-500 to-purple-600",
      border: "border-indigo-200",
      theme: "light"
    },
    {
      icon: <RiGlobalLine className="text-2xl" />,
      title: "Global Community",
      description: "Connect with learners worldwide",
      gradient: "from-teal-500 to-cyan-600",
      border: "border-teal-200",
      theme: "light"
    },
    {
      icon: <RiBarChartBoxLine className="text-2xl" />,
      title: "Progress Dashboard",
      description: "Visual learning analytics",
      gradient: "from-rose-500 to-pink-600",
      border: "border-rose-200",
      theme: "light"
    },
    {
      icon: <RiTimeLine className="text-2xl" />,
      title: "Lifetime Access",
      description: "Learn at your own pace",
      gradient: "from-amber-500 to-orange-600",
      border: "border-amber-200",
      theme: "light"
    }
  ];

  return (
    <div className="w-full py-20 bg-gradient-to-br from-white via-gray-50 to-cyan-50 relative overflow-hidden">
      {/* Background Elements that connect with dark theme */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-900/0 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header with Dark Accents */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-slate-900 to-purple-900 rounded-2xl p-1 shadow-2xl mb-8">
            <div className="bg-white rounded-xl px-8 py-6">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent mb-4">
                Why Choose <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">AI LMS</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the future of learning with intelligent AI technology
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-6 rounded-2xl bg-white border ${feature.border} shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              
              {/* Icon */}
              <div className={`relative z-10 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2 relative z-10">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${feature.gradient} group-hover:w-3/4 transition-all duration-500 rounded-full`}></div>
            </div>
          ))}
        </div>

        {/* Stats - Mixed Theme */}
        <div className="bg-gradient-to-r from-slate-900 to-purple-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shine"></div>
          
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Active Learners", gradient: "from-cyan-400 to-blue-500" },
              { number: "1K+", label: "AI Courses", gradient: "from-purple-400 to-pink-500" },
              { number: "24/7", label: "AI Support", gradient: "from-yellow-400 to-orange-500" },
              { number: "98%", label: "Success Rate", gradient: "from-green-400 to-emerald-500" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium group-hover:text-white transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { background-position: -100% -100%; }
          100% { background-position: 200% 200%; }
        }
        .animate-shine {
          animation: shine 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Logos;