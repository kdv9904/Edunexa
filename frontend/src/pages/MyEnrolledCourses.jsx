import React from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6';
import { FaPlayCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const MyEnrolledCourses = () => {
  const { userData } = useSelector(state => state.user);
  const navigate = useNavigate();
  const courses = userData?.user?.enrolledCourses || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .mec-root { min-height: 100vh; background: #07090f; font-family: 'DM Sans', sans-serif; position: relative; overflow-x: hidden; padding: 40px 24px 80px; }
        .mec-glow1 { position: fixed; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,.055) 0%, transparent 70%); top: -200px; right: -200px; pointer-events: none; z-index: 0; }
        .mec-glow2 { position: fixed; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,.05) 0%, transparent 70%); bottom: -120px; left: -120px; pointer-events: none; z-index: 0; }
        .mec-grid { position: fixed; inset: 0; opacity: .018; pointer-events: none; z-index: 0; background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 56px 56px; }
        .mec-inner { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }

        /* Back */
        .mec-back { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 8px 14px; color: rgba(255,255,255,.45); font-size: 12px; font-weight: 500; cursor: pointer; margin-bottom: 36px; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .mec-back:hover { color: #fff; background: rgba(255,255,255,.09); }

        /* Header */
        .mec-header { margin-bottom: 40px; }
        .mec-eyebrow { font-size: 11px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 12px; }
        .mec-title { font-family: 'Playfair Display', serif; font-size: clamp(28px, 3.5vw, 42px); font-weight: 700; color: #fff; margin: 0 0 10px; line-height: 1.15; }
        .mec-title em { color: #10b981; font-style: italic; }
        .mec-subtitle { font-size: 14px; color: rgba(255,255,255,.35); max-width: 440px; line-height: 1.6; margin: 0; }
        .mec-count-pill { display: inline-flex; align-items: center; gap: 7px; background: rgba(16,185,129,.08); border: 1px solid rgba(16,185,129,.18); padding: 5px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; color: #10b981; margin-top: 16px; }

        /* Grid */
        .mec-grid-courses { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }

        /* Card */
        .mec-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 18px; overflow: hidden; transition: border-color .2s, transform .2s; cursor: pointer; }
        .mec-card:hover { border-color: rgba(16,185,129,.25); transform: translateY(-3px); }

        .mec-thumb { position: relative; overflow: hidden; }
        .mec-thumb img { width: 100%; height: 190px; object-fit: cover; display: block; transition: transform .4s ease; }
        .mec-card:hover .mec-thumb img { transform: scale(1.04); }
        .mec-thumb-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(7,9,15,.7) 0%, transparent 50%); }

        .mec-level-badge { position: absolute; top: 12px; right: 12px; background: rgba(7,9,15,.75); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.12); padding: 4px 11px; border-radius: 100px; font-size: 10px; font-weight: 700; color: rgba(255,255,255,.65); text-transform: uppercase; letter-spacing: .5px; }

        .mec-play-btn { position: absolute; bottom: 12px; left: 12px; width: 36px; height: 36px; border-radius: 50%; background: rgba(16,185,129,.85); display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(.8); transition: all .2s; }
        .mec-card:hover .mec-play-btn { opacity: 1; transform: scale(1); }

        /* Card body */
        .mec-card-body { padding: 18px 20px 20px; }
        .mec-cat { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; color: #818cf8; background: rgba(99,102,241,.08); border: 1px solid rgba(99,102,241,.15); padding: 3px 10px; border-radius: 100px; letter-spacing: .4px; margin-bottom: 10px; text-transform: uppercase; }
        .mec-course-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: #fff; line-height: 1.35; margin: 0 0 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        .mec-cta { width: 100%; padding: 11px; border-radius: 10px; background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.22); color: #10b981; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 7px; }
        .mec-cta:hover { background: #10b981; color: #07090f; }

        /* Empty state */
        .mec-empty { text-align: center; padding: 80px 24px; }
        .mec-empty-icon { font-size: 56px; opacity: .2; margin-bottom: 20px; }
        .mec-empty-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 10px; }
        .mec-empty-sub { font-size: 14px; color: rgba(255,255,255,.3); margin-bottom: 28px; max-width: 340px; margin-left: auto; margin-right: auto; line-height: 1.6; }
        .mec-empty-btn { padding: 12px 28px; background: #10b981; border: none; border-radius: 11px; color: #07090f; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .2s, transform .15s; }
        .mec-empty-btn:hover { background: #0ea472; transform: translateY(-1px); }
      `}</style>

      <div className="mec-root">
        <div className="mec-glow1" /><div className="mec-glow2" /><div className="mec-grid" />

        <div className="mec-inner">

          {/* Back */}
          <button className="mec-back" onClick={() => navigate('/')}>
            <FaArrowLeftLong size={11} /> Back to Home
          </button>

          {/* Header */}
          <div className="mec-header">
            <div className="mec-eyebrow">MY LEARNING</div>
            <h1 className="mec-title">
              Your learning <em>journey</em>
            </h1>
            <p className="mec-subtitle">
              Pick up where you left off and keep building your skills.
            </p>
            {courses.length > 0 && (
              <div className="mec-count-pill">
                📚 {courses.length} enrolled course{courses.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {courses.length === 0 ? (
            /* Empty state */
            <div className="mec-empty">
              <div className="mec-empty-icon">📚</div>
              <div className="mec-empty-title">No courses yet</div>
              <p className="mec-empty-sub">
                You haven't enrolled in any courses. Start your learning journey today.
              </p>
              <button className="mec-empty-btn" onClick={() => navigate('/allcourses')}>
                Explore Courses
              </button>
            </div>
          ) : (
            /* Course grid */
            <div className="mec-grid-courses">
              {courses.map((course, index) => (
                <div
                  key={course?._id || index}
                  className="mec-card"
                  onClick={() => navigate(`/viewcourse/${course._id}`)}
                >
                  {/* Thumbnail */}
                  <div className="mec-thumb">
                    {course?.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} />
                    ) : (
                      <div style={{ width: '100%', height: 190, background: 'rgba(16,185,129,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, opacity: .3 }}>📹</div>
                    )}
                    <div className="mec-thumb-overlay" />
                    {course?.level && (
                      <div className="mec-level-badge">{course.level}</div>
                    )}
                    <div className="mec-play-btn">
                      <FaPlayCircle size={16} color="#07090f" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="mec-card-body">
                    {course?.category && (
                      <div className="mec-cat">{course.category}</div>
                    )}
                    <h2 className="mec-course-title">{course?.title || 'Untitled Course'}</h2>
                    <button
                      className="mec-cta"
                      onClick={e => { e.stopPropagation(); navigate(`/viewlecture/${course._id}`); }}
                    >
                      <FaPlayCircle size={12} /> Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default MyEnrolledCourses;