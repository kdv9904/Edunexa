import React, { useState, useEffect } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from './../../App';
import { ClipLoader } from 'react-spinners';
import { setLectureData } from "../../redux/lectureSlice";
import { FaEdit, FaVideo } from "react-icons/fa";

const CreateLecture = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lectureData } = useSelector(state => state.lecture);

  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateLecture = async () => {
    if (!lectureTitle.trim()) { toast.error("Please enter a lecture title"); return; }
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + `/api/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true }
      );
      dispatch(setLectureData(result.data.lectures || []));
      toast.success("Lecture added successfully");
      setLectureTitle("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const result = await axios.get(
          serverUrl + `/api/course/courselecture/${courseId}`,
          { withCredentials: true }
        );
        dispatch(setLectureData(result.data.lectures || []));
      } catch (error) {
        console.log(error);
      }
    };
    fetchLectures();
  }, [courseId, dispatch]);

  const count = lectureData?.length || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .cl-root {
          min-height: 100vh; background: #07090f;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow-x: hidden;
          padding: 48px 24px 72px;
        }
        .cl-glow1 { position: fixed; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,.06) 0%, transparent 70%); top: -150px; right: -150px; pointer-events: none; z-index: 0; }
        .cl-glow2 { position: fixed; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,.05) 0%, transparent 70%); bottom: -100px; left: -100px; pointer-events: none; z-index: 0; }
        .cl-grid { position: fixed; inset: 0; opacity: .022; pointer-events: none; z-index: 0; background-image: linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px); background-size: 56px 56px; }

        .cl-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }

        /* Back */
        .cl-back { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 8px 14px; color: rgba(255,255,255,.45); font-size: 12px; font-weight: 500; cursor: pointer; margin-bottom: 28px; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .cl-back:hover { color: #fff; background: rgba(255,255,255,.09); border-color: rgba(255,255,255,.2); }

        /* Header */
        .cl-eyebrow { font-size: 11px; font-weight: 700; color: #10b981; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
        .cl-title { font-family: 'Playfair Display', serif; font-size: clamp(26px, 3vw, 36px); font-weight: 700; color: #fff; line-height: 1.2; margin: 0 0 32px; }
        .cl-title em { color: #10b981; font-style: italic; }

        /* Form card */
        .cl-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 20px; padding: 28px; margin-bottom: 14px; }
        .cl-label { display: block; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.4); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
        .cl-input { width: 100%; padding: 12px 16px; border-radius: 10px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .2s; box-sizing: border-box; }
        .cl-input:focus { border-color: #10b981; }
        .cl-input::placeholder { color: rgba(255,255,255,.22); }

        /* Buttons row */
        .cl-btn-row { display: flex; gap: 10px; margin-top: 18px; }
        .cl-btn-ghost { flex: 1; padding: 11px; border-radius: 10px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.55); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 7px; }
        .cl-btn-ghost:hover { background: rgba(255,255,255,.09); color: #fff; }
        .cl-btn-ghost:disabled { opacity: .4; cursor: not-allowed; }
        .cl-btn-primary { flex: 2; padding: 11px; border-radius: 10px; background: #10b981; border: none; color: #07090f; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .2s, transform .15s, box-shadow .2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .cl-btn-primary:hover:not(:disabled) { background: #0ea472; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(16,185,129,.28); }
        .cl-btn-primary:disabled { opacity: .5; cursor: not-allowed; }

        /* Divider */
        .cl-divider { height: 1px; background: rgba(255,255,255,.06); margin: 24px 0; }

        /* List header */
        .cl-list-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .cl-list-title { font-size: 13px; font-weight: 700; color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: 1px; }
        .cl-count-pill { background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.2); color: #10b981; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; }

        /* Lecture items */
        .cl-lecture-list { display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto; padding-right: 4px; }
        .cl-lecture-list::-webkit-scrollbar { width: 4px; }
        .cl-lecture-list::-webkit-scrollbar-track { background: transparent; }
        .cl-lecture-list::-webkit-scrollbar-thumb { background: rgba(16,185,129,.3); border-radius: 100px; }

        .cl-lecture-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); border-radius: 12px; transition: border-color .2s; }
        .cl-lecture-item:hover { border-color: rgba(16,185,129,.2); }
        .cl-lecture-num { width: 30px; height: 30px; border-radius: 8px; background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.15); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #10b981; flex-shrink: 0; }
        .cl-lecture-name { flex: 1; font-size: 13px; font-weight: 600; color: rgba(255,255,255,.8); }
        .cl-lecture-sub { font-size: 11px; color: rgba(255,255,255,.25); margin-top: 2px; }
        .cl-edit-btn { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .2s; flex-shrink: 0; }
        .cl-edit-btn:hover { background: rgba(16,185,129,.1); border-color: rgba(16,185,129,.25); color: #10b981; }

        /* Empty state */
        .cl-empty { text-align: center; padding: 40px 24px; }
        .cl-empty-icon { font-size: 32px; opacity: .25; margin-bottom: 10px; }
        .cl-empty-title { font-family: 'Playfair Display', serif; font-size: 16px; color: rgba(255,255,255,.25); margin-bottom: 4px; }
        .cl-empty-sub { font-size: 12px; color: rgba(255,255,255,.15); }

        /* Stats row */
        .cl-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .cl-stat { background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); border-radius: 14px; padding: 16px; text-align: center; }
        .cl-stat-val { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .cl-stat-label { font-size: 11px; color: rgba(255,255,255,.3); }
      `}</style>

      <div className="cl-root">
        <div className="cl-glow1" /><div className="cl-glow2" /><div className="cl-grid" />

        <div className="cl-inner">

          {/* Back button */}
          <button className="cl-back" onClick={() => navigate(`/editcourse/${courseId}`)}>
            <FaArrowLeftLong size={11} /> Back to Course
          </button>

          {/* Header */}
          <div className="cl-eyebrow">Course Builder</div>
          <h1 className="cl-title">Manage <em>lectures</em></h1>

          {/* Form card */}
          <div className="cl-card">
            <label className="cl-label">New Lecture Title <span style={{ color: '#10b981' }}>*</span></label>
            <input
              className="cl-input"
              type="text"
              placeholder="e.g. Introduction to MERN Stack"
              value={lectureTitle}
              onChange={e => setLectureTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && handleCreateLecture()}
            />
            <div className="cl-btn-row">
              <button className="cl-btn-ghost" disabled={loading} onClick={() => navigate(`/editcourse/${courseId}`)}>
                <FaArrowLeftLong size={11} /> Back
              </button>
              <button className="cl-btn-primary" onClick={handleCreateLecture} disabled={loading || !lectureTitle.trim()}>
                {loading ? <><ClipLoader size={13} color="#07090f" /> Creating...</> : '+ Add Lecture'}
              </button>
            </div>
          </div>

          {/* Lectures list card */}
          <div className="cl-card">
            <div className="cl-list-header">
              <div className="cl-list-title">Lectures</div>
              <div className="cl-count-pill">{count} total</div>
            </div>

            {count === 0 ? (
              <div className="cl-empty">
                <div className="cl-empty-icon">📹</div>
                <div className="cl-empty-title">No lectures yet</div>
                <div className="cl-empty-sub">Add your first lecture above to get started</div>
              </div>
            ) : (
              <div className="cl-lecture-list">
                {lectureData.map((lecture, index) => (
                  <div className="cl-lecture-item" key={lecture._id || index}>
                    <div className="cl-lecture-num">{index + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div className="cl-lecture-name">{lecture.lectureTitle}</div>
                      <div className="cl-lecture-sub">
                        {lecture.videoUrl ? '✓ Video attached' : 'No video yet — click edit to upload'}
                      </div>
                    </div>
                    {lecture.isPreviewFree && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', padding: '3px 8px', borderRadius: 100 }}>
                        Free
                      </span>
                    )}
                    <button
                      className="cl-edit-btn"
                      onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}
                    >
                      <FaEdit size={12} color="rgba(255,255,255,.5)" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="cl-stats">
            <div className="cl-stat">
              <div className="cl-stat-val">{count}</div>
              <div className="cl-stat-label">Total Lectures</div>
            </div>
            <div className="cl-stat">
              <div className="cl-stat-val" style={{ color: '#10b981' }}>
                {lectureData?.filter(l => l.videoUrl).length || 0}
              </div>
              <div className="cl-stat-label">With Video</div>
            </div>
            <div className="cl-stat">
              <div className="cl-stat-val" style={{ color: '#f59e0b' }}>
                {lectureData?.filter(l => !l.videoUrl).length || 0}
              </div>
              <div className="cl-stat-label">Pending Upload</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default CreateLecture;