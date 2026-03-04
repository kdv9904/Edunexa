import React, { useState } from 'react';
import { 
  TbDeviceDesktopAnalytics 
} from 'react-icons/tb';
import { 
  FaMobileAlt, FaDatabase, FaRobot, FaPaintBrush,
  FaChartLine, FaShieldAlt, FaCloud, FaGamepad,
  FaVideo, FaMusic, FaBullhorn
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 'web',       icon: <TbDeviceDesktopAnalytics />, title: "Web Development",     desc: "Full-stack development courses",          courses: 125, accent: "#3b82f6" },
  { id: 'mobile',    icon: <FaMobileAlt />,              title: "Mobile Development",   desc: "iOS & Android app development",           courses: 89,  accent: "#10b981" },
  { id: 'ai',        icon: <FaRobot />,                  title: "AI & Machine Learning",desc: "AI algorithms and ML models",             courses: 67,  accent: "#8b5cf6" },
  { id: 'data',      icon: <FaDatabase />,               title: "Data Science",         desc: "Data analysis and visualization",         courses: 94,  accent: "#f59e0b" },
  { id: 'design',    icon: <FaPaintBrush />,             title: "UI/UX Design",         desc: "User interface and experience design",    courses: 78,  accent: "#ec4899" },
  { id: 'business',  icon: <FaChartLine />,              title: "Business Analytics",   desc: "Data-driven business decisions",          courses: 56,  accent: "#6366f1" },
  { id: 'cyber',     icon: <FaShieldAlt />,              title: "Cyber Security",       desc: "Network security & ethical hacking",      courses: 45,  accent: "#ef4444" },
  { id: 'cloud',     icon: <FaCloud />,                  title: "Cloud Computing",      desc: "AWS, Azure, and Google Cloud",            courses: 72,  accent: "#14b8a6" },
  { id: 'game',      icon: <FaGamepad />,                title: "Game Development",     desc: "2D/3D game design and development",       courses: 38,  accent: "#f97316" },
  { id: 'video',     icon: <FaVideo />,                  title: "Video Editing",        desc: "Professional video production",           courses: 41,  accent: "#a855f7" },
];

const FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'web',      label: 'Web' },
  { id: 'ai',       label: 'AI & ML' },
  { id: 'data',     label: 'Data' },
  { id: 'design',   label: 'Design' },
  { id: 'business', label: 'Business' },
  { id: 'cyber',    label: 'Security' },
  { id: 'cloud',    label: 'Cloud' },
];

export default function ExploreCourses() {
  const [active, setActive] = useState('all');
  const navigate = useNavigate();

  const visible = active === 'all'
    ? CATEGORIES
    : CATEGORIES.filter(c => c.id === active);

  return (
    <>
      <style>{`
        .ec-root {
          background: #07090f;
          padding: 30px 24px;
          font-family: 'DM Sans', sans-serif;
        }
        .ec-inner { max-width: 1160px; margin: 0 auto; }

        /* Header row */
        .ec-header {
          display: flex; flex-direction: column;
          align-items: flex-start; gap: 32px;
          margin-bottom: 48px;
        }
        @media (min-width: 900px) {
          .ec-header { flex-direction: row; align-items: flex-end; justify-content: space-between; }
        }
        .ec-eyebrow {
          font-size: 11px; font-weight: 600; color: #10b981;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;
        }
        .ec-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 44px); font-weight: 700;
          color: #fff; line-height: 1.15; margin-bottom: 14px;
        }
        .ec-title em { color: #10b981; font-style: italic; }
        .ec-sub { font-size: 14px; color: rgba(255,255,255,.4); line-height: 1.7; max-width: 420px; }

        .ec-cta-btn {
          flex-shrink: 0;
          padding: 13px 28px; border-radius: 12px;
          background: #10b981; color: #07090f;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          display: flex; align-items: center; gap: 8px;
          transition: background .2s, transform .15s, box-shadow .2s;
          white-space: nowrap;
        }
        .ec-cta-btn:hover { background: #0ea472; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(16,185,129,.3); }

        /* Filter tabs */
        .ec-filters {
          display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 36px;
        }
        .ec-filter {
          padding: 7px 18px; border-radius: 100px;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.45); font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all .2s;
        }
        .ec-filter:hover { border-color: rgba(255,255,255,.2); color: rgba(255,255,255,.8); }
        .ec-filter.active {
          background: #10b981; border-color: #10b981;
          color: #07090f; font-weight: 700;
        }

        /* Grid */
        .ec-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

        /* Card */
        .ec-card {
          position: relative;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 18px; padding: 26px 22px;
          cursor: pointer;
          transition: border-color .3s, transform .3s, background .3s;
          overflow: hidden;
        }
        .ec-card::before {
          content: '';
          position: absolute; inset: 0; border-radius: 18px;
          background: var(--accent-color);
          opacity: 0; transition: opacity .3s;
        }
        .ec-card:hover { transform: translateY(-5px); border-color: var(--accent-color); }
        .ec-card:hover::before { opacity: .05; }

        .ec-card-icon {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; color: #fff; margin-bottom: 16px;
          background: var(--accent-color);
          opacity: .9;
          transition: transform .3s;
        }
        .ec-card:hover .ec-card-icon { transform: scale(1.1); }

        .ec-card-title {
          font-size: 14px; font-weight: 700; color: #fff;
          margin-bottom: 6px; line-height: 1.3;
        }
        .ec-card-desc {
          font-size: 12px; color: rgba(255,255,255,.35);
          line-height: 1.6; margin-bottom: 16px;
        }
        .ec-card-footer {
          display: flex; align-items: center; justify-content: space-between;
        }
        .ec-card-count {
          font-size: 11px; font-weight: 600;
          color: var(--accent-color);
          background: rgba(255,255,255,.06);
          padding: 3px 10px; border-radius: 100px;
        }
        .ec-card-arrow {
          width: 26px; height: 26px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,.1);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,.3); font-size: 11px;
          transition: all .2s;
        }
        .ec-card:hover .ec-card-arrow {
          border-color: var(--accent-color);
          color: var(--accent-color);
          background: rgba(255,255,255,.04);
        }

        /* Bottom strip */
        .ec-bottom {
          margin-top: 48px; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 14px;
        }
        .ec-count-line { font-size: 13px; color: rgba(255,255,255,.3); }
        .ec-count-line strong { color: rgba(255,255,255,.6); }
        .ec-view-all {
          padding: 11px 28px; border-radius: 12px;
          background: transparent; border: 1.5px solid rgba(255,255,255,.12);
          color: rgba(255,255,255,.6); font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: border-color .2s, color .2s, background .2s;
        }
        .ec-view-all:hover { border-color: #10b981; color: #10b981; background: rgba(16,185,129,.05); }
      `}</style>

      <div className="ec-root">
        <div className="ec-inner">

          {/* Header */}
          <div className="ec-header">
            <div>
              <div className="ec-eyebrow">Explore Categories</div>
              <h2 className="ec-title">Find your next<br /><em>skill to master.</em></h2>
              <p className="ec-sub">1,200+ courses across 12 domains — from code to creativity, taught by real practitioners.</p>
            </div>
            <button className="ec-cta-btn" onClick={() => navigate("/allcourses")}>
              Browse All Courses <span style={{ fontSize: 16 }}>→</span>
            </button>
          </div>

          {/* Filters */}
          <div className="ec-filters">
            {FILTERS.map(f => (
              <button
                key={f.id}
                className={`ec-filter${active === f.id ? ' active' : ''}`}
                onClick={() => setActive(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="ec-grid">
            {visible.map(c => (
              <div
                key={c.id}
                className="ec-card"
                style={{ '--accent-color': c.accent }}
                onClick={() => navigate("/allcourses")}
              >
                <div className="ec-card-icon" style={{ background: c.accent }}>{c.icon}</div>
                <div className="ec-card-title">{c.title}</div>
                <div className="ec-card-desc">{c.desc}</div>
                <div className="ec-card-footer">
                  <span className="ec-card-count">{c.courses} courses</span>
                  <div className="ec-card-arrow">→</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="ec-bottom">
            <p className="ec-count-line">Showing <strong>{visible.length}</strong> of <strong>{CATEGORIES.length}</strong> categories</p>
            <button className="ec-view-all" onClick={() => navigate("/allcourses")}>
              View All Categories
            </button>
          </div>

        </div>
      </div>
    </>
  );
}