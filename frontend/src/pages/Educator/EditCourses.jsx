import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong, FaUpload, FaChevronDown, FaCheck } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../assets/empty.jpg";
import axios from "axios";
import { serverUrl } from "./../../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateCreatorCourse } from "../../redux/courseSlice";
import { ClipLoader } from "react-spinners";
import { FaTimes } from "react-icons/fa";

const CATEGORIES = [
  "App Development","Web Development","Data Science","Machine Learning",
  "Artificial Intelligence","Cloud Computing","Cyber Security",
  "Blockchain","Game Development","UI/UX Design",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

/* ── Reusable custom dropdown ── */
const Dropdown = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%", padding: "11px 16px", borderRadius: 10, boxSizing: "border-box",
          background: "rgba(255,255,255,.04)",
          border: `1px solid ${open ? "#10b981" : "rgba(255,255,255,.1)"}`,
          color: value ? "#fff" : "rgba(255,255,255,.25)", fontSize: 14,
          fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "border-color .2s", userSelect: "none",
          borderBottomLeftRadius: open ? 0 : 10, borderBottomRightRadius: open ? 0 : 10,
        }}
      >
        <span>{value || placeholder}</span>
        <FaChevronDown
          size={11}
          style={{
            color: open ? "#10b981" : "rgba(255,255,255,.3)",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform .2s, color .2s", flexShrink: 0,
          }}
        />
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "#0d1117", border: "1px solid rgba(16,185,129,.2)", borderTop: "none",
          borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
          boxShadow: "0 20px 40px rgba(0,0,0,.7)", zIndex: 999,
          maxHeight: 240, overflowY: "auto",
        }}>
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: "11px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer",
                color: value === opt ? "#10b981" : "rgba(255,255,255,.55)",
                background: value === opt ? "rgba(16,185,129,.08)" : "transparent",
                borderBottom: "1px solid rgba(255,255,255,.04)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontFamily: "'DM Sans', sans-serif", transition: "background .12s, color .12s",
              }}
              onMouseEnter={(e) => { if (value !== opt) { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.color = "#fff"; }}}
              onMouseLeave={(e) => { if (value !== opt) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,.55)"; }}}
            >
              <span>{opt}</span>
              {value === opt && <FaCheck size={10} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main Component ── */
const EditCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const thumb = useRef();
  const { courseId } = useParams();

  const [isPublished, setIsPublished]     = useState(false);
  const [selectCourse, setSelectCourse]   = useState(null);
  const [title, setTitle]                 = useState("");
  const [subTitle, setSubTitle]           = useState("");
  const [description, setDescription]     = useState("");
  const [category, setCategory]           = useState("");
  const [level, setLevel]                 = useState("");
  const [price, setPrice]                 = useState("");
  const [frontendImage, setFrontendImage] = useState(img);
  const [backendImage, setBackendImage]   = useState(null);
  const [loading, setLoading]             = useState(false);
  const [loading1, setLoading1]           = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) { setBackendImage(file); setFrontendImage(URL.createObjectURL(file)); }
  };

  const getCourseById = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, { withCredentials: true });
      setSelectCourse(result.data);
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    if (selectCourse) {
      setTitle(selectCourse.title || "");
      setSubTitle(selectCourse.subTitle || "");
      setDescription(selectCourse.description || "");
      setCategory(selectCourse.category || "");
      setLevel(selectCourse.level || "");
      setPrice(selectCourse.price || "");
      setFrontendImage(selectCourse.thumbnail || img);
      setIsPublished(selectCourse.isPublished || false);
    }
  }, [selectCourse]);

  useEffect(() => { getCourseById(); }, []);

  const handleEditCourse = async () => {
    if (!title.trim() || !category.trim() || !level.trim()) {
      toast.error("Please fill in all required fields"); return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title); formData.append("subTitle", subTitle);
      formData.append("description", description); formData.append("category", category);
      formData.append("level", level); formData.append("price", price);
      formData.append("isPublished", isPublished);
      if (backendImage) formData.append("thumbnail", backendImage);
      const { data } = await axios.post(`${serverUrl}/api/course/editcourse/${courseId}`, formData, {
        withCredentials: true, headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(updateCreatorCourse(data));
      toast.success("Course updated successfully!");
      navigate("/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  };

  const handleRemoveCourse = async () => {
    setShowDeleteModal(false); setLoading1(true);
    try {
      await axios.delete(serverUrl + `/api/course/remove/${courseId}`, { withCredentials: true });
      toast.success("Course removed successfully");
      navigate("/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Remove failed");
    } finally { setLoading1(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .ec-root { min-height: 100vh; background: #07090f; font-family: 'DM Sans', sans-serif; position: relative; overflow-x: hidden; padding: 48px 28px 80px; }
        .ec-glow1 { position: fixed; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,.06) 0%, transparent 70%); top: -150px; right: -150px; pointer-events: none; z-index: 0; }
        .ec-glow2 { position: fixed; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,.05) 0%, transparent 70%); bottom: -100px; left: -100px; pointer-events: none; z-index: 0; }
        .ec-grid { position: fixed; inset: 0; opacity: .022; pointer-events: none; z-index: 0; background-image: linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px); background-size: 56px 56px; }
        .ec-inner { position: relative; z-index: 1; max-width: 780px; margin: 0 auto; }

        /* Back */
        .ec-back { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 8px 14px; color: rgba(255,255,255,.45); font-size: 12px; font-weight: 500; cursor: pointer; margin-bottom: 28px; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .ec-back:hover { color: #fff; background: rgba(255,255,255,.09); border-color: rgba(255,255,255,.2); }

        /* Top row */
        .ec-toprow { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 14px; }
        .ec-eyebrow { font-size: 11px; font-weight: 700; color: #10b981; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
        .ec-title { font-family: 'Playfair Display', serif; font-size: clamp(24px, 2.8vw, 32px); font-weight: 700; color: #fff; line-height: 1.2; margin: 0; }
        .ec-title em { color: #10b981; font-style: italic; }
        .ec-lec-btn { padding: 9px 18px; border-radius: 10px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.55); font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; white-space: nowrap; display: flex; align-items: center; gap: 7px; margin-top: 4px; }
        .ec-lec-btn:hover { background: rgba(255,255,255,.1); color: #fff; border-color: rgba(255,255,255,.2); }

        /* Status bar */
        .ec-status-bar { display: flex; align-items: center; gap: 10px; padding: 13px 18px; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); border-radius: 14px; margin-bottom: 16px; flex-wrap: wrap; }
        .ec-status-dot { font-size: 11px; color: rgba(255,255,255,.3); font-weight: 500; }
        .ec-pub-btn { padding: 7px 15px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; background: rgba(16,185,129,.1); color: #10b981; border: 1px solid rgba(16,185,129,.22); }
        .ec-pub-btn:hover { background: rgba(16,185,129,.18); }
        .ec-unpub-btn { padding: 7px 15px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; background: rgba(245,158,11,.08); color: #f59e0b; border: 1px solid rgba(245,158,11,.2); }
        .ec-unpub-btn:hover { background: rgba(245,158,11,.16); }
        .ec-del-btn { margin-left: auto; padding: 7px 15px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; background: transparent; color: rgba(239,68,68,.65); border: 1px solid rgba(239,68,68,.2); transition: all .2s; display: flex; align-items: center; gap: 6px; }
        .ec-del-btn:hover { background: rgba(239,68,68,.1); color: #ef4444; border-color: rgba(239,68,68,.4); }
        .ec-del-btn:disabled { opacity: .4; cursor: not-allowed; }

        /* Cards */
        .ec-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 18px; padding: 24px; margin-bottom: 14px; }
        .ec-card-title { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.28); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 20px; }

        /* Fields */
        .ec-label { display: block; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.38); letter-spacing: .8px; text-transform: uppercase; margin-bottom: 7px; }
        .ec-field { margin-bottom: 18px; }
        .ec-field:last-child { margin-bottom: 0; }
        .ec-input, .ec-textarea { width: 100%; padding: 11px 16px; border-radius: 10px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .2s; box-sizing: border-box; }
        .ec-input:focus, .ec-textarea:focus { border-color: #10b981; }
        .ec-input::placeholder, .ec-textarea::placeholder { color: rgba(255,255,255,.22); }
        .ec-textarea { resize: none; height: 108px; line-height: 1.65; }
        .ec-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 560px) { .ec-two-col { grid-template-columns: 1fr; } }

        /* Thumbnail */
        .ec-thumb-wrap { position: relative; width: 100%; max-width: 340px; border-radius: 12px; overflow: hidden; border: 1.5px dashed rgba(255,255,255,.12); cursor: pointer; transition: border-color .2s; }
        .ec-thumb-wrap:hover { border-color: #10b981; }
        .ec-thumb-wrap img { width: 100%; height: 190px; object-fit: cover; display: block; }
        .ec-thumb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.52); opacity: 0; transition: opacity .2s; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px; }
        .ec-thumb-wrap:hover .ec-thumb-overlay { opacity: 1; }
        .ec-thumb-overlay span { color: #fff; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; }

        /* Action buttons */
        .ec-divider { height: 1px; background: rgba(255,255,255,.06); margin: 6px 0 20px; }
        .ec-btn-row { display: flex; gap: 10px; }
        .ec-btn-ghost { flex: 1; padding: 12px; border-radius: 10px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.55); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .ec-btn-ghost:hover { background: rgba(255,255,255,.09); color: #fff; }
        .ec-btn-ghost:disabled { opacity: .4; cursor: not-allowed; }
        .ec-btn-save { flex: 2; padding: 12px; border-radius: 10px; background: #10b981; border: none; color: #07090f; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .2s, transform .15s, box-shadow .2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .ec-btn-save:hover:not(:disabled) { background: #0ea472; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(16,185,129,.28); }
        .ec-btn-save:disabled { opacity: .5; cursor: not-allowed; }

        /* Delete modal */
        .ec-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.75); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 24px; }
        .ec-modal { background: #0f172a; border: 1px solid rgba(255,255,255,.1); border-radius: 20px; padding: 28px; max-width: 400px; width: 100%; text-align: center; }
        .ec-modal-icon { width: 52px; height: 52px; border-radius: 50%; background: rgba(239,68,68,.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 22px; }
        .ec-modal h3 { color: #fff; font-size: 17px; font-weight: 700; margin-bottom: 8px; font-family: 'DM Sans', sans-serif; }
        .ec-modal p { color: rgba(255,255,255,.38); font-size: 13px; line-height: 1.65; margin-bottom: 24px; font-family: 'DM Sans', sans-serif; }
        .ec-modal-btns { display: flex; gap: 10px; }
        .ec-modal-cancel { flex: 1; padding: 11px; border-radius: 10px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.6); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .ec-modal-confirm { flex: 1; padding: 11px; border-radius: 10px; background: #ef4444; border: none; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; }
      `}</style>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="ec-modal-bg">
          <div className="ec-modal">
            <div className="ec-modal-icon">🗑️</div>
            <h3>Delete Course?</h3>
            <p>This will permanently remove the course and all its lectures. This action cannot be undone.</p>
            <div className="ec-modal-btns">
              <button className="ec-modal-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="ec-modal-confirm" onClick={handleRemoveCourse}>
                {loading1 ? <ClipLoader size={14} color="#fff" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ec-root">
        <div className="ec-glow1" /><div className="ec-glow2" /><div className="ec-grid" />

        <div className="ec-inner">

          {/* Back */}
          <button className="ec-back" onClick={() => navigate("/courses")}>
            <FaArrowLeftLong size={11} /> Back to Courses
          </button>

          {/* Top row */}
          <div className="ec-toprow">
            <div>
              <div className="ec-eyebrow">Educator</div>
              <h1 className="ec-title">Edit <em>course</em></h1>
            </div>
            <button className="ec-lec-btn" onClick={() => navigate(`/create-lecture/${courseId}`)}>
              📹 Manage Lectures
            </button>
          </div>

          {/* Status bar */}
          <div className="ec-status-bar">
            <span className="ec-status-dot">Visibility:</span>
            {!isPublished ? (
              <button className="ec-pub-btn" onClick={() => setIsPublished(true)}>● Publish</button>
            ) : (
              <button className="ec-unpub-btn" onClick={() => setIsPublished(false)}>⏸ Unpublish</button>
            )}
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.2)" }}>
              {isPublished ? "Live — visible to students" : "Draft — hidden from students"}
            </span>
            <button className="ec-del-btn" onClick={() => setShowDeleteModal(true)} disabled={loading1}>
              {loading1 ? <ClipLoader size={11} color="#ef4444" /> : <FaTimes size={11} />}
              Delete
            </button>
          </div>

          {/* Basic Info */}
          <div className="ec-card">
            <div className="ec-card-title">Basic Information</div>
            <div className="ec-field">
              <label className="ec-label">Title <span style={{ color: "#10b981" }}>*</span></label>
              <input className="ec-input" type="text" placeholder="Enter course title" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="ec-field">
              <label className="ec-label">Subtitle</label>
              <input className="ec-input" type="text" placeholder="Enter a short subtitle" value={subTitle} onChange={e => setSubTitle(e.target.value)} />
            </div>
            <div className="ec-field">
              <label className="ec-label">Description</label>
              <textarea className="ec-textarea" placeholder="Describe what students will learn..." value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </div>

          {/* Settings */}
          <div className="ec-card">
            <div className="ec-card-title">Course Settings</div>
            <div className="ec-two-col" style={{ marginBottom: 18 }}>
              <div>
                <label className="ec-label">Category <span style={{ color: "#10b981" }}>*</span></label>
                <Dropdown value={category} onChange={setCategory} options={CATEGORIES} placeholder="Select category" />
              </div>
              <div>
                <label className="ec-label">Level <span style={{ color: "#10b981" }}>*</span></label>
                <Dropdown value={level} onChange={setLevel} options={LEVELS} placeholder="Select level" />
              </div>
            </div>
            <div className="ec-field" style={{ marginBottom: 0 }}>
              <label className="ec-label">Price (INR)</label>
              <input className="ec-input" type="number" placeholder="e.g. 499" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="ec-card">
            <div className="ec-card-title">Thumbnail</div>
            <input type="file" hidden ref={thumb} accept="image/*" onChange={handleThumbnail} />
            <div className="ec-thumb-wrap" onClick={() => thumb.current.click()}>
              <img src={frontendImage} alt="thumbnail" />
              <div className="ec-thumb-overlay">
                <FaUpload size={20} color="#fff" />
                <span>Click to change</span>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,.22)", marginTop: 10, fontFamily: "'DM Sans', sans-serif" }}>
              Recommended: 1280×720px • JPG or PNG
            </p>
          </div>

          {/* Actions */}
          <div className="ec-btn-row">
            <button className="ec-btn-ghost" onClick={() => navigate("/courses")} disabled={loading}>Cancel</button>
            <button className="ec-btn-save" onClick={handleEditCourse} disabled={loading}>
              {loading ? <><ClipLoader size={13} color="#07090f" /> Saving...</> : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default EditCourses;