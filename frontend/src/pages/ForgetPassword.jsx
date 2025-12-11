import axios from 'axios'
import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from './../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaEnvelope, FaKey, FaShieldAlt, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const ForgetPassword = () => {
  const [step,setStep] = useState(1)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [otp,setOtp] = useState("");
  const [password,setPassword] = useState("");
  const [conPassword,setConPassword] = useState(""); 
  const [newPassword, setNewPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const sendOtp = async()=>{
    setLoading(true);
    try{
        const result= await axios.post(serverUrl + "/api/auth/sendotp",{email}, {withCredentials:true});
        setStep(2);
        toast.success(result.data.message);
    }catch(error){
        toast.error(error.response.data.message);
    }finally{
      setLoading(false);
    }
  }

  const verifyOTP = async()=>{
    setLoading(true);
    try{
      const result = await axios.post(serverUrl + "/api/auth/verifyotp",{email,otp}, {withCredentials:true});
      setStep(3);
      toast.success(result.data.message)
    }catch(error){
      console.error(error.message);
      toast.error(error.response.data.message);
    } finally {
    setLoading(false);
  }
  }

  const resetPassword= async()=>{
    setLoading(true);
    try{
      if(newPassword !== conPassword) {
        toast.error("Password and Confirm Password do not match");
        return;
      }
       const result= await axios.post(serverUrl + "/api/auth/resetpassword",{email,password:newPassword},{withCredentials:true});
       setLoading(false);
       navigate('/login');
       toast.success(result.data.message);
    }catch(error){
      toast.error(error.response.data.message);
    }
  }

  // Progress steps
  const steps = [
    { number: 1, title: "Enter Email", icon: <FaEnvelope /> },
    { number: 2, title: "Verify OTP", icon: <FaShieldAlt /> },
    { number: 3, title: "New Password", icon: <FaKey /> }
  ];

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
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${
                  step === stepItem.number 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-transparent text-white scale-110' 
                    : step > stepItem.number
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white/20 border-white/30 text-white'
                }`}>
                  {step > stepItem.number ? <FaCheckCircle className="w-4 h-4" /> : stepItem.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 transition-all duration-500 ${
                    step > stepItem.number ? 'bg-green-500' : 'bg-white/30'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaKey className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {step === 1 && "Reset Your Password"}
              {step === 2 && "Verify Your Identity"}
              {step === 3 && "Create New Password"}
            </h2>
            <p className="text-gray-200 text-sm">
              {step === 1 && "Enter your email to receive a verification code"}
              {step === 2 && "Enter the 6-digit code sent to your email"}
              {step === 3 && "Create a strong new password for your account"}
            </p>
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                  <FaEnvelope className="w-4 h-4 text-cyan-400" />
                  Email Address
                </label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300 group-hover:border-cyan-300"
                  placeholder="Enter your email address" 
                  required 
                  onChange={(e)=> setEmail(e.target.value)} 
                  value={email}
                />
              </div>
              
              <button 
                className="group relative w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
                disabled={loading} 
                onClick={sendOtp}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? <ClipLoader size={20} color="white" /> : "Send Verification Code"}
                </span>
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                  <FaShieldAlt className="w-4 h-4 text-purple-400" />
                  Verification Code
                </label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300 text-center text-xl tracking-widest font-mono"
                  placeholder="123456" 
                  required 
                  onChange={(e)=>setOtp(e.target.value)} 
                  value={otp}
                  maxLength={6}
                />
                <p className="text-xs text-gray-400 mt-2 text-center">Enter the 6-digit code sent to your email</p>
              </div>
              
              <button 
                className="group relative w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
                disabled={loading} 
                onClick={verifyOTP}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? <ClipLoader size={20} color="white" /> : "Verify Code"}
                </span>
              </button>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                  <FaKey className="w-4 h-4 text-green-400" />
                  New Password
                </label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-all duration-300"
                  placeholder="Enter new password" 
                  required 
                  onChange={(e)=>setNewPassword(e.target.value)} 
                  value={newPassword}
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                  <FaKey className="w-4 h-4 text-green-400" />
                  Confirm Password
                </label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-all duration-300"
                  placeholder="Confirm your password" 
                  required 
                  onChange={(e)=>setConPassword(e.target.value)} 
                  value={conPassword}
                />
              </div>
              
              <button 
                className="group relative w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-500 hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
                disabled={loading} 
                onClick={resetPassword}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? <ClipLoader size={20} color="white" /> : "Reset Password"}
                </span>
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div className="text-center mt-6">
            <button 
              className="flex items-center justify-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors duration-300 group mx-auto"
              onClick={()=>navigate('/login')}
            >
              <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <FaShieldAlt className="w-3 h-3" />
            Your security is our priority. All data is encrypted.
          </p>
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
      `}</style>
    </div>
  )
}

export default ForgetPassword