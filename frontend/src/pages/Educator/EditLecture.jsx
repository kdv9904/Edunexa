import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { FaArrowLeftLong, FaVideo, FaTrash, FaTriangleExclamation } from 'react-icons/fa6' // Updated import
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from './../../App';
import { setLectureData } from '../../redux/lectureSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

const EditLecture = () => {
    const { courseId, lectureId } = useParams()
    const { lectureData } = useSelector(state => state.lecture)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [lectureTitle, setLectureTitle] = useState("")
    const [videoUrl, setVideoUrl] = useState(null);
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showLargeFileWarning, setShowLargeFileWarning] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    // Find the selected lecture safely
    useEffect(() => {
        if (lectureData && lectureId) {
            const lecture = lectureData.find(lecture => lecture._id === lectureId);
            setSelectedLecture(lecture);
            
            if (lecture) {
                setLectureTitle(lecture.lectureTitle || "");
                setIsPreviewFree(lecture.isPreviewFree || false);
            }
            setIsLoading(false);
        }
    }, [lectureData, lectureId]);

    // Handle navigation back
    const handleBack = () => {
        navigate(`/create-lecture/${courseId}`)
    }

    const handleEditLecture = async () => {
        if (!lectureTitle.trim()) {
            toast.error("Lecture title is required");
            return;
        }

        setLoading(true)
        setUploadProgress(0)
        
        const formData = new FormData()
        formData.append("lectureTitle", lectureTitle)
        formData.append("isPreviewFree", isPreviewFree)
        
        if (videoUrl) {
            formData.append("videoUrl", videoUrl)
        }

        try {
            const result = await axios.post(
                serverUrl + `/api/course/editlecture/${lectureId}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 120000,
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const progress = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setUploadProgress(progress);
                            
                            if (progress > 10) {
                                setShowLargeFileWarning(false);
                            }
                        }
                    }
                }
            );

            const updatedLectures = lectureData.map(lecture =>
                lecture._id === lectureId ? result.data.lecture : lecture
            );
            dispatch(setLectureData(updatedLectures));

            toast.success("🎉 Lecture updated successfully");
            navigate(-1);
            
        } catch (error) {
            console.log("Edit lecture error details:", error);
            
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                toast.warning(
                    "Request is taking longer than expected. The lecture may have been updated successfully. " +
                    "Please check your course lectures to confirm."
                );
                
                setTimeout(() => {
                    navigate(-1);
                }, 3000);
                
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.code === 'ERR_NETWORK') {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error("Failed to update lecture. Please try again.");
            }
        } finally {
            setLoading(false);
            setUploadProgress(0);
            setShowLargeFileWarning(false);
        }
    }

    const handleRemoveLecture = async () => {
        const confirmed = await new Promise(resolve => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60';
            modal.innerHTML = `
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-white/10">
                    <div class="text-center mb-4">
                        <div class="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-3">
                            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-white mb-2">Delete Lecture</h3>
                        <p class="text-gray-300 text-sm">Are you sure you want to delete this lecture? This action cannot be undone.</p>
                    </div>
                    <div class="flex gap-3">
                        <button id="cancel" class="flex-1 px-4 py-2 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition">Cancel</button>
                        <button id="confirm" class="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition">Delete Lecture</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.querySelector('#cancel').onclick = () => {
                document.body.removeChild(modal);
                resolve(false);
            };
            
            modal.querySelector('#confirm').onclick = () => {
                document.body.removeChild(modal);
                resolve(true);
            };
        });

        if (!confirmed) return;

        setRemoveLoading(true);
        try {
            const result = await axios.delete(
                serverUrl + `/api/course/removelecture/${lectureId}`,
                { 
                    withCredentials: true,
                    timeout: 10000
                }
            );

            const updatedLectures = lectureData.filter(lecture => lecture._id !== lectureId);
            dispatch(setLectureData(updatedLectures));

            toast.success("✅ Lecture removed successfully");
            navigate(`/create-lecture/${courseId}`);
        } catch (error) {
            console.log("Remove lecture error:", error);
            toast.error(error.response?.data?.message || "Failed to remove lecture");
        } finally {
            setRemoveLoading(false);
        }
    }

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 100 * 1024 * 1024) {
                toast.error("File size exceeds 100MB limit");
                e.target.value = '';
                return;
            }
            
            setVideoUrl(file);
            
            if (file.size > 20 * 1024 * 1024) {
                setShowLargeFileWarning(true);
            } else {
                setShowLargeFileWarning(false);
            }
        }
    }

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            handleFileSelect({ target: { files: [file] } });
        } else {
            toast.error("Please drop a video file");
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <ClipLoader size={40} color="#ffffff" />
                    </div>
                    <p className="text-gray-300">Loading lecture data...</p>
                </div>
            </div>
        )
    }

    // Show error if lecture not found
    if (!selectedLecture) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 max-w-md w-full">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
                            <FaTriangleExclamation className="w-8 h-8 text-yellow-400" /> {/* Updated icon */}
                        </div>
                        <h2 className='text-xl font-semibold text-white mb-2'>Lecture Not Found</h2>
                        <p className="text-gray-300 mb-6">The lecture you're trying to edit doesn't exist or couldn't be loaded.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleBack}
                                className="flex-1 px-4 py-2 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4 sm:p-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Back Button */}
            <button 
                onClick={handleBack}
                className="absolute top-6 left-6 z-20 group cursor-pointer"
            >
                <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl rotate-45 shadow-2xl transition-all duration-500 group-hover:rotate-90 group-hover:scale-110 flex items-center justify-center">
                        <FaArrowLeftLong className="w-5 h-5 text-white -rotate-45 transition-transform duration-500 group-hover:-rotate-90" />
                    </div>
                </div>
            </button>

            <div className="relative z-10 max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Edit Lecture
                    </h1>
                    <p className="text-gray-300">Update your lecture content and settings</p>
                </div>

                {/* Main Form Container */}
                <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-6 lg:p-8">
                    {/* Current Lecture Info */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-100">Current Lecture</h2>
                            <span className="text-sm px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-300 rounded-full border border-cyan-500/30">
                                ID: {selectedLecture._id?.slice(-8) || 'N/A'}
                            </span>
                        </div>
                        <div className="bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center border border-white/10">
                                    <FaVideo className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-100 mb-1">{selectedLecture.lectureTitle}</h3>
                                    <div className="flex flex-wrap gap-3 text-sm">
                                        <span className={`px-2 py-1 rounded-md ${selectedLecture.isPreviewFree ? 'bg-green-500/20 text-green-400 border border-green-400/30' : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'}`}>
                                            {selectedLecture.isPreviewFree ? 'Free Preview ✓' : 'Premium'}
                                        </span>
                                        {selectedLecture.videoUrl && (
                                            <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-400/30">
                                                Video Attached
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Remove Button */}
                    <button
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium mb-8 transition-all duration-300 ${removeLoading ? 'bg-red-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30 text-red-400 hover:from-red-500/30 hover:to-red-600/30 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/10'}`}
                        onClick={handleRemoveLecture}
                        disabled={removeLoading}
                    >
                        {removeLoading ? (
                            <>
                                <ClipLoader size={16} color="#ef4444" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <FaTrash className="w-4 h-4" />
                                <span>Delete Lecture</span>
                            </>
                        )}
                    </button>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        {/* Lecture Title */}
                        <div className="group">
                            <label htmlFor="lectureTitle" className="block text-sm font-medium text-gray-300 mb-3 cursor-pointer">
                                Lecture Title *
                            </label>
                            <input
                                id="lectureTitle"
                                type="text"
                                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 hover:border-white/20"
                                placeholder="Enter lecture title"
                                onChange={(e) => setLectureTitle(e.target.value)}
                                value={lectureTitle}
                            />
                        </div>

                        {/* Video Upload */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-300 mb-3 cursor-pointer">
                                Lecture Video
                            </label>
                            <div 
                                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${dragOver ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/20 hover:border-cyan-400/50'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('videoUpload').click()}
                            >
                                <input
                                    type="file"
                                    id="videoUpload"
                                    className="hidden"
                                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                    onChange={handleFileSelect}
                                />
                                <div className="space-y-4">
                                    <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center border border-white/10">
                                        <FaVideo className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-gray-300 font-medium mb-1">
                                            {videoUrl ? videoUrl.name : 'Drop video file or click to browse'}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {videoUrl ? 
                                                `${(videoUrl.size / (1024 * 1024)).toFixed(2)} MB` : 
                                                'Max 100MB • MP4, WebM, MOV, etc.'
                                            }
                                        </p>
                                    </div>
                                    {!videoUrl && selectedLecture.videoUrl && (
                                        <p className="text-sm text-green-400">
                                            ✓ Current video will be preserved
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Large File Warning */}
                        {showLargeFileWarning && videoUrl && (
                            <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-400/30 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <FaTriangleExclamation className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" /> {/* Updated icon */}
                                    <div>
                                        <h3 className="text-sm font-medium text-yellow-300 mb-1">
                                            Large File Detected
                                        </h3>
                                        <p className="text-sm text-yellow-400/90">
                                            This file is {(videoUrl.size / (1024 * 1024)).toFixed(2)} MB. 
                                            Upload may take several minutes. Please keep this page open during upload.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Free Preview Toggle */}
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-sm rounded-xl border border-white/10">
                            <input
                                type="checkbox"
                                className="relative w-10 h-5 rounded-full appearance-none cursor-pointer bg-gray-600 checked:bg-cyan-500 transition-colors duration-200 before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:rounded-full before:bg-white before:transition-transform before:duration-200 checked:before:transform checked:before:translate-x-5"
                                id="isFree"
                                checked={isPreviewFree}
                                onChange={() => setIsPreviewFree(prev => !prev)}
                            />
                            <label htmlFor="isFree" className="text-sm text-gray-300 cursor-pointer flex-1">
                                Make this lecture available for free preview
                            </label>
                            <span className={`text-xs px-2 py-1 rounded ${isPreviewFree ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {isPreviewFree ? 'Free' : 'Premium'}
                            </span>
                        </div>

                        {/* Upload Progress */}
                        {loading && videoUrl && uploadProgress > 0 && (
                            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-cyan-400/30 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-cyan-300">
                                        {uploadProgress < 100 ? "Uploading video..." : "Finalizing..."}
                                    </span>
                                    <span className="text-sm font-bold text-cyan-400">{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-cyan-400/80 mt-2 text-center">
                                    {uploadProgress < 100 ? 
                                        "Please don't close this page. Upload in progress..." : 
                                        "✓ Upload complete! Processing final details..."
                                    }
                                </p>
                            </div>
                        )}

                        {/* Loading Status */}
                        {loading && !videoUrl && (
                            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-cyan-400/30 rounded-xl p-4 text-center">
                                <p className="text-sm text-cyan-300 flex items-center justify-center gap-2">
                                    <ClipLoader size={16} color="#06b6d4" />
                                    Updating lecture details...
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                className="flex-1 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleBack}
                                disabled={loading || removeLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleEditLecture}
                                disabled={loading || removeLoading || !lectureTitle.trim()}
                                className="group relative overflow-hidden flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <div className="relative flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <ClipLoader size={18} color="#ffffff" />
                                            <span>{videoUrl ? `Uploading ${uploadProgress}%` : "Updating..."}</span>
                                        </>
                                    ) : (
                                        <span>Update Lecture</span>
                                    )}
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
            `}</style>
        </div>
    )
}

export default EditLecture;