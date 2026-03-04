import React, { useState, useEffect, useRef } from "react";
import Nav from "../component/Nav";
import home from "../assets/home1.jpg";
import ExploreCourses from "../component/ExploreCourses";
import CardPage from "../component/CardPage";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import ReviewPage from "../component/ReviewPage";

const STATS = [
  { value: "50K+", label: "Students Enrolled", icon: "🎓" },
  { value: "1,200+", label: "Expert Courses", icon: "📚" },
  { value: "98%", label: "Satisfaction Rate", icon: "⭐" },
  { value: "24/7", label: "AI Support", icon: "🤖" },
];

const FEATURES = [
  {
    icon: "🎯",
    title: "Adaptive Learning Paths",
    desc: "AI builds a curriculum around your goals, strengths, and available time — no two paths are alike.",
  },
  {
    icon: "🏆",
    title: "Verified Certificates",
    desc: "Earn industry-recognized credentials that employers actually care about.",
  },
  {
    icon: "👨‍🏫",
    title: "World-Class Instructors",
    desc: "Learn directly from practitioners who've built real products at top companies.",
  },
  {
    icon: "⚡",
    title: "Learn at Your Pace",
    desc: "Bite-sized lessons and flexible scheduling designed for busy professionals.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallax = scrollY * 0.3;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .h-root { font-family: 'DM Sans', sans-serif; background: #07090f; color: #fff; overflow-x: hidden; }

        /* ── HERO ── */
        .h-hero {
          position: relative; min-height: 100vh;
          display: flex; flex-direction: column;
          overflow: hidden;
        }
        .h-hero-img {
          position: absolute; inset: 0; z-index: 0;
          will-change: transform;
        }
        .h-hero-img img {
          width: 100%; height: 100%; object-fit: cover;
          filter: brightness(.35) saturate(.8);
        }
        .h-hero-overlay {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(to bottom, rgba(7,9,15,.5) 0%, transparent 40%, rgba(7,9,15,.95) 100%),
            radial-gradient(ellipse 70% 60% at 60% 30%, rgba(16,185,129,.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 20% 80%, rgba(99,102,241,.1) 0%, transparent 60%);
        }
        .h-grid {
          position: absolute; inset: 0; z-index: 1; opacity: .03;
          background-image:
            linear-gradient(#fff 1px, transparent 1px),
            linear-gradient(90deg, #fff 1px, transparent 1px);
          background-size: 56px 56px;
        }

        /* Nav wrapper */
        .h-nav { position: relative; z-index: 10; }

        /* Hero body */
        .h-hero-body {
          position: relative; z-index: 5;
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 0 24px 80px;
          text-align: center;
          opacity: 0; transform: translateY(30px);
          transition: opacity .9s ease, transform .9s ease;
        }
        .h-hero-body.visible { opacity: 1; transform: translateY(0); }

        .h-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.25);
          padding: 6px 18px; border-radius: 100px; margin-bottom: 28px;
        }
        .h-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: pulse-dot 1.8s ease infinite; }
        .h-eyebrow span { font-size: 11px; font-weight: 600; color: #10b981; letter-spacing: 1.5px; text-transform: uppercase; }

        .h-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 7vw, 88px);
          font-weight: 700; line-height: 1.08;
          color: #fff; margin-bottom: 12px;
          max-width: 800px;
        }
        .h-headline em { color: #10b981; font-style: italic; }

        .h-subline {
          font-size: clamp(15px, 2vw, 19px);
          color: rgba(255,255,255,.45);
          max-width: 520px; line-height: 1.7;
          margin: 0 auto 44px; font-weight: 300;
        }

        /* CTA buttons */
        .h-ctas { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; margin-bottom: 72px; }

        .h-btn-primary {
          padding: 15px 34px; border-radius: 14px;
          background: #10b981; color: #07090f;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
          letter-spacing: .2px; position: relative; overflow: hidden;
          transition: background .25s, transform .15s, box-shadow .25s;
          display: flex; align-items: center; gap: 10px;
        }
        .h-btn-primary:hover { background: #0ea472; box-shadow: 0 12px 36px rgba(16,185,129,.35); transform: translateY(-2px); }
        .h-btn-primary .shine {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.2) 50%, transparent 60%);
          transform: translateX(-100%); transition: transform .6s ease;
        }
        .h-btn-primary:hover .shine { transform: translateX(100%); }

        .h-btn-secondary {
          padding: 15px 34px; border-radius: 14px;
          background: rgba(255,255,255,.06); color: #fff;
          border: 1.5px solid rgba(255,255,255,.15); cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          transition: background .25s, border-color .25s, transform .15s;
          display: flex; align-items: center; gap: 10px;
        }
        .h-btn-secondary:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.3); transform: translateY(-2px); }

        /* Stats row */
        .h-stats {
          display: flex; gap: 0; flex-wrap: wrap; justify-content: center;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 20px; overflow: hidden;
          background: rgba(255,255,255,.03);
          backdrop-filter: blur(20px);
          max-width: 760px; width: 100%;
        }
        .h-stat {
          flex: 1; min-width: 160px; padding: 24px 20px;
          text-align: center; border-right: 1px solid rgba(255,255,255,.07);
          transition: background .2s;
        }
        .h-stat:last-child { border-right: none; }
        .h-stat:hover { background: rgba(255,255,255,.04); }
        .h-stat-icon { font-size: 20px; margin-bottom: 6px; }
        .h-stat-val { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #fff; }
        .h-stat-lbl { font-size: 11px; color: rgba(255,255,255,.35); margin-top: 3px; }

        /* Scroll indicator */
        .h-scroll-hint {
          position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
          z-index: 5; display: flex; flex-direction: column; align-items: center; gap: 6px;
          opacity: .4;
          animation: bob 2s ease-in-out infinite;
        }
        .h-scroll-hint span { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #fff; }
        .h-scroll-mouse {
          width: 22px; height: 36px; border: 1.5px solid rgba(255,255,255,.5);
          border-radius: 100px; display: flex; justify-content: center; padding-top: 6px;
        }
        .h-scroll-wheel { width: 3px; height: 7px; background: #fff; border-radius: 100px; animation: wheel 1.6s ease infinite; }

        /* ── FEATURES SECTION ── */
        .h-features-section {
          background: #07090f; padding: 30px 24px;
          border-top: 1px solid rgba(255,255,255,.06);
        }
        .h-section-label {
          font-size: 11px; font-weight: 600; color: #10b981;
          letter-spacing: 2px; text-transform: uppercase; text-align: center;
          margin-bottom: 14px;
        }
        .h-section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 44px); font-weight: 700;
          color: #fff; text-align: center; line-height: 1.2;
          margin-bottom: 16px;
        }
        .h-section-title em { color: #10b981; font-style: italic; }
        .h-section-sub {
          font-size: 15px; color: rgba(255,255,255,.4);
          text-align: center; max-width: 480px; margin: 0 auto 36px;
          line-height: 1.7;
        }
        .h-features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px; max-width: 1080px; margin: 0 auto;
        }
        .h-feature-card {
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
          border-radius: 20px; padding: 32px 28px;
          transition: border-color .3s, transform .3s, background .3s;
        }
        .h-feature-card:hover {
          border-color: rgba(16,185,129,.25);
          background: rgba(16,185,129,.04);
          transform: translateY(-4px);
        }
        .h-feature-icon { font-size: 32px; margin-bottom: 16px; }
        .h-feature-title { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 10px; }
        .h-feature-desc { font-size: 13.5px; color: rgba(255,255,255,.4); line-height: 1.7; }

        /* ── COMPONENT SECTIONS ── */
        .h-component-section { background: #07090f; border-top: 1px solid rgba(255,255,255,.06); }
        .h-component-alt { background: #0a0d16; }

        /* ── CTA BANNER ── */
        .h-cta-banner {
          background: #07090f; padding: 80px 24px;
          border-top: 1px solid rgba(255,255,255,.06);
        }
        .h-cta-inner {
          max-width: 700px; margin: 0 auto; text-align: center;
          background: rgba(16,185,129,.06); border: 1px solid rgba(16,185,129,.18);
          border-radius: 28px; padding: 60px 40px;
          position: relative; overflow: hidden;
        }
        .h-cta-inner::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,.12), transparent 70%);
          pointer-events: none;
        }
        .h-cta-inner h2 {
          font-family: 'Playfair Display', serif; font-size: clamp(26px, 4vw, 40px);
          font-weight: 700; color: #fff; margin-bottom: 14px; position: relative;
        }
        .h-cta-inner p { font-size: 15px; color: rgba(255,255,255,.45); margin-bottom: 32px; line-height: 1.7; position: relative; }

        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
        @keyframes bob { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
        @keyframes wheel { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(10px); opacity: 0; } }
      `}</style>

      <div className="h-root">

        {/* ── HERO ── */}
        <div className="h-hero" ref={heroRef}>
          <div className="h-hero-img" style={{ transform: `translateY(${parallax}px)` }}>
            <img src={home} alt="EduNexa Hero" />
          </div>
          <div className="h-hero-overlay" />
          <div className="h-grid" />

          {/* Nav */}
          <div className="h-nav"><Nav /></div>

          {/* Body */}
          <div className={`h-hero-body${mounted ? " visible" : ""}`}>
            <div className="h-eyebrow">
              <div className="h-eyebrow-dot" />
              <span>AI-Powered Education Platform</span>
            </div>

            <h1 className="h-headline">
              Learn Without<br /><em>Limits.</em>
            </h1>

            <p className="h-subline">
              World-class courses, expert instructors, and an AI companion that adapts to the way you learn best.
            </p>

            <div className="h-ctas">
              <button className="h-btn-primary" onClick={() => navigate("/allcourses")}>
                <div className="shine" />
                <span style={{ position: "relative" }}>Explore Courses</span>
                <span style={{ position: "relative", fontSize: 18 }}>→</span>
              </button>
              <button className="h-btn-secondary" onClick={() => navigate("/search")}>
                <span>Search with AI</span>
                <span style={{ fontSize: 16 }}>✦</span>
              </button>
            </div>

            <div className="h-stats">
              {STATS.map(s => (
                <div className="h-stat" key={s.label}>
                  <div className="h-stat-icon">{s.icon}</div>
                  <div className="h-stat-val">{s.value}</div>
                  <div className="h-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-scroll-hint">
            <div className="h-scroll-mouse"><div className="h-scroll-wheel" /></div>
            <span>Scroll</span>
          </div>
        </div>

        {/* ── FEATURES ── */}
        <div className="h-features-section">
          <div className="h-section-label">Why EduNexa</div>
          <h2 className="h-section-title">Everything you need to<br /><em>level up.</em></h2>
          <p className="h-section-sub">Built for learners who are serious about growth — not just collecting certificates.</p>
          <div className="h-features-grid">
            {FEATURES.map(f => (
              <div className="h-feature-card" key={f.title}>
                <div className="h-feature-icon">{f.icon}</div>
                <div className="h-feature-title">{f.title}</div>
                <div className="h-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── COURSES ── */}
        <div className="h-component-section h-component-alt">
          <ExploreCourses />
        </div>

        {/* ── CARD PAGE ── */}
        <div className="h-component-section">
          <CardPage />
        </div>

        {/* ── REVIEWS ── */}
        <div className="h-component-section h-component-alt">
          <ReviewPage />
        </div>
        {/* ── FOOTER ── */}
        <Footer />
      </div>
    </>
  );
}