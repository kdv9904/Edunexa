import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-indigo-900/90 backdrop-blur-2xl text-white py-12 px-6 md:px-16 border-t border-white/10">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
        
        {/* Brand / About */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Learning
          </h2>
          <p className="text-gray-300 mt-3 text-sm leading-relaxed">
            Transform your learning with AI-powered insights, personalized courses, 
            and a smarter way to achieve your goals 🚀.
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
            <span>Made with</span>
            <FaHeart className="w-3 h-3 text-pink-400 animate-pulse" />
            <span>for learners worldwide</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-3">
            {['Home', 'All Courses', 'Profile', 'Dashboard'].map((link) => (
              <li key={link}>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-cyan-400 cursor-pointer transition-all duration-300 hover:translate-x-2 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-300 group hover:text-cyan-300 transition-colors duration-300">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-400/30">
                <span className="text-xs">📍</span>
              </div>
              <span>Dhoraji, Gujarat, India</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 group hover:text-purple-300 transition-colors duration-300">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-400/30">
                <span className="text-xs">📧</span>
              </div>
              <span>kirtanvyas9916@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 group hover:text-green-300 transition-colors duration-300">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-400/30">
                <span className="text-xs">📞</span>
              </div>
              <span>+91 93289 09056</span>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
          <p className="text-gray-300 text-sm mb-4">
            Connect with us for updates and community discussions
          </p>
          <div className="flex gap-3">
            {[
              { icon: FaFacebook, color: "hover:text-blue-400", bg: "bg-blue-500/20", border: "border-blue-400/30" },
              { icon: FaTwitter, color: "hover:text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-400/30" },
              { icon: FaLinkedin, color: "hover:text-blue-500", bg: "bg-blue-600/20", border: "border-blue-500/30" },
              { icon: FaGithub, color: "hover:text-gray-300", bg: "bg-gray-500/20", border: "border-gray-400/30" }
            ].map((social, index) => (
              <a 
                key={index}
                href="#" 
                className={`w-10 h-10 ${social.bg} ${social.border} border rounded-xl flex items-center justify-center text-gray-300 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-white/10 pt-6 text-center relative z-10">
        <div className="text-gray-400 text-sm">
          © {new Date().getFullYear()} <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">AILMS</span>. All rights reserved.
        </div>
        <div className="text-gray-500 text-xs mt-2">
          Empowering learners through AI-driven education
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;