import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { FaPlayCircle, FaCheckCircle, FaBrain, FaTimes } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const ViewLectures = () => {
  const { courseId } = useParams();
  const { creatorCourseData } = useSelector(state => state.course);
  const { userData } = useSelector(state => state.user);
  const selectedCourse = creatorCourseData?.find(c => c._id === courseId);
  const navigate = useNavigate();

  const [creatorData, setCreatorData]           = useState(null);
  const [selectedLecture, setSelectedLecture]   = useState(null);
  const [lectures, setLectures]                 = useState([]);

  // ── Video completion tracking ──
  const [watchedLectures, setWatchedLectures] = useState(() => {
    try { const s = localStorage.getItem(`watched_${courseId}`); return s ? JSON.parse(s) : {}; }
    catch { return {}; }
  });
  // Tracks lectures where video was watched but quiz was skipped — show quiz button
  const [quizPending, setQuizPending] = useState(() => {
    try { const s = localStorage.getItem(`quizpending_${courseId}`); return s ? JSON.parse(s) : {}; }
    catch { return {}; }
  });
  const videoRef   = useRef(null);
  const watchedRef = useRef(watchedLectures);

  // ── AI Quiz state ──
  const [quizState, setQuizState]         = useState('idle'); // idle | loading | active | passed | dismissed
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers]     = useState({});    // { qIndex: optionIndex }
  const [quizResult, setQuizResult]       = useState(null);  // { score, total, passed }
  const [quizLectureId, setQuizLectureId] = useState(null);  // which lecture triggered quiz

  // ── Mark watched + trigger quiz ──
  const triggerQuiz = async (lectureId, lectureTitle) => {
    setQuizLectureId(lectureId);
    setQuizState('loading');
    setQuizAnswers({});
    setQuizResult(null);

    try {
      const res = await axios.post(
        `${serverUrl}/api/quiz/generate`,
        { lectureTitle, courseCategory: selectedCourse?.category },
        { withCredentials: true }
      );
      console.log('✅ Quiz response:', res.data);
      setQuizQuestions(res.data.questions || []);
      setQuizState('active');
    } catch (err) {
      console.error('❌ Quiz generation failed:', err.response?.data || err.message);
      confirmComplete(lectureId);
      setQuizState('idle');
    }
  };

  const markWatched = async (lectureId, lectureTitle) => {
    if (watchedRef.current[lectureId]) return; // already fully completed
    console.log('🎬 markWatched triggered for:', lectureTitle, '| quizState:', quizState);
    if (quizState !== 'idle') return; // already showing quiz

    // Save pending so user can retake quiz even if they leave
    const pendingNext = { ...quizPending, [lectureId]: lectureTitle };
    setQuizPending(pendingNext);
    localStorage.setItem(`quizpending_${courseId}`, JSON.stringify(pendingNext));

    triggerQuiz(lectureId, lectureTitle);
  };

  const confirmComplete = (lectureId) => {
    const next = { ...watchedRef.current, [lectureId]: true };
    watchedRef.current = next;
    setWatchedLectures(next);
    localStorage.setItem(`watched_${courseId}`, JSON.stringify(next));
    // Remove from pending
    const pendingNext = { ...quizPending };
    delete pendingNext[lectureId];
    setQuizPending(pendingNext);
    localStorage.setItem(`quizpending_${courseId}`, JSON.stringify(pendingNext));
  };

  const handleSubmitQuiz = () => {
    const total  = quizQuestions.length;
    const score  = quizQuestions.reduce((acc, q, i) => {
      return acc + (quizAnswers[i] === q.correctIndex ? 1 : 0);
    }, 0);
    const passed = score >= Math.ceil(total * 0.6); // 60% to pass

    setQuizResult({ score, total, passed });

    if (passed) {
      confirmComplete(quizLectureId);
      setQuizState('passed');
    }
  };

  const handleDismissQuiz = () => {
    setQuizState('idle');
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizResult(null);
    setQuizLectureId(null);
  };

  const handleRetryQuiz = () => {
    setQuizAnswers({});
    setQuizResult(null);
    setQuizState('active');
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !selectedLecture) return;
    if (v.duration > 0 && v.currentTime / v.duration >= 0.9) {
      markWatched(selectedLecture._id, selectedLecture.lectureTitle);
    }
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

  // Reset quiz when lecture changes
  useEffect(() => {
    if (quizState === 'active' || quizState === 'loading') handleDismissQuiz();
  }, [selectedLecture?._id]);

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

  const allAnswered = quizQuestions.length > 0 && quizQuestions.every((_, i) => quizAnswers[i] !== undefined);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .vl-root { min-height: 100vh; background: #07090f; font-family: 'DM Sans', sans-serif; position: relative; overflow-x: hidden; padding: 36px 24px 80px; }
        .vl-glow1 { position: fixed; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,.055) 0%, transparent 70%); top: -180px; right: -180px; pointer-events: none; z-index: 0; }
        .vl-glow2 { position: fixed; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,.05) 0%, transparent 70%); bottom: -120px; left: -120px; pointer-events: none; z-index: 0; }
        .vl-grid { position: fixed; inset: 0; opacity: .02; pointer-events: none; z-index: 0; background-image: linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px); background-size: 56px 56px; }
        .vl-inner { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }

        .vl-back { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 8px 14px; color: rgba(255,255,255,.45); font-size: 12px; font-weight: 500; cursor: pointer; margin-bottom: 24px; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .vl-back:hover { color: #fff; background: rgba(255,255,255,.09); }

        .vl-topstrip { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .vl-course-title { font-family: 'Playfair Display', serif; font-size: clamp(20px, 2.2vw, 26px); font-weight: 700; color: #fff; margin: 0; }
        .vl-course-title em { color: #10b981; font-style: italic; }
        .vl-badges { display: flex; gap: 8px; flex-wrap: wrap; }
        .vl-badge { font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 100px; letter-spacing: .5px; }
        .vl-badge-cat { background: rgba(99,102,241,.1); color: #818cf8; border: 1px solid rgba(99,102,241,.2); }
        .vl-badge-lvl { background: rgba(16,185,129,.1); color: #10b981; border: 1px solid rgba(16,185,129,.2); }

        .vl-progress-wrap { margin-bottom: 20px; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); border-radius: 12px; padding: 13px 18px; }
        .vl-progress-top { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .vl-progress-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.35); text-transform: uppercase; letter-spacing: .8px; }
        .vl-progress-pct { font-size: 12px; font-weight: 700; color: #10b981; }
        .vl-progress-track { height: 4px; background: rgba(255,255,255,.07); border-radius: 100px; overflow: hidden; }
        .vl-progress-fill { height: 100%; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 100px; transition: width .4s ease; }
        .vl-progress-sub { font-size: 11px; color: rgba(255,255,255,.22); margin-top: 7px; }

        .vl-layout { display: grid; grid-template-columns: 1fr 320px; gap: 16px; align-items: start; }
        @media(max-width:880px){ .vl-layout { grid-template-columns: 1fr; } }

        .vl-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 18px; overflow: hidden; }
        .vl-card-body { padding: 22px; }

        .vl-video-wrap { aspect-ratio: 16/9; background: #000; position: relative; }
        .vl-video-wrap video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .vl-video-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }

        .vl-lec-title { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 700; color: #fff; margin: 0; }
        .vl-completed-pill { display: inline-flex; align-items: center; gap: 5px; background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.25); padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; color: #10b981; }
        .vl-divider { height: 1px; background: rgba(255,255,255,.06); margin: 18px 0; }

        .vl-creator { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .vl-creator-avatar { width: 46px; height: 46px; border-radius: 11px; object-fit: cover; border: 1px solid rgba(255,255,255,.1); flex-shrink: 0; }
        .vl-creator-placeholder { width: 46px; height: 46px; border-radius: 11px; background: rgba(16,185,129,.12); border: 1px solid rgba(16,185,129,.2); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: #10b981; flex-shrink: 0; }
        .vl-creator-name { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px; }
        .vl-creator-email { font-size: 11px; color: rgba(255,255,255,.3); }
        .vl-creator-desc { font-size: 13px; color: rgba(255,255,255,.38); line-height: 1.6; margin-top: 12px; }

        /* ── AI QUIZ PANEL ── */
        .vl-quiz-panel {
          margin: 0 22px 22px;
          border-radius: 16px;
          border: 1px solid rgba(16,185,129,.2);
          background: rgba(16,185,129,.04);
          overflow: hidden;
          animation: quizSlide .35s ease;
        }
        @keyframes quizSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .vl-quiz-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid rgba(16,185,129,.12); }
        .vl-quiz-header-left { display: flex; align-items: center; gap: 10px; }
        .vl-quiz-icon { width: 32px; height: 32px; border-radius: 9px; background: rgba(16,185,129,.15); border: 1px solid rgba(16,185,129,.25); display: flex; align-items: center; justify-content: center; }
        .vl-quiz-title { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #fff; }
        .vl-quiz-subtitle { font-size: 11px; color: rgba(255,255,255,.35); margin-top: 1px; }
        .vl-quiz-dismiss { width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(255,255,255,.4); transition: all .2s; }
        .vl-quiz-dismiss:hover { background: rgba(239,68,68,.1); border-color: rgba(239,68,68,.2); color: #ef4444; }

        .vl-quiz-body { padding: 20px; }

        /* Loading */
        .vl-quiz-loading { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 32px; }
        .vl-quiz-loading-text { font-size: 13px; color: rgba(255,255,255,.4); font-family: 'DM Sans', sans-serif; }

        /* Questions */
        .vl-q-item { margin-bottom: 20px; }
        .vl-q-item:last-child { margin-bottom: 0; }
        .vl-q-text { font-size: 13px; font-weight: 600; color: rgba(255,255,255,.85); margin-bottom: 10px; line-height: 1.5; }
        .vl-q-num { font-size: 10px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: .8px; margin-bottom: 4px; }
        .vl-options { display: flex; flex-direction: column; gap: 6px; }
        .vl-option {
          padding: 10px 14px; border-radius: 9px;
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.55); font-size: 12px; font-weight: 500;
          cursor: pointer; text-align: left; font-family: 'DM Sans', sans-serif;
          transition: all .15s; display: flex; align-items: center; gap: 10px;
        }
        .vl-option:hover { background: rgba(255,255,255,.07); color: #fff; border-color: rgba(255,255,255,.15); }
        .vl-option.selected { background: rgba(99,102,241,.12); border-color: rgba(99,102,241,.3); color: #a5b4fc; }
        .vl-option.correct { background: rgba(16,185,129,.12); border-color: rgba(16,185,129,.3); color: #10b981; }
        .vl-option.wrong { background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.2); color: rgba(239,68,68,.7); }
        .vl-option-dot { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid currentColor; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 8px; }

        /* Result */
        .vl-quiz-result { text-align: center; padding: 24px; }
        .vl-result-icon { font-size: 44px; margin-bottom: 12px; }
        .vl-result-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 6px; }
        .vl-result-score { font-size: 13px; color: rgba(255,255,255,.4); margin-bottom: 20px; }
        .vl-result-score strong { color: #fff; }
        .vl-result-btns { display: flex; gap: 10px; justify-content: center; }

        /* Quiz footer */
        .vl-quiz-footer { padding: 0 20px 20px; }
        .vl-quiz-submit { width: 100%; padding: 11px; border-radius: 10px; background: #10b981; border: none; color: #07090f; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .2s; }
        .vl-quiz-submit:hover:not(:disabled) { background: #0ea472; }
        .vl-quiz-submit:disabled { background: rgba(255,255,255,.07); color: rgba(255,255,255,.25); cursor: not-allowed; }

        /* Sidebar */
        .vl-sidebar-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 18px; padding: 20px; position: sticky; top: 24px; }
        .vl-sidebar-title { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.3); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 5px; }
        .vl-sidebar-sub { font-size: 11px; color: rgba(255,255,255,.2); margin-bottom: 16px; }

        .vl-lec-list { display: flex; flex-direction: column; gap: 6px; max-height: 520px; overflow-y: auto; padding-right: 3px; }
        .vl-lec-list::-webkit-scrollbar { width: 3px; }
        .vl-lec-list::-webkit-scrollbar-thumb { background: rgba(16,185,129,.3); border-radius: 100px; }

        .vl-lec-btn { display: flex; align-items: center; gap: 10px; padding: 11px 13px; border-radius: 11px; border: 1px solid rgba(255,255,255,.06); background: rgba(255,255,255,.02); cursor: pointer; transition: all .17s; text-align: left; width: 100%; }
        .vl-lec-btn.active { border-color: rgba(16,185,129,.3); background: rgba(16,185,129,.07); }
        .vl-lec-btn:not(.active):hover { border-color: rgba(255,255,255,.12); background: rgba(255,255,255,.04); }
        .vl-lec-num { width: 27px; height: 27px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; background: rgba(255,255,255,.06); color: rgba(255,255,255,.35); }
        .vl-lec-btn.active .vl-lec-num { background: rgba(16,185,129,.15); color: #10b981; }
        .vl-lec-btn-name { flex: 1; font-size: 12px; font-weight: 500; color: rgba(255,255,255,.5); line-height: 1.4; }
        .vl-lec-btn.active .vl-lec-btn-name { color: #fff; font-weight: 600; }

        .vl-tick { width: 20px; height: 20px; border-radius: 50%; background: rgba(16,185,129,.12); border: 1.5px solid rgba(16,185,129,.35); display: flex; align-items: center; justify-content: center; flex-shrink: 0; animation: tickPop .3s ease; }
        @keyframes tickPop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .vl-empty { text-align: center; padding: 36px 20px; }
        .vl-empty-icon { font-size: 30px; opacity: .2; margin-bottom: 10px; }
        .vl-empty-title { font-size: 13px; color: rgba(255,255,255,.25); }

        /* Btn styles */
        .vl-btn-ghost { padding: 9px 20px; border-radius: 9px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.55); font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .vl-btn-ghost:hover { background: rgba(255,255,255,.1); color: #fff; }
        .vl-btn-primary { padding: 9px 20px; border-radius: 9px; background: #10b981; border: none; color: #07090f; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .2s; }
        .vl-btn-primary:hover { background: #0ea472; }
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

            {/* Left: video + quiz + info */}
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

              {/* ── AI QUIZ PANEL ── */}
              {(quizState === 'loading' || quizState === 'active' || quizState === 'passed') && (
                <div className="vl-quiz-panel">

                  {/* Header */}
                  <div className="vl-quiz-header">
                    <div className="vl-quiz-header-left">
                      <div className="vl-quiz-icon">
                        <FaBrain size={14} color="#10b981" />
                      </div>
                      <div>
                        <div className="vl-quiz-title">Knowledge Check</div>
                        <div className="vl-quiz-subtitle">
                          {quizState === 'loading' ? 'Generating questions...' :
                           quizState === 'passed'  ? 'Lecture completed!' :
                           `${quizQuestions.length} questions • Score 60% to complete`}
                        </div>
                      </div>
                    </div>
                    <button className="vl-quiz-dismiss" onClick={handleDismissQuiz} title="Skip quiz">
                      <FaTimes size={11} />
                    </button>
                  </div>

                  {/* Loading */}
                  {quizState === 'loading' && (
                    <div className="vl-quiz-loading">
                      <ClipLoader size={28} color="#10b981" />
                      <div className="vl-quiz-loading-text">
                        AI is generating questions for <strong style={{ color: '#fff' }}>"{selectedLecture?.lectureTitle}"</strong>...
                      </div>
                    </div>
                  )}

                  {/* Passed result */}
                  {quizState === 'passed' && quizResult && (
                    <div className="vl-quiz-result">
                      <div className="vl-result-icon">🎉</div>
                      <div className="vl-result-title">Lecture Completed!</div>
                      <div className="vl-result-score">
                        You scored <strong>{quizResult.score}/{quizResult.total}</strong> — great work!
                      </div>
                      <div className="vl-result-btns">
                        <button className="vl-btn-primary" onClick={handleDismissQuiz}>Continue</button>
                      </div>
                    </div>
                  )}

                  {/* Active quiz */}
                  {quizState === 'active' && (
                    <>
                      <div className="vl-quiz-body">
                        {quizResult && !quizResult.passed && (
                          <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 18 }}>😔</span>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>
                                {quizResult.score}/{quizResult.total} — Need 60% to pass
                              </div>
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>Review the answers below and try again</div>
                            </div>
                          </div>
                        )}

                        {quizQuestions.map((q, qi) => {
                          const answered    = quizAnswers[qi] !== undefined;
                          const showReview  = quizResult !== null;
                          return (
                            <div className="vl-q-item" key={qi}>
                              <div className="vl-q-num">Question {qi + 1}</div>
                              <div className="vl-q-text">{q.question}</div>
                              <div className="vl-options">
                                {q.options.map((opt, oi) => {
                                  let cls = 'vl-option';
                                  if (showReview) {
                                    if (oi === q.correctIndex)           cls += ' correct';
                                    else if (oi === quizAnswers[qi])     cls += ' wrong';
                                  } else if (quizAnswers[qi] === oi)    cls += ' selected';

                                  return (
                                    <button
                                      key={oi}
                                      className={cls}
                                      onClick={() => !showReview && setQuizAnswers(a => ({ ...a, [qi]: oi }))}
                                      disabled={showReview}
                                    >
                                      <div className="vl-option-dot">
                                        {showReview && oi === q.correctIndex && '✓'}
                                        {showReview && oi === quizAnswers[qi] && oi !== q.correctIndex && '✗'}
                                      </div>
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="vl-quiz-footer">
                        {quizResult && !quizResult.passed ? (
                          <button className="vl-quiz-submit" onClick={handleRetryQuiz}>
                            Try Again
                          </button>
                        ) : (
                          <button
                            className="vl-quiz-submit"
                            onClick={handleSubmitQuiz}
                            disabled={!allAnswered}
                          >
                            {allAnswered ? 'Submit Answers' : `Answer all ${quizQuestions.length} questions to submit`}
                          </button>
                        )}
                      </div>
                    </>
                  )}

                </div>
              )}

              {/* Lecture title + info */}
              <div className="vl-card-body">
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
                  <div className="vl-creator-desc">{creatorData?.description || selectedCourse?.description}</div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="vl-sidebar-card">
              <div className="vl-sidebar-title">Lectures</div>
              <div className="vl-sidebar-sub">{totalLectures} lecture{totalLectures !== 1 ? 's' : ''}</div>

              {lectures.length > 0 ? (
                <div className="vl-lec-list">
                  {lectures.map((lec, i) => {
                    const isActive  = selectedLecture?._id === lec._id;
                    const isWatched = watchedLectures[lec._id];
                    const isPending = !isWatched && quizPending[lec._id];
                    return (
                      <button
                        key={lec._id || i}
                        className={`vl-lec-btn${isActive ? ' active' : ''}`}
                        onClick={() => setSelectedLecture(lec)}
                      >
                        <div className="vl-lec-num">{i + 1}</div>
                        <span className="vl-lec-btn-name">{lec.lectureTitle}</span>
                        {isWatched
                          ? <div className="vl-tick"><FaCheckCircle size={11} color="#10b981" /></div>
                          : isPending
                            ? <button
                                onClick={(e) => { e.stopPropagation(); triggerQuiz(lec._id, lec.lectureTitle); }}
                                style={{ fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 6, background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.3)', color: '#f59e0b', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}
                              >
                                Take Quiz
                              </button>
                            : <FaPlayCircle size={12} color={isActive ? '#10b981' : 'rgba(255,255,255,.18)'} />
                        }
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="vl-empty">
                  <div className="vl-empty-icon">📹</div>
                  <div className="vl-empty-title">No lectures yet</div>
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