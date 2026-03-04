import React, { useState, useRef, useEffect } from 'react'
import { FaArrowLeftLong, FaChevronDown, FaCheck } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { serverUrl } from "../../App"
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

const CATEGORIES = [
  "App Development", "Web Development", "Data Science", "Machine Learning",
  "Artificial Intelligence", "Cloud Computing", "Cyber Security",
  "Blockchain", "Game Development", "UI/UX Design"
]

const CreateCourses = () => {
  const navigate = useNavigate()
  const [title, setTitle]       = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading]   = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleCreateCourse = async () => {
    if (!title.trim() || !category.trim()) { toast.error("Please fill in all fields"); return }
    setLoading(true)
    try {
      await axios.post(serverUrl + "/api/course/create", { title, category }, { withCredentials: true })
      toast.success("Course created successfully!")
      navigate("/courses")
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .cc-root { min-height: 100vh; background: #07090f; display: flex; align-items: center; justify-content: center; padding: 48px 24px; font-family: 'DM Sans', sans-serif; position: relative; overflow: hidden; }
        .cc-glow1 { position: absolute; width: 560px; height: 560px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,.07) 0%, transparent 70%); top: -140px; right: -140px; pointer-events: none; }
        .cc-glow2 { position: absolute; width: 460px; height: 460px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,.06) 0%, transparent 70%); bottom: -100px; left: -100px; pointer-events: none; }
        .cc-grid { position: absolute; inset: 0; opacity: .022; pointer-events: none; background-image: linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px); background-size: 56px 56px; }
        .cc-inner { position: relative; z-index: 1; width: 100%; max-width: 480px; }

        .cc-back { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 8px 14px; color: rgba(255,255,255,.45); font-size: 12px; font-weight: 500; cursor: pointer; margin-bottom: 28px; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .cc-back:hover { color: #fff; background: rgba(255,255,255,.09); border-color: rgba(255,255,255,.2); }

        .cc-eyebrow { font-size: 11px; font-weight: 700; color: #10b981; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
        .cc-title { font-family: 'Playfair Display', serif; font-size: clamp(26px, 3vw, 34px); font-weight: 700; color: #fff; line-height: 1.2; margin: 0 0 32px; }
        .cc-title em { color: #10b981; font-style: italic; }

        .cc-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 20px; padding: 28px; }
        .cc-label { display: block; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.4); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
        .cc-field { margin-bottom: 20px; }

        .cc-input { width: 100%; padding: 12px 16px; border-radius: 10px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .2s; box-sizing: border-box; }
        .cc-input:focus { border-color: #10b981; }
        .cc-input::placeholder { color: rgba(255,255,255,.22); }

        /* Custom dropdown */
        .cc-drop-wrap { position: relative; }
        .cc-drop-trigger { width: 100%; padding: 12px 16px; border-radius: 10px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: border-color .2s; box-sizing: border-box; user-select: none; }
        .cc-drop-trigger.open { border-color: #10b981; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
        .cc-drop-trigger.empty { color: rgba(255,255,255,.22); }

        .cc-drop-chevron { transition: transform .2s; color: rgba(255,255,255,.3); flex-shrink: 0; }
        .cc-drop-chevron.open { transform: rotate(180deg); color: #10b981; }

        .cc-drop-menu { position: absolute; top: 100%; left: 0; right: 0; background: #0d1117; border: 1px solid rgba(16,185,129,.2); border-top: none; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,.7); z-index: 999; max-height: 260px; overflow-y: auto; }
        .cc-drop-menu::-webkit-scrollbar { width: 4px; }
        .cc-drop-menu::-webkit-scrollbar-track { background: transparent; }
        .cc-drop-menu::-webkit-scrollbar-thumb { background: rgba(16,185,129,.3); border-radius: 100px; }

        .cc-drop-item { padding: 11px 16px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,.55); cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: background .12s, color .12s; border-bottom: 1px solid rgba(255,255,255,.04); }
        .cc-drop-item:last-child { border-bottom: none; }
        .cc-drop-item:hover { background: rgba(255,255,255,.05); color: #fff; }
        .cc-drop-item.active { color: #10b981; background: rgba(16,185,129,.08); }

        .cc-divider { height: 1px; background: rgba(255,255,255,.06); margin: 24px 0; }

        .cc-btn-row { display: flex; gap: 10px; }
        .cc-btn-ghost { flex: 1; padding: 11px; border-radius: 10px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.55); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .cc-btn-ghost:hover { background: rgba(255,255,255,.09); color: #fff; }
        .cc-btn-ghost:disabled { opacity: .4; cursor: not-allowed; }
        .cc-btn-primary { flex: 2; padding: 12px; border-radius: 10px; background: #10b981; border: none; color: #07090f; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .2s, transform .15s, box-shadow .2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .cc-btn-primary:hover:not(:disabled) { background: #0ea472; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(16,185,129,.28); }
        .cc-btn-primary:disabled { opacity: .5; cursor: not-allowed; }

        .cc-hint { margin-top: 14px; padding: 14px 16px; background: rgba(255,255,255,.02); border: 1px solid rgba(255,255,255,.06); border-radius: 12px; font-size: 12px; color: rgba(255,255,255,.3); text-align: center; line-height: 1.6; }
      `}</style>

      <div className="cc-root">
        <div className="cc-glow1" /><div className="cc-glow2" /><div className="cc-grid" />

        <div className="cc-inner">

          <button className="cc-back" onClick={() => navigate("/courses")}>
            <FaArrowLeftLong size={11} /> Back to Courses
          </button>

          <div className="cc-eyebrow">Educator</div>
          <h1 className="cc-title">Create a <em>new course</em></h1>

          <div className="cc-card">

            {/* Title */}
            <div className="cc-field">
              <label className="cc-label">Course Title <span style={{ color: '#10b981' }}>*</span></label>
              <input
                className="cc-input"
                type="text"
                placeholder="e.g. Complete React.js Masterclass"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !loading && handleCreateCourse()}
              />
            </div>

            {/* Custom Dropdown */}
            <div className="cc-field" style={{ marginBottom: 0 }}>
              <label className="cc-label">Category <span style={{ color: '#10b981' }}>*</span></label>
              <div className="cc-drop-wrap" ref={dropRef}>
                <div
                  className={`cc-drop-trigger${dropOpen ? ' open' : ''}${!category ? ' empty' : ''}`}
                  onClick={() => setDropOpen(p => !p)}
                >
                  <span>{category || 'Select a category'}</span>
                  <FaChevronDown size={11} className={`cc-drop-chevron${dropOpen ? ' open' : ''}`} />
                </div>

                {dropOpen && (
                  <div className="cc-drop-menu">
                    {CATEGORIES.map(cat => (
                      <div
                        key={cat}
                        className={`cc-drop-item${category === cat ? ' active' : ''}`}
                        onClick={() => { setCategory(cat); setDropOpen(false) }}
                      >
                        <span>{cat}</span>
                        {category === cat && <FaCheck size={10} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="cc-divider" />

            <div className="cc-btn-row">
              <button className="cc-btn-ghost" onClick={() => navigate("/courses")} disabled={loading}>Cancel</button>
              <button
                className="cc-btn-primary"
                onClick={handleCreateCourse}
                disabled={loading || !title.trim() || !category.trim()}
              >
                {loading ? <><ClipLoader size={13} color="#07090f" /> Creating...</> : 'Create Course'}
              </button>
            </div>

          </div>

          <div className="cc-hint">
            You can add thumbnails, pricing, description and lectures after creation
          </div>

        </div>
      </div>
    </>
  )
}

export default CreateCourses