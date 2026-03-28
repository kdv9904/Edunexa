import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';

const STATS = [
  { value: "50K+", label: "Students Enrolled" },
  { value: "1,200+", label: "Expert Courses" },
  { value: "98%", label: "Satisfaction Rate" },
];

const TESTIMONIALS = [
  { text: "EduNexa helped me switch careers in 6 months.", name: "Priya S.", role: "UX Designer" },
  { text: "The best structured learning platform I've used.", name: "Kirtan V.", role: "Developer" },
  { text: "My team's productivity doubled after upskilling here.", name: "Sara K.", role: "Team Lead" },
];

export default function Login() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/auth/login", { email, password }, { withCredentials: true });
      dispatch(setUserData(result.data));
      setLoading(false);
      navigate("/");
      toast.success("Login Successful");
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const { displayName: name, email, photoURL } = response.user;
      
      const result = await axios.post(serverUrl + "/api/auth/googleauth", 
        { name, email, role: "", photoUrl: photoURL }, 
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      toast.success("Google Login Successful");
      navigate("/");

    } catch (error) {
      // ✅ Handle 404 - user doesn't exist
      if (error.response?.status === 404 && error.response?.data?.shouldSignUp) {
        toast.error("No account found. Redirecting to signup...");
        setTimeout(() => navigate('/signup'), 1500);
        return;
      }

      if (error.code !== "auth/popup-closed-by-user") {
        toast.error("Google sign in failed: " + error.message);
      }
    }
};

  const t = TESTIMONIALS[testimonialIdx];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .en-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          background: #0c0f1a;
        }
        @media (max-width: 820px) {
          .en-root { grid-template-columns: 1fr; }
          .en-left  { display: none; }
          .en-right { min-height: 100vh; }
        }

        /* ── LEFT PANEL ── */
        .en-left {
          position: relative;
          background: #0c0f1a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 52px 44px;
          overflow: hidden;
        }
        .en-left-bg {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 60% 50% at 80% 10%, rgba(16,185,129,.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 10% 90%, rgba(99,102,241,.14) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 60% 55%, rgba(245,158,11,.06) 0%, transparent 60%);
        }
        .en-grid {
          position: absolute; inset: 0; z-index: 0; opacity: .035;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .en-brand { position: relative; z-index: 1; display: flex; align-items: center; gap: 12px; }
        .en-brand-logo {
          width: 40px; height: 40px; border-radius: 10px; overflow: hidden;
          border: 1px solid rgba(255,255,255,.12);
        }
        .en-brand-logo img { width: 100%; height: 100%; object-fit: cover; }
        .en-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #fff; letter-spacing: -.3px;
        }
        .en-brand-name span { color: #10b981; }

        .en-hero { position: relative; z-index: 1; }
        .en-tag {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(16,185,129,.12); border: 1px solid rgba(16,185,129,.25);
          padding: 5px 14px; border-radius: 100px; margin-bottom: 24px;
        }
        .en-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: blink 1.8s ease infinite; }
        .en-tag span { font-size: 11px; font-weight: 500; color: #10b981; letter-spacing: 1px; text-transform: uppercase; }
        .en-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 3.5vw, 46px); font-weight: 700;
          color: #fff; line-height: 1.2; margin-bottom: 18px;
        }
        .en-headline em { color: #10b981; font-style: normal; }
        .en-sub { font-size: 15px; color: rgba(255,255,255,.45); line-height: 1.7; max-width: 340px; }

        .en-stats { display: flex; gap: 32px; position: relative; z-index: 1; }
        .en-stat-val { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #fff; }
        .en-stat-lbl { font-size: 11px; color: rgba(255,255,255,.35); margin-top: 2px; }

        .en-testimonial {
          position: relative; z-index: 1;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px; padding: 22px 24px;
          transition: opacity .5s ease;
        }
        .en-quote { font-size: 13.5px; color: rgba(255,255,255,.7); line-height: 1.65; margin-bottom: 14px; font-style: italic; }
        .en-author { display: flex; align-items: center; gap: 10px; }
        .en-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #6366f1);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600; color: #fff;
        }
        .en-author-name { font-size: 13px; font-weight: 600; color: #fff; }
        .en-author-role { font-size: 11px; color: rgba(255,255,255,.35); }
        .en-dots { display: flex; gap: 5px; margin-top: 14px; }
        .en-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.2); transition: all .3s; }
        .en-dot.active { background: #10b981; width: 16px; border-radius: 100px; }

        /* ── RIGHT PANEL ── */
        .en-right {
          background: #f7f8fa;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 32px;
        }
        .en-card {
          width: 100%; max-width: 400px;
          opacity: 0; transform: translateY(24px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .en-card.visible { opacity: 1; transform: translateY(0); }

        .en-form-header { margin-bottom: 32px; }
        .en-form-eyebrow { font-size: 11px; font-weight: 600; color: #10b981; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; }
        .en-form-title { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: #0c0f1a; line-height: 1.2; }
        .en-form-sub { font-size: 13.5px; color: #8b909a; margin-top: 6px; }

        .en-field { margin-bottom: 18px; }
        .en-label {
          display: block; font-size: 12px; font-weight: 600;
          color: #3d4152; letter-spacing: .4px; margin-bottom: 7px; text-transform: uppercase;
        }
        .en-input-wrap { position: relative; }
        .en-input {
          width: 100%; padding: 12px 16px;
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 12px;
          font-size: 14px; color: #0c0f1a; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color .25s, box-shadow .25s;
        }
        .en-input::placeholder { color: #c1c5ce; }
        .en-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,.1); }
        .en-eye {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #a0a5b2;
          display: flex; align-items: center; transition: color .2s;
        }
        .en-eye:hover { color: #10b981; }
        .en-forgot {
          text-align: right; margin-top: 6px;
          font-size: 12px; font-weight: 500; color: #10b981; cursor: pointer;
          background: none; border: none;
        }
        .en-forgot:hover { text-decoration: underline; }

        .en-btn-primary {
          width: 100%; padding: 13.5px;
          background: #0c0f1a; color: #fff;
          border: none; border-radius: 12px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          letter-spacing: .3px; position: relative; overflow: hidden;
          transition: background .25s, transform .15s, box-shadow .25s;
          margin-top: 6px;
        }
        .en-btn-primary:hover:not(:disabled) {
          background: #1a1f35;
          box-shadow: 0 8px 24px rgba(12,15,26,.25);
          transform: translateY(-1px);
        }
        .en-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .en-btn-primary:disabled { opacity: .6; cursor: not-allowed; }
        .en-btn-primary .shine {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.08) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform .6s ease;
        }
        .en-btn-primary:hover .shine { transform: translateX(100%); }

        .en-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
        .en-divider-line { flex: 1; height: 1px; background: #e5e7eb; }
        .en-divider span { font-size: 11px; color: #b0b5c1; font-weight: 500; white-space: nowrap; }

        .en-btn-google {
          width: 100%; padding: 12px;
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 12px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          color: #3d4152; display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: border-color .2s, background .2s, transform .15s, box-shadow .2s;
        }
        .en-btn-google:hover {
          border-color: #d1d5db; background: #fafafa;
          box-shadow: 0 2px 12px rgba(0,0,0,.06); transform: translateY(-1px);
        }
        .en-google-icon { color: #ea4335; font-size: 16px; }

        .en-signup { text-align: center; margin-top: 22px; font-size: 13px; color: #8b909a; }
        .en-signup button {
          background: none; border: none; cursor: pointer;
          color: #10b981; font-weight: 600; font-family: 'DM Sans', sans-serif;
          font-size: 13px; margin-left: 4px;
        }
        .en-signup button:hover { text-decoration: underline; }

        .en-trust { display: flex; align-items: center; gap: 8px; margin-top: 28px; justify-content: center; }
        .en-trust-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; }
        .en-trust span { font-size: 11px; color: #b0b5c1; }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: .3; }
        }
      `}</style>

      <div className="en-root">

        {/* ── LEFT PANEL ── */}
        <div className="en-left">
          <div className="en-left-bg" />
          <div className="en-grid" />

          {/* Brand */}
          <div className="en-brand">
            <div className="en-brand-logo"><img src={logo} alt="EduNexa" /></div>
            <div className="en-brand-name">Edu<span>nexa</span></div>
          </div>

          {/* Hero copy */}
          <div className="en-hero">
            <div className="en-tag">
              <div className="en-tag-dot" />
              <span>AI-Powered Learning</span>
            </div>
            <h1 className="en-headline">
              Learn Without<br /><em>Limits.</em>
            </h1>
            <p className="en-sub">
              Access world-class courses, expert instructors, and a community of learners who push each other forward.
            </p>
          </div>

          {/* Stats */}
          <div className="en-stats">
            {STATS.map(s => (
              <div key={s.label}>
                <div className="en-stat-val">{s.value}</div>
                <div className="en-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="en-testimonial" key={testimonialIdx}>
            <p className="en-quote">"{t.text}"</p>
            <div className="en-author">
              <div className="en-avatar">{t.name[0]}</div>
              <div>
                <div className="en-author-name">{t.name}</div>
                <div className="en-author-role">{t.role}</div>
              </div>
            </div>
            <div className="en-dots">
              {TESTIMONIALS.map((_, i) => (
                <div key={i} className={`en-dot${i === testimonialIdx ? " active" : ""}`} />
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="en-right">
          <div className={`en-card${mounted ? " visible" : ""}`}>

            <div className="en-form-header">
              <div className="en-form-eyebrow">Welcome back</div>
              <h2 className="en-form-title">Sign in to<br />your account</h2>
              <p className="en-form-sub">Continue your learning journey where you left off.</p>
            </div>

            <form onSubmit={e => { e.preventDefault(); handleLogin(); }}>
              {/* Email */}
              <div className="en-field">
                <label className="en-label">Email Address</label>
                <div className="en-input-wrap">
                  <input
                    className="en-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="en-field">
                <label className="en-label">Password</label>
                <div className="en-input-wrap">
                  <input
                    className="en-input"
                    type={show ? "text" : "password"}
                    placeholder="Enter your password"
                    style={{ paddingRight: 42 }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button type="button" className="en-eye" onClick={() => setShow(p => !p)}>
                    {show ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
                <button type="button" className="en-forgot" onClick={() => navigate('/forget-password')}>
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button className="en-btn-primary" type="submit" disabled={loading}>
                <div className="shine" />
                <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {loading ? <ClipLoader size={16} color="#fff" /> : "Sign In"}
                </span>
              </button>
            </form>

            <div className="en-divider">
              <div className="en-divider-line" />
              <span>or continue with</span>
              <div className="en-divider-line" />
            </div>

            <button className="en-btn-google" onClick={googleLogin}>
              <FaGoogle className="en-google-icon" />
              Continue with Google
            </button>

            <div className="en-signup">
              Don't have an account?
              <button onClick={() => navigate('/signup')}>Create one free</button>
            </div>

            <div className="en-trust">
              <div className="en-trust-dot" />
              <span>Secured with 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}