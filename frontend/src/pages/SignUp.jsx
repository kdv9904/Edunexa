import React, { useState, useEffect } from 'react'
import axios from 'axios'
import logo from '../assets/logo.png'
import { FaEye, FaEyeSlash, FaGoogle, FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa";
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';

const PERKS = [
  {
    icon: "🎯",
    title: "Personalized Learning",
    desc: "AI-curated paths tailored to your goals and pace.",
  },
  {
    icon: "🏆",
    title: "Industry Certificates",
    desc: "Earn credentials recognized by top companies.",
  },
  {
    icon: "👨‍🏫",
    title: "Expert Instructors",
    desc: "Learn from practitioners with real-world experience.",
  },
];

export default function SignUp() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => { setMounted(true); }, []);

  const handleSignup = async () => {
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/auth/signup", { name, email, password, role }, { withCredentials: true });
      dispatch(setUserData(result.data));
      setLoading(false);
      navigate("/login");
      toast.success("Sign Up Successful");
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Sign up failed");
    }
  };

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const { displayName: gName, email: gEmail } = response.user;
      const result = await axios.post(serverUrl + "/api/auth/googleauth", { name: gName, email: gEmail, role }, { withCredentials: true });
      dispatch(setUserData(result.data));
      toast.success("Google Sign up Successful");
      navigate("/");
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        toast.error("Google sign in failed: " + error.message);
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .su-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          background: #0c0f1a;
        }
        @media (max-width: 820px) {
          .su-root { grid-template-columns: 1fr; }
          .su-left  { display: none; }
          .su-right { min-height: 100vh; }
        }

        /* ── LEFT PANEL ── */
        .su-left {
          position: relative;
          background: #0c0f1a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 52px 44px;
          overflow: hidden;
        }
        .su-left-bg {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 60% 50% at 20% 10%, rgba(99,102,241,.13) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 85% 85%, rgba(16,185,129,.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(245,158,11,.05) 0%, transparent 60%);
        }
        .su-grid {
          position: absolute; inset: 0; z-index: 0; opacity: .035;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .su-brand { position: relative; z-index: 1; display: flex; align-items: center; gap: 12px; }
        .su-brand-logo { width: 40px; height: 40px; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,.12); }
        .su-brand-logo img { width: 100%; height: 100%; object-fit: cover; }
        .su-brand-name { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -.3px; }
        .su-brand-name span { color: #10b981; }

        .su-hero { position: relative; z-index: 1; }
        .su-tag {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(99,102,241,.12); border: 1px solid rgba(99,102,241,.25);
          padding: 5px 14px; border-radius: 100px; margin-bottom: 24px;
        }
        .su-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #818cf8; animation: blink 1.8s ease infinite; }
        .su-tag span { font-size: 11px; font-weight: 500; color: #818cf8; letter-spacing: 1px; text-transform: uppercase; }
        .su-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(30px, 3.2vw, 44px); font-weight: 700;
          color: #fff; line-height: 1.2; margin-bottom: 18px;
        }
        .su-headline em { color: #10b981; font-style: normal; }
        .su-sub { font-size: 15px; color: rgba(255,255,255,.45); line-height: 1.7; max-width: 340px; margin-bottom: 0; }

        /* Perks list */
        .su-perks { display: flex; flex-direction: column; gap: 16px; position: relative; z-index: 1; }
        .su-perk {
          display: flex; align-items: flex-start; gap: 14px;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px; padding: 16px 18px;
          transition: border-color .3s;
        }
        .su-perk:hover { border-color: rgba(16,185,129,.25); }
        .su-perk-icon { font-size: 22px; line-height: 1; flex-shrink: 0; margin-top: 1px; }
        .su-perk-title { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 3px; }
        .su-perk-desc { font-size: 12px; color: rgba(255,255,255,.4); line-height: 1.5; }

        .su-bottom { position: relative; z-index: 1; }
        .su-count {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 18px;
          background: rgba(16,185,129,.08); border: 1px solid rgba(16,185,129,.18);
          border-radius: 12px; width: fit-content;
        }
        .su-count-dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; animation: blink 1.8s ease infinite; }
        .su-count span { font-size: 12px; color: rgba(255,255,255,.6); }
        .su-count strong { color: #10b981; }

        /* ── RIGHT PANEL ── */
        .su-right {
          background: #f7f8fa;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 32px;
        }
        .su-card {
          width: 100%; max-width: 420px;
          opacity: 0; transform: translateY(24px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .su-card.visible { opacity: 1; transform: translateY(0); }

        .su-form-header { margin-bottom: 28px; }
        .su-form-eyebrow { font-size: 11px; font-weight: 600; color: #6366f1; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; }
        .su-form-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #0c0f1a; line-height: 1.2; }
        .su-form-sub { font-size: 13.5px; color: #8b909a; margin-top: 6px; }

        .su-field { margin-bottom: 16px; }
        .su-label { display: block; font-size: 11px; font-weight: 600; color: #3d4152; letter-spacing: .4px; margin-bottom: 7px; text-transform: uppercase; }
        .su-input-wrap { position: relative; }
        .su-input {
          width: 100%; padding: 11px 16px;
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 12px;
          font-size: 14px; color: #0c0f1a; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color .25s, box-shadow .25s;
        }
        .su-input::placeholder { color: #c1c5ce; }
        .su-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
        .su-eye {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #a0a5b2;
          display: flex; align-items: center; transition: color .2s;
        }
        .su-eye:hover { color: #6366f1; }

        /* Role toggle */
        .su-role-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .su-role-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 11px 16px; border-radius: 12px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          border: 1.5px solid #e5e7eb; background: #fff; color: #8b909a;
          transition: all .2s;
        }
        .su-role-btn:hover { border-color: #c7d2fe; color: #6366f1; }
        .su-role-btn.active-student { border-color: #10b981; background: rgba(16,185,129,.07); color: #059669; }
        .su-role-btn.active-educator { border-color: #6366f1; background: rgba(99,102,241,.07); color: #6366f1; }
        .su-role-icon { font-size: 15px; }

        .su-btn-primary {
          width: 100%; padding: 13px;
          background: #0c0f1a; color: #fff;
          border: none; border-radius: 12px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          letter-spacing: .3px; position: relative; overflow: hidden;
          transition: background .25s, transform .15s, box-shadow .25s;
          margin-top: 4px;
        }
        .su-btn-primary:hover:not(:disabled) { background: #1a1f35; box-shadow: 0 8px 24px rgba(12,15,26,.25); transform: translateY(-1px); }
        .su-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .su-btn-primary:disabled { opacity: .6; cursor: not-allowed; }
        .su-btn-primary .shine {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.08) 50%, transparent 60%);
          transform: translateX(-100%); transition: transform .6s ease;
        }
        .su-btn-primary:hover .shine { transform: translateX(100%); }

        .su-divider { display: flex; align-items: center; gap: 12px; margin: 18px 0; }
        .su-divider-line { flex: 1; height: 1px; background: #e5e7eb; }
        .su-divider span { font-size: 11px; color: #b0b5c1; font-weight: 500; white-space: nowrap; }

        .su-btn-google {
          width: 100%; padding: 11px;
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 12px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          color: #3d4152; display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: border-color .2s, background .2s, transform .15s, box-shadow .2s;
        }
        .su-btn-google:hover { border-color: #d1d5db; background: #fafafa; box-shadow: 0 2px 12px rgba(0,0,0,.06); transform: translateY(-1px); }
        .su-google-icon { color: #ea4335; font-size: 16px; }

        .su-login { text-align: center; margin-top: 20px; font-size: 13px; color: #8b909a; }
        .su-login button {
          background: none; border: none; cursor: pointer;
          color: #6366f1; font-weight: 600; font-family: 'DM Sans', sans-serif; font-size: 13px; margin-left: 4px;
        }
        .su-login button:hover { text-decoration: underline; }

        .su-trust { display: flex; align-items: center; gap: 8px; margin-top: 24px; justify-content: center; }
        .su-trust-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; }
        .su-trust span { font-size: 11px; color: #b0b5c1; }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: .3; }
        }
      `}</style>

      <div className="su-root">

        {/* ── LEFT PANEL ── */}
        <div className="su-left">
          <div className="su-left-bg" />
          <div className="su-grid" />

          {/* Brand */}
          <div className="su-brand">
            <div className="su-brand-logo"><img src={logo} alt="EduNexa" /></div>
            <div className="su-brand-name">Edu<span>nexa</span></div>
          </div>

          {/* Hero */}
          <div className="su-hero">
            <div className="su-tag">
              <div className="su-tag-dot" />
              <span>Free to Join</span>
            </div>
            <h1 className="su-headline">
              Your Journey<br />Starts <em>Here.</em>
            </h1>
            <p className="su-sub">
              Join a global community of learners and educators building real skills for a changing world.
            </p>
          </div>

          {/* Perks */}
          <div className="su-perks">
            {PERKS.map(p => (
              <div className="su-perk" key={p.title}>
                <div className="su-perk-icon">{p.icon}</div>
                <div>
                  <div className="su-perk-title">{p.title}</div>
                  <div className="su-perk-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom counter */}
          <div className="su-bottom">
            <div className="su-count">
              <div className="su-count-dot" />
              <span><strong>50,000+</strong> learners already on board</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="su-right">
          <div className={`su-card${mounted ? " visible" : ""}`}>

            <div className="su-form-header">
              <div className="su-form-eyebrow">Create account</div>
              <h2 className="su-form-title">Start learning<br />for free today</h2>
              <p className="su-form-sub">No credit card required. Cancel anytime.</p>
            </div>

            <form onSubmit={e => { e.preventDefault(); handleSignup(); }}>

              {/* Name */}
              <div className="su-field">
                <label className="su-label">Full Name</label>
                <input className="su-input" type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
              </div>

              {/* Email */}
              <div className="su-field">
                <label className="su-label">Email Address</label>
                <input className="su-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              {/* Password */}
              <div className="su-field">
                <label className="su-label">Password</label>
                <div className="su-input-wrap">
                  <input
                    className="su-input" type={show ? "text" : "password"}
                    placeholder="Create a strong password"
                    style={{ paddingRight: 42 }}
                    value={password} onChange={e => setPassword(e.target.value)}
                  />
                  <button type="button" className="su-eye" onClick={() => setShow(p => !p)}>
                    {show ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div className="su-field">
                <label className="su-label">I am joining as</label>
                <div className="su-role-wrap">
                  <button
                    type="button"
                    className={`su-role-btn${role === "student" ? " active-student" : ""}`}
                    onClick={() => setRole("student")}
                  >
                    <FaGraduationCap className="su-role-icon" />
                    Student
                  </button>
                  <button
                    type="button"
                    className={`su-role-btn${role === "educator" ? " active-educator" : ""}`}
                    onClick={() => setRole("educator")}
                  >
                    <FaChalkboardTeacher className="su-role-icon" />
                    Educator
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button className="su-btn-primary" type="submit" disabled={loading}>
                <div className="shine" />
                <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {loading ? <ClipLoader size={16} color="#fff" /> : "Create Free Account"}
                </span>
              </button>
            </form>

            <div className="su-divider">
              <div className="su-divider-line" />
              <span>or sign up with</span>
              <div className="su-divider-line" />
            </div>

            <button className="su-btn-google" onClick={googleSignUp}>
              <FaGoogle className="su-google-icon" />
              Continue with Google
            </button>

            <div className="su-login">
              Already have an account?
              <button onClick={() => navigate('/login')}>Sign in</button>
            </div>

            <div className="su-trust">
              <div className="su-trust-dot" />
              <span>Secured with 256-bit SSL encryption</span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}