import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaBook, FaEnvelope, FaUser, FaStar, FaRocket, FaPalette } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';

const Profile = () => {
    const { userData } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [particles, setParticles] = useState([]);

    // Generate floating particles
    useEffect(() => {
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5,
            size: Math.random() * 4 + 2,
        }));
        setParticles(newParticles);
    }, []);

    // Calculate user level based on enrolled courses
    const userLevel = Math.floor((userData?.user?.enrolledCourses?.length || 0) / 3) + 1;
    const progress = ((userData?.user?.enrolledCourses?.length || 0) % 3) * 33.33;

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 px-4 py-8 flex items-center justify-center relative overflow-hidden'>
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

            <div className='relative max-w-4xl w-full'>
                {/* Navigation Orb */}
                <button 
                    onClick={() => navigate("/")}
                    className="absolute -top-6 -left-6 z-20 group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl rotate-45 shadow-2xl transition-all duration-500 group-hover:rotate-90 group-hover:scale-110 flex items-center justify-center">
                            <FaArrowLeftLong className="w-5 h-5 text-white -rotate-45 transition-transform duration-500 group-hover:-rotate-90" />
                        </div>
                        {isHovered && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg backdrop-blur-sm whitespace-nowrap">
                                Back to Home
                            </div>
                        )}
                    </div>
                </button>

                {/* Main Container */}
                <div className='bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden'>
                    {/* Animated Header */}
                    <div className='relative h-40 bg-gradient-to-r from-cyan-500/20 via-purple-500/30 to-pink-500/20 overflow-hidden'>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-black/20"></div>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-xl"></div>
                        
                        {/* Floating Icons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            <div className="w-8 h-8 bg-white/10 rounded-lg backdrop-blur-sm flex items-center justify-center">
                                <FaRocket className="w-3 h-3 text-cyan-400" />
                            </div>
                            <div className="w-8 h-8 bg-white/10 rounded-lg backdrop-blur-sm flex items-center justify-center">
                                <FaPalette className="w-3 h-3 text-purple-400" />
                            </div>
                            <div className="w-8 h-8 bg-white/10 rounded-lg backdrop-blur-sm flex items-center justify-center">
                                <FaStar className="w-3 h-3 text-yellow-400" />
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className='px-8 pb-8 relative -mt-12'>
                        {/* Avatar with Orbital Ring */}
                        <div className='flex justify-center mb-6 relative'>
                            <div className='relative'>
                                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full opacity-20 blur-md animate-pulse"></div>
                                <div className="relative">
                                    {userData?.user?.photoUrl ? (
                                        <img 
                                            src={userData.user.photoUrl} 
                                            className='w-32 h-32 rounded-2xl object-cover border-4 border-slate-800 shadow-2xl transition-all duration-500 hover:scale-110 hover:rounded-3xl' 
                                            alt="Profile"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-slate-800 shadow-2xl transition-all duration-500 hover:scale-110 hover:rounded-3xl">
                                            {userData?.user?.name ? userData.user.name.slice(0,1).toUpperCase() : "?"}
                                        </div>
                                    )}
                                </div>
                                {/* Level Badge */}
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-slate-800 shadow-lg">
                                    <span className="text-xs font-bold text-white">{userLevel}</span>
                                </div>
                            </div>
                        </div>

                        {/* User Info with Progress */}
                        <div className='text-center mb-8'>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                {userData?.user?.name || "Anonymous User"}
                            </h1>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                                <FaUser className="w-3 h-3 text-cyan-400" />
                                <span className="text-sm font-medium text-gray-300">{userData?.user?.role || "Explorer"}</span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mt-4 max-w-md mx-auto">
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Level {userLevel}</span>
                                    <span>{progress.toFixed(0)}% to next level</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Tabs */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/5 rounded-2xl p-1 backdrop-blur-sm border border-white/10">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`px-6 py-2 rounded-xl transition-all duration-300 ${
                                        activeTab === 'profile' 
                                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('stats')}
                                    className={`px-6 py-2 rounded-xl transition-all duration-300 ${
                                        activeTab === 'stats' 
                                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Stats
                                </button>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Email Card */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group hover:scale-105">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                        <FaEnvelope className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-gray-400 mb-1">Contact</h3>
                                        <p className="text-white font-medium truncate">{userData?.user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Courses Card */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group hover:scale-105">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                        <FaBook className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-gray-400 mb-1">Learning Journey</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-white">
                                                {userData?.user?.enrolledCourses?.length || 0}
                                            </span>
                                            <span className="text-sm text-gray-400">courses enrolled</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description Card - Full Width */}
                            <div className="md:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-pink-500/30 transition-all duration-300">
                                <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
                                    Personal Story
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {userData?.user?.description || "Your story is waiting to be written. Share your journey and inspire others!"}
                                </p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className='flex justify-center'>
                            <button 
                                onClick={() => navigate('/editprofile')}
                                className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl font-semibold px-8 py-4 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <div className="relative flex items-center gap-3">
                                    <FaEdit className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                    Edit Your Profile
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add custom animations to tailwind config */}
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
    )
}

export default Profile;