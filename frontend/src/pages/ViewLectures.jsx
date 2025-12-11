import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { FaPlayCircle } from 'react-icons/fa';

const ViewLectures = () => {
    const { courseId } = useParams();
    const { creatorCourseData } = useSelector(state => state.course)
    const { userData } = useSelector(state => state.user)
    const selectedCourse = creatorCourseData?.find((course) => course._id === courseId)
    const [creatorData, setCreatorData] = useState(null);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [lectures, setLectures] = useState([]);
    const navigate = useNavigate();

    // Fetch lectures for the course
    useEffect(() => {
        const fetchLectures = async () => {
            if (!courseId) return;
            
            try {
                const res = await axios.get(
                    `${serverUrl}/api/course/courselecture/${courseId}`,
                    { withCredentials: true }
                );
                
                if (res.data.lectures && res.data.lectures.length > 0) {
                    setLectures(res.data.lectures);
                    setSelectedLecture(res.data.lectures[0]);
                }
            } catch (error) {
                console.log("❌ Error fetching lectures:", error);
            }
        };

        fetchLectures();
    }, [courseId]);

    // Fetch creator data
    useEffect(() => {
        const handleCreator = async () => {
            const creatorId = selectedCourse?.creator?._id || selectedCourse?.creator;
            if (!creatorId) return;

            try {
                const res = await axios.post(
                    `${serverUrl}/api/course/creator`,
                    { userId: creatorId },
                    { withCredentials: true }
                );
                setCreatorData(res.data);
            } catch (error) {
                console.log("❌ Error fetching creator:", error);
            }
        };

        if (selectedCourse) {
            handleCreator();
        }
    }, [selectedCourse]);

    // If course not found, show error
    if (!selectedCourse) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-3xl text-gray-400">📚</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-600 mb-4">Course Not Found</h3>
                    <p className="text-gray-500 mb-6 max-w-md">The course you're looking for doesn't exist or has been removed.</p>
                    <button 
                        onClick={() => navigate("/")}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                    >
                        Browse Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 p-6">
            {/* Back Button */}
            <div className="max-w-7xl mx-auto mb-6">
                <button 
                    onClick={() => navigate("/")}
                    className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-blue-300"
                >
                    <FaArrowLeftLong className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"/>
                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">Back to Home</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="w-full lg:w-2/3 bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            {selectedCourse?.title || "Course Title Not Available"}
                        </h2>
                        <div className='mt-4 flex gap-6 text-sm font-medium'>
                            <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-xl border border-blue-100">
                                Category: {selectedCourse?.category}
                            </span>
                            <span className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-gray-700 rounded-xl border border-green-100">
                                Level: {selectedCourse?.level}
                            </span>
                        </div>
                    </div>

                    {/* Video Player */}
                    <div className='aspect-video bg-black rounded-2xl overflow-hidden mb-6 border-2 border-gray-300 shadow-lg'>
                        {selectedLecture?.videoUrl ? (
                            <video className='w-full h-full object-cover' src={selectedLecture?.videoUrl} controls />
                        ) : (
                            <div className='flex items-center justify-center h-full text-white'>
                                <div className="text-center p-8">
                                    <FaPlayCircle className="text-6xl mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium mb-2">
                                        {lectures.length > 0 ? "Video Loading..." : "No Lectures Available"}
                                    </p>
                                    <p className="text-sm opacity-75">
                                        {lectures.length > 0 ? "Video content is being prepared" : "Check back later for course content"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Lecture Title */}
                    <div className='mt-6'>
                      <h2 className='text-2xl font-semibold text-gray-800'>
                        {selectedLecture?.lectureTitle || "Select a Lecture"}
                      </h2>
                    </div>

                    {/* Creator Info Section */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <div className="flex items-center gap-6 mb-4">
                            {creatorData?.photoUrl ? (
                                <img
                                    src={creatorData.photoUrl}
                                    alt={creatorData.name}
                                    className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-gray-300"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-2xl shadow-lg">
                                    {creatorData?.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            )}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {creatorData?.name || selectedCourse?.creatorName || "Unknown Creator"}
                                </h3>
                                {creatorData?.email && (
                                    <p className="text-gray-500 text-sm mt-1">{creatorData.email}</p>
                                )}
                            </div>
                        </div>
                        
                        {creatorData?.description && (
                            <p className="text-gray-600 mb-3 leading-relaxed">
                                {creatorData.description}
                            </p>
                        )}
                        {selectedCourse?.description && (
                            <p className="text-gray-600 leading-relaxed">
                                {selectedCourse.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Lectures Sidebar */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200 h-fit sticky top-6">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-4">Course Lectures</h2>
                        <div className='flex flex-col gap-3 max-h-96 overflow-y-auto'>
                             {lectures.length > 0 ? 
                               (lectures.map((lecture, index)=>(
                                   <button 
                                     key={lecture._id || index}
                                     onClick={() => setSelectedLecture(lecture)}
                                     className={`p-4 text-left rounded-xl border-2 transition-all duration-300 flex items-center justify-between group ${
                                         selectedLecture?._id === lecture._id 
                                             ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-md' 
                                             : 'border-gray-200 hover:bg-gray-50 hover:border-blue-200 hover:shadow-lg'
                                     }`}
                                   >
                                       <div className="flex items-center gap-3">
                                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                               selectedLecture?._id === lecture._id
                                                   ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                                   : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                                           } transition-all duration-300`}>
                                               <span className="font-semibold text-sm">{index + 1}</span>
                                           </div>
                                           <span className="font-medium text-gray-800 text-left flex-1">
                                               {lecture.lectureTitle}
                                           </span>
                                       </div>
                                       <FaPlayCircle className={`text-lg transition-all duration-300 ${
                                           selectedLecture?._id === lecture._id 
                                               ? 'text-blue-600 scale-110' 
                                               : 'text-gray-400 group-hover:text-blue-500'
                                       }`}/>
                                   </button>   
                               )))
                               :
                               <div className="text-center py-8">
                                   <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                       <FaPlayCircle className="text-gray-400 text-xl" />
                                   </div>
                                   <p className='text-gray-500 text-lg'>No Lectures Available</p>
                                   <p className='text-gray-400 text-sm mt-1'>Check back later for course content</p>
                               </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewLectures