import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaBook, FaEnvelope, FaUser } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';

const Profile = () => {
  const { userData } = useSelector(state => state.user);
  const navigate = useNavigate();

  const enrolled = userData?.user?.enrolledCourses?.length || 0;
  const level    = Math.floor(enrolled / 3) + 1;
  const progress = (enrolled % 3) * 33.33;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .pf-root {
          min-height: 100vh;
          background: #07090f;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 24px;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
        }

        /* Background glows */
        .pf-glow1 {
          position: absolute; width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,.07) 0%, transparent 70%);
          top: -100px; right: -100px; pointer-events: none;
        }
        .pf-glow2 {
          position: absolute; width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,.07) 0%, transparent 70%);
          bottom: -80px; left: -80px; pointer-events: none;
        }
        .pf-grid {
          position: absolute; inset: 0; opacity: .025; pointer-events: none;
          background-image: linear-gradient(#fff 1px,transparent 1px), linear-gradient(90deg,#fff 1px,transparent 1px);
          background-size: 56px 56px;
        }

        /* Card */
        .pf-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 680px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 24px; overflow: hidden;
        }

        /* Back button */
        .pf-back {
          position: absolute; top: -48px; left: 0;
          display: flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,.4); font-size: 13px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          transition: color .2s;
          padding: 0;
        }
        .pf-back:hover { color: #fff; }
        .pf-back svg { font-size: 12px; }

        /* Header band */
        .pf-header {
          height: 120px; position: relative; overflow: hidden;
          background: linear-gradient(135deg, rgba(16,185,129,.12) 0%, rgba(99,102,241,.1) 100%);
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .pf-header-dot1 {
          position: absolute; width: 180px; height: 180px; border-radius: 50%;
          background: rgba(16,185,129,.1); top: -60px; right: -40px; filter: blur(40px);
        }
        .pf-header-dot2 {
          position: absolute; width: 140px; height: 140px; border-radius: 50%;
          background: rgba(99,102,241,.1); bottom: -50px; left: -30px; filter: blur(40px);
        }

        /* Body */
        .pf-body { padding: 0 32px 36px; }

        /* Avatar row */
        .pf-avatar-row {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-top: -44px; margin-bottom: 20px;
        }
        .pf-avatar-wrap { position: relative; }
        .pf-avatar {
          width: 88px; height: 88px; border-radius: 20px;
          border: 3px solid #07090f;
          object-fit: cover;
          background: linear-gradient(135deg, #10b981, #6366f1);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 32px; font-weight: 700; color: #fff;
          overflow: hidden;
        }
        .pf-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .pf-level-badge {
          position: absolute; bottom: -4px; right: -4px;
          width: 26px; height: 26px; border-radius: 50%;
          background: #f59e0b; border: 2px solid #07090f;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: #07090f;
        }
        .pf-edit-btn {
          padding: 9px 20px; border-radius: 10px;
          background: rgba(255,255,255,.05); border: 1.5px solid rgba(255,255,255,.1);
          color: rgba(255,255,255,.6); font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; gap: 7px;
          transition: all .2s; margin-bottom: 4px;
        }
        .pf-edit-btn:hover { border-color: #10b981; color: #10b981; background: rgba(16,185,129,.07); }

        /* Name block */
        .pf-name {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 700; color: #fff;
          margin: 0 0 6px; line-height: 1.2;
        }
        .pf-role-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.2);
          padding: 4px 12px; border-radius: 100px;
          font-size: 11px; font-weight: 600; color: #10b981;
          text-transform: capitalize; letter-spacing: .5px; margin-bottom: 16px;
        }
        .pf-role-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; }

        /* Level progress */
        .pf-progress-wrap { margin-bottom: 28px; }
        .pf-progress-labels {
          display: flex; justify-content: space-between;
          font-size: 11px; color: rgba(255,255,255,.3); margin-bottom: 6px;
        }
        .pf-progress-bar {
          height: 4px; background: rgba(255,255,255,.07); border-radius: 100px; overflow: hidden;
        }
        .pf-progress-fill {
          height: 100%; background: linear-gradient(90deg, #10b981, #6366f1);
          border-radius: 100px; transition: width 1s ease;
        }

        /* Divider */
        .pf-divider { height: 1px; background: rgba(255,255,255,.06); margin-bottom: 24px; }

        /* Info grid */
        .pf-grid-cards {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;
        }
        @media (max-width: 540px) { .pf-grid-cards { grid-template-columns: 1fr; } }

        .pf-info-card {
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px; padding: 16px 18px;
          display: flex; align-items: center; gap: 12px;
          transition: border-color .2s;
        }
        .pf-info-card:hover { border-color: rgba(16,185,129,.2); }
        .pf-info-icon {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 14px; color: #fff;
        }
        .pf-info-label { font-size: 10px; color: rgba(255,255,255,.3); text-transform: uppercase; letter-spacing: .8px; margin-bottom: 3px; }
        .pf-info-value { font-size: 13.5px; font-weight: 600; color: #fff; word-break: break-all; }
        .pf-info-value-big { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #fff; }

        /* Description card */
        .pf-desc-card {
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px; padding: 18px 20px;
          transition: border-color .2s;
        }
        .pf-desc-card:hover { border-color: rgba(99,102,241,.2); }
        .pf-desc-label { font-size: 10px; color: rgba(255,255,255,.3); text-transform: uppercase; letter-spacing: .8px; margin-bottom: 8px; }
        .pf-desc-text { font-size: 13.5px; color: rgba(255,255,255,.5); line-height: 1.7; }
      `}</style>

      <div className="pf-root">
        <div className="pf-glow1" />
        <div className="pf-glow2" />
        <div className="pf-grid" />

        <div style={{ position: "relative", width: "100%", maxWidth: 680 }}>

          {/* Back button */}
          <button className="pf-back" onClick={() => navigate("/")}>
            <FaArrowLeftLong /> Back to Home
          </button>

          <div className="pf-card">

            {/* Header band */}
            <div className="pf-header">
              <div className="pf-header-dot1" />
              <div className="pf-header-dot2" />
            </div>

            {/* Body */}
            <div className="pf-body">

              {/* Avatar row */}
              <div className="pf-avatar-row">
                <div className="pf-avatar-wrap">
                  <div className="pf-avatar">
                    {userData?.user?.photoUrl
                      ? <img src={userData.user.photoUrl} alt="avatar" />
                      : (userData?.user?.name?.charAt(0).toUpperCase() || "?")
                    }
                  </div>
                  <div className="pf-level-badge">{level}</div>
                </div>
                <button className="pf-edit-btn" onClick={() => navigate('/editprofile')}>
                  <FaEdit size={12} /> Edit Profile
                </button>
              </div>

              {/* Name + role */}
              <div className="pf-name">{userData?.user?.name || "Anonymous User"}</div>
              <div className="pf-role-pill">
                <div className="pf-role-dot" />
                {userData?.user?.role || "Explorer"}
              </div>

              {/* Level progress */}
              <div className="pf-progress-wrap">
                <div className="pf-progress-labels">
                  <span>Level {level}</span>
                  <span>{progress.toFixed(0)}% to Level {level + 1}</span>
                </div>
                <div className="pf-progress-bar">
                  <div className="pf-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="pf-divider" />

              {/* Info cards */}
              <div className="pf-grid-cards">
                <div className="pf-info-card">
                  <div className="pf-info-icon" style={{ background: "rgba(16,185,129,.15)" }}>
                    <FaEnvelope color="#10b981" />
                  </div>
                  <div>
                    <div className="pf-info-label">Email</div>
                    <div className="pf-info-value">{userData?.user?.email || "—"}</div>
                  </div>
                </div>

                <div className="pf-info-card">
                  <div className="pf-info-icon" style={{ background: "rgba(99,102,241,.15)" }}>
                    <FaBook color="#6366f1" />
                  </div>
                  <div>
                    <div className="pf-info-label">Enrolled Courses</div>
                    <div className="pf-info-value-big">{enrolled}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pf-desc-card">
                <div className="pf-desc-label">About</div>
                <div className="pf-desc-text">
                  {userData?.user?.description || "Your story is waiting to be written. Edit your profile to add a bio."}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;