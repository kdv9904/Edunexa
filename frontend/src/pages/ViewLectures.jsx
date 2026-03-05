import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { FaPlayCircle, FaCheckCircle } from 'react-icons/fa';

const ViewLectures = () => {
  const { courseId } = useParams();
  const { creatorCourseData } = useSelector(state => state.course);
  const { userData } = useSelector(state => state.user);
  const selectedCourse = creatorCourseData?.find(c => c._id === courseId);
  const navigate = useNavigate();

  const [creatorData, setCreatorData]       = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [lectures, setLectures]             = useState([]);

  // ── Video completion tracking ──
  const [watchedLectures, setWatchedLectures] = useState(() => {
    try { const s = localStorage.getItem(`watched_${courseId}`); return s ? JSON.parse(s) : {}; }
    catch { return {}; }
  });
  const videoRef    = useRef(null);
  const watchedRef  = useRef(watchedLectures);

  const markWatched = (id) => {
    if (watchedRef.current[id]) return;
    const next = { ...watchedRef.current, [id]: true };
    watchedRef.current = next;
    setWatchedLectures(next);
    localStorage.setItem(`watched_${courseId}`, JSON.stringify(next));
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !selectedLecture) return;
    if (v.duration > 0 && v.currentTime / v.duration >= 0.9) markWatched(selectedLecture._id);
  };

  const completedCount = Object.values(watchedLectures).filter(Boolean).length;
  const totalLectures  = lectures.length;
  const progressPct    = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

  // ── Fetch lectures ──
  useEffect(() => {
    const fetch = async () => {
      if (!courseId) return;
      try {
        const res = await axios.get(`${serverUrl}/api/course/courselecture/${courseId}`, { withCredentials: true });
        if (res.data.lectures?.length > 0) {
          setLectures(res.data.lectures);
          setSelectedLecture(res.data.lectures[0]);
        }
      } catch (e) { console.log(e); }
    };
    fetch();
  }, [courseId]);

  // ── Fetch creator ──
  useEffect(() => {
    const fetch = async () => {
      const id = selectedCourse?.creator?._id || selectedCourse?.creator;
      if (!id) return;
      try {
        const res = await axios.post(`${serverUrl}/api/course/creator`, { userId: id }, { withCredentials: true });
        setCreatorData(res.data);
      } catch {}
    };
    if (selectedCourse) fetch();
  }, [selectedCourse]);

  if (!selectedCourse) return (
    <div style={{ minHeight: '100vh', background: '#07090f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, opacity: .2, marginBottom: 16 }}>📚</div>
        <h3 style={{ color: '#fff', fontSize: 20, marginBottom: 12 }}>Course Not Found</h3>
        <button onClick={() => navigate('/')} style={{ padding: '10px 24px', background: '#10b981', border: 'none', borderRadius: 10, color: '#07090f', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          Browse Courses
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .vl-root { min-height: 100vh; background: #07090f; font-family: 'DM Sans', sans-serif; position: relative; overflow-x: hidden; padding: 36px 24px 72px; }
        .vl-glow1 { position: fixed; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,.055) 0%, transparent 70%); top: -180px; right: -180px; pointer-events: none; z-index: 0; }
        .vl-glow2 { position: fixed; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,.05) 0%, transparent 70%); bottom: -120px; left: -120px; pointer-events: none; z-index: 0; }
        .vl-grid { position: fixed; inset: 0; opacity: .02; pointer-events: none; z-index: 0; background-image: linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px); background-size: 56px 56px; }
        .vl-inner { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }

        /* Back */
        .vl-back { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 8px 14px; color: rgba(255,255,255,.45); font-size: 12px; font-weight: 500; cursor: pointer; margin-bottom: 24px; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .vl-back:hover { color: #fff; background: rgba(255,255,255,.09); }

        /* Top strip */
        .vl-topstrip { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .vl-course-title { font-family: 'Playfair Display', serif; font-size: clamp(20px, 2.2vw, 26px); font-weight: 700; color: #fff; margin: 0; }
        .vl-course-title em { color: #10b981; font-style: italic; }
        .vl-badges { display: flex; gap: 8px; flex-wrap: wrap; }
        .vl-badge { font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 100px; letter-spacing: .5px; }
        .vl-badge-cat { background: rgba(99,102,241,.1); color: #818cf8; border: 1px solid rgba(99,102,241,.2); }
        .vl-badge-lvl { background: rgba(16,185,129,.1); color: #10b981; border: 1px solid rgba(16,185,129,.2); }

        /* Progress bar */
        .vl-progress-wrap { margin-bottom: 20px; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); border-radius: 12px; padding: 13px 18px; }
        .vl-progress-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .vl-progress-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.35); text-transform: uppercase; letter-spacing: .8px; }
        .vl-progress-pct { font-size: 12px; font-weight: 700; color: #10b981; }
        .vl-progress-track { height: 4px; background: rgba(255,255,255,.07); border-radius: 100px; overflow: hidden; }
        .vl-progress-fill { height: 100%; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 100px; transition: width .4s ease; }
        .vl-progress-sub { font-size: 11px; color: rgba(255,255,255,.22); margin-top: 7px; }

        /* Main layout */
        .vl-layout { display: grid; grid-template-columns: 1fr 340px; gap: 16px; align-items: start; }
        @media(max-width:900px){ .vl-layout { grid-template-columns: 1fr; } }

        /* Cards */
        .vl-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 18px; overflow: hidden; }
        .vl-card-body { padding: 22px; }

        /* Video */
        .vl-video-wrap { aspect-ratio: 16/9; background: #000; position: relative; }
        .vl-video-wrap video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .vl-video-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }

        /* Lecture info */
        .vl-lec-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 6px; }
        .vl-completed-pill { display: inline-flex; align-items: center; gap: 5px; background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.25); padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; color: #10b981; font-family: 'DM Sans', sans-serif; }

        /* Divider */
        .vl-divider { height: 1px; background: rgba(255,255,255,.06); margin: 20px 0; }

        /* Creator */
        .vl-creator { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .vl-creator-avatar { width: 48px; height: 48px; border-radius: 12px; object-fit: cover; border: 1px solid rgba(255,255,255,.1); flex-shrink: 0; }
        .vl-creator-placeholder { width: 48px; height: 48px; border-radius: 12px; background: rgba(16,185,129,.12); border: 1px solid rgba(16,185,129,.2); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #10b981; flex-shrink: 0; }
        .vl-creator-name { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
        .vl-creator-email { font-size: 11px; color: rgba(255,255,255,.3); }
        .vl-creator-desc { font-size: 13px; color: rgba(255,255,255,.4); line-height: 1.6; margin-top: 12px; }

        /* Sidebar */
        .vl-sidebar-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 18px; padding: 20px; position: sticky; top: 24px; }
        .vl-sidebar-title { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.3); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 6px; }
        .vl-sidebar-sub { font-size: 11px; color: rgba(255,255,255,.2); margin-bottom: 16px; }

        .vl-lec-list { display: flex; flex-direction: column; gap: 6px; max-height: 520px; overflow-y: auto; padding-right: 3px; }
        .vl-lec-list::-webkit-scrollbar { width: 3px; }
        .vl-lec-list::-webkit-scrollbar-thumb { background: rgba(16,185,129,.3); border-radius: 100px; }

        .vl-lec-btn { display: flex; align-items: center; gap: 10px; padding: 11px 13px; border-radius: 11px; border: 1px solid rgba(255,255,255,.06); background: rgba(255,255,255,.02); cursor: pointer; transition: all .17s; text-align: left; width: 100%; }
        .vl-lec-btn.active { border-color: rgba(16,185,129,.3); background: rgba(16,185,129,.07); }
        .vl-lec-btn:not(.active):hover { border-color: rgba(255,255,255,.12); background: rgba(255,255,255,.04); }

        .vl-lec-num { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; background: rgba(255,255,255,.06); color: rgba(255,255,255,.35); transition: all .17s; }
        .vl-lec-btn.active .vl-lec-num { background: rgba(16,185,129,.15); color: #10b981; }
        .vl-lec-btn-name { flex: 1; font-size: 12px; font-weight: 500; color: rgba(255,255,255,.55); line-height: 1.4; }
        .vl-lec-btn.active .vl-lec-btn-name { color: #fff; font-weight: 600; }

        /* Watched tick animation */
        .vl-tick { width: 20px; height: 20px; border-radius: 50%; background: rgba(16,185,129,.12); border: 1.5px solid rgba(16,185,129,.35); display: flex; align-items: center; justify-content: center; flex-shrink: 0; animation: tickPop .3s ease; }
        @keyframes tickPop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* Empty state */
        .vl-empty { text-align: center; padding: 40px 20px; }
        .vl-empty-icon { font-size: 32px; opacity: .2; margin-bottom: 10px; }
        .vl-empty-title { font-size: 14px; color: rgba(255,255,255,.25); }
        .vl-empty-sub { font-size: 12px; color: rgba(255,255,255,.15); margin-top: 4px; }
      `}</style>

      <div className="vl-root">
        <div className="vl-glow1" /><div className="vl-glow2" /><div className="vl-grid" />

        <div className="vl-inner">

          {/* Back */}
          <button className="vl-back" onClick={() => navigate('/')}>
            <FaArrowLeftLong size={11} /> Back to Home
          </button>

          {/* Top strip */}
          <div className="vl-topstrip">
            <h1 className="vl-course-title">
              {selectedCourse.title?.split(' ').slice(0, -1).join(' ') || selectedCourse.title}{' '}
              <em>{selectedCourse.title?.split(' ').slice(-1)[0]}</em>
            </h1>
            <div className="vl-badges">
              {selectedCourse.category && <span className="vl-badge vl-badge-cat">{selectedCourse.category}</span>}
              {selectedCourse.level    && <span className="vl-badge vl-badge-lvl">{selectedCourse.level}</span>}
            </div>
          </div>

          {/* Progress */}
          {totalLectures > 0 && (
            <div className="vl-progress-wrap">
              <div className="vl-progress-top">
                <span className="vl-progress-label">Your Progress</span>
                <span className="vl-progress-pct">{progressPct}%</span>
              </div>
              <div className="vl-progress-track">
                <div className="vl-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="vl-progress-sub">
                {completedCount} of {totalLectures} lectures completed
                {completedCount === totalLectures && totalLectures > 0 && ' 🎉 Course Complete!'}
              </div>
            </div>
          )}

          {/* Main layout */}
          <div className="vl-layout">

            {/* Left: video + info */}
            <div className="vl-card">
              {/* Video */}
              <div className="vl-video-wrap">
                {selectedLecture?.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={selectedLecture.videoUrl}
                    controls
                    autoPlay={false}
                    onTimeUpdate={handleTimeUpdate}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <div className="vl-video-placeholder">
                    <FaPlayCircle size={52} color="rgba(255,255,255,.12)" />
                    <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                      {lectures.length > 0 ? 'Video being prepared' : 'No lectures available'}
                    </p>
                  </div>
                )}
              </div>

              <div className="vl-card-body">
                {/* Lecture title + completed badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                  <h2 className="vl-lec-title">
                    {selectedLecture?.lectureTitle || 'Select a lecture'}
                  </h2>
                  {selectedLecture && watchedLectures[selectedLecture._id] && (
                    <div className="vl-completed-pill">
                      <FaCheckCircle size={10} /> Completed
                    </div>
                  )}
                </div>

                <div className="vl-divider" />

                {/* Creator */}
                <div className="vl-creator">
                  {creatorData?.photoUrl ? (
                    <img src={creatorData.photoUrl} alt={creatorData.name} className="vl-creator-avatar" />
                  ) : (
                    <div className="vl-creator-placeholder">
                      {creatorData?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <div className="vl-creator-name">{creatorData?.name || 'Instructor'}</div>
                    {creatorData?.email && <div className="vl-creator-email">{creatorData.email}</div>}
                  </div>
                </div>

                {(creatorData?.description || selectedCourse?.description) && (
                  <div className="vl-creator-desc">
                    {creatorData?.description || selectedCourse?.description}
                  </div>
                )}
              </div>
            </div>

            {/* Right: lecture list */}
            <div className="vl-sidebar-card">
              <div className="vl-sidebar-title">Course Lectures</div>
              <div className="vl-sidebar-sub">{totalLectures} lecture{totalLectures !== 1 ? 's' : ''}</div>

              {lectures.length > 0 ? (
                <div className="vl-lec-list">
                  {lectures.map((lec, i) => {
                    const isActive  = selectedLecture?._id === lec._id;
                    const isWatched = watchedLectures[lec._id];
                    return (
                      <button
                        key={lec._id || i}
                        className={`vl-lec-btn${isActive ? ' active' : ''}`}
                        onClick={() => setSelectedLecture(lec)}
                      >
                        <div className="vl-lec-num">{i + 1}</div>
                        <span className="vl-lec-btn-name">{lec.lectureTitle}</span>
                        {isWatched && (
                          <div className="vl-tick">
                            <FaCheckCircle size={11} color="#10b981" />
                          </div>
                        )}
                        {!isWatched && (
                          <FaPlayCircle size={13} color={isActive ? '#10b981' : 'rgba(255,255,255,.2)'} />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="vl-empty">
                  <div className="vl-empty-icon">📹</div>
                  <div className="vl-empty-title">No lectures yet</div>
                  <div className="vl-empty-sub">Check back later</div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ViewLectures;