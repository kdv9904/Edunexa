import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong, FaLock, FaStar } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCourse } from "../redux/courseSlice";
import img from "../assets/empty.jpg";
import { FaPlayCircle, FaCheckCircle } from "react-icons/fa";
import { serverUrl } from "../App";
import axios from "axios";
import Card from "../component/Card";
import { toast } from "react-toastify";

const ViewCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const { creatorCourseData, selectedCourse } = useSelector(state => state.course);

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData]         = useState(null);
  const [creatorCourses, setCreatorCourses]   = useState([]);
  const [isEnrolled, setIsEnrolled]           = useState(false);
  const [loading, setLoading]                 = useState(true);
  const [rating, setRating]                   = useState(0);
  const [comment, setComment]                 = useState("");
  const [reviewsData, setReviewsData]         = useState([]);
  const [reviewsLoading, setReviewsLoading]   = useState(true);

  // ── Video completion tracking ──
  const [watchedLectures, setWatchedLectures] = useState(() => {
    try {
      const stored = localStorage.getItem(`watched_${courseId}`);
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });
  const videoRef = useRef(null);
  const watchedRef = useRef(watchedLectures);

  const markAsWatched = (lectureId) => {
    if (watchedRef.current[lectureId]) return;
    const updated = { ...watchedRef.current, [lectureId]: true };
    watchedRef.current = updated;
    setWatchedLectures(updated);
    localStorage.setItem(`watched_${courseId}`, JSON.stringify(updated));
  };

  const handleVideoTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || !selectedLecture) return;
    if (vid.duration > 0 && vid.currentTime / vid.duration >= 0.9) {
      markAsWatched(selectedLecture._id);
    }
  };

  const completedCount = Object.keys(watchedLectures).filter(k => watchedLectures[k]).length;
  const totalLectures  = selectedCourse?.lectures?.length || 0;
  const progressPct    = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

  // ── Reset on courseId change ──
  useEffect(() => {
    setSelectedLecture(null);
    dispatch(setSelectedCourse(null));
    setIsEnrolled(false);
    setLoading(true);
    const stored = localStorage.getItem(`watched_${courseId}`);
    const parsed = stored ? JSON.parse(stored) : {};
    setWatchedLectures(parsed);
    watchedRef.current = parsed;
  }, [courseId, dispatch]);

  // ── Check enrollment ──
  useEffect(() => { checkEnrollment(); }, [userData, courseId, selectedCourse]);

  const checkEnrollment = async () => {
    const local = userData?.enrolledCourse?.some(c =>
      (typeof c === "string" ? c : c._id).toString() === courseId?.toString()
    );
    if (local) { setIsEnrolled(true); return; }
    if (userData?.user?._id && courseId) {
      try {
        const res = await axios.post(`${serverUrl}/api/payment/check-enrollment`, { userId: userData.user._id, courseId }, { withCredentials: true });
        if (res.data.success && res.data.isEnrolled) setIsEnrolled(true);
      } catch { setIsEnrolled(false); }
    }
  };

  // ── Fetch course ──
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res  = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, { withCredentials: true });
        const course = res.data;
        let lectures = [];
        if (course?.lectures?.length > 0) {
          if (typeof course.lectures[0] === "object" && course.lectures[0].lectureTitle) {
            lectures = course.lectures;
          } else {
            const lr = await axios.get(`${serverUrl}/api/course/courselecture/${courseId}`, { withCredentials: true });
            lectures = lr.data.lectures || [];
          }
        }
        dispatch(setSelectedCourse({ ...course, lectures }));
        if (lectures.length > 0) {
          const first = lectures.find(l => l.isPreviewFree || isEnrolled) || lectures[0];
          setSelectedLecture(first);
        }
      } catch { toast.error("Failed to load course details"); }
      finally { setLoading(false); }
    };
    if (courseId) fetch();
  }, [courseId, dispatch, isEnrolled]);

  // ── Creator ──
  useEffect(() => {
    const fetchCreator = async () => {
      const id = selectedCourse?.creator?._id || selectedCourse?.creator;
      if (!id) return;
      try {
        const res = await axios.post(`${serverUrl}/api/course/creator`, { userId: id }, { withCredentials: true });
        setCreatorData(res.data);
      } catch {}
    };
    if (selectedCourse) fetchCreator();
  }, [selectedCourse]);

  useEffect(() => {
    if (creatorData?._id && creatorCourseData?.length > 0) {
      setCreatorCourses(creatorCourseData.filter(c => c.creator === creatorData._id && c._id !== courseId));
    }
  }, [creatorData, creatorCourseData, courseId]);

  // ── Reviews ──
  useEffect(() => {
    const fetchReviews = async () => {
      if (!selectedCourse?.reviews?.length) { setReviewsData([]); setReviewsLoading(false); return; }
      try {
        setReviewsLoading(true);
        if (typeof selectedCourse.reviews[0] === "object" && selectedCourse.reviews[0].rating !== undefined) {
          setReviewsData(selectedCourse.reviews);
        } else {
          const all = await Promise.all(
            selectedCourse.reviews.map(async id => {
              try { const r = await axios.get(`${serverUrl}/api/review/${id}`, { withCredentials: true }); return r.data.review; }
              catch { return null; }
            })
          );
          setReviewsData(all.filter(Boolean));
        }
      } catch { setReviewsData([]); }
      finally { setReviewsLoading(false); }
    };
    if (selectedCourse) fetchReviews();
  }, [selectedCourse]);

  const avgRating = (() => {
    const list = reviewsData.length > 0 ? reviewsData : (selectedCourse?.reviews || []);
    const valid = list.filter(r => r && typeof r.rating === "number" && !isNaN(r.rating));
    if (!valid.length) return 0;
    return Number((valid.reduce((s, r) => s + r.rating, 0) / valid.length).toFixed(1));
  })();

  const handleLectureSelect = (lec) => {
    if (lec.isPreviewFree || isEnrolled) setSelectedLecture(lec);
    else toast.info("Please enroll to access this lecture");
  };

  const handleEnroll = async () => {
    if (!userData?.user) { toast.error("Please log in to enroll"); navigate("/login"); return; }
    if (isEnrolled) { navigate(`/learn/${courseId}`); return; }
    try {
      const order = await axios.post(serverUrl + "/api/payment/razorpay-order", { userId: userData.user._id, courseId }, { withCredentials: true });
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.data.order.amount, currency: "INR",
        name: "EduNexa", description: "Course Enrollment",
        order_id: order.data.order.id,
        handler: async (response) => {
          try {
            const verify = await axios.post(serverUrl + "/api/payment/verify-payment", { ...response, courseId, userId: userData.user._id }, { withCredentials: true });
            if (verify.data.success) { setIsEnrolled(true); toast.success("Enrolled! Redirecting..."); setTimeout(() => window.location.reload(), 1500); }
            else toast.error("Payment verification failed");
          } catch { toast.error("Payment verification failed"); }
        },
        prefill: { name: userData.user.name || "", email: userData.user.email || "" },
        theme: { color: "#10b981" },
      };
      const rz = new window.Razorpay(options);
      rz.open();
      rz.on("payment.failed", r => toast.error(`Payment failed: ${r.error.description}`));
    } catch { toast.error("Failed to create payment order"); }
  };

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) { toast.error("Please provide rating and comment"); return; }
    if (!userData?.user?._id) { toast.error("Please login"); navigate("/login"); return; }
    try {
      await axios.post(`${serverUrl}/api/review/createreview`, { rating, comment, courseId }, { withCredentials: true });
      toast.success("Review submitted!"); setRating(0); setComment("");
    } catch (e) {
      toast.error(e.response?.data?.message === "Review already given by you" ? "You've already reviewed this course" : "Failed to submit review");
    }
  };

  // ── Loading / Not found ──
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#07090f", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(16,185,129,.2)", borderTopColor: "#10b981", animation: "spin .8s linear infinite" }} />
      <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13 }}>Loading course...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!selectedCourse) return (
    <div style={{ minHeight: "100vh", background: "#07090f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: .3 }}>📚</div>
        <h3 style={{ color: "#fff", fontSize: 20, marginBottom: 8 }}>Course Not Found</h3>
        <button onClick={() => navigate("/")} style={{ marginTop: 16, padding: "10px 24px", background: "#10b981", border: "none", borderRadius: 10, color: "#07090f", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Browse Courses</button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .vc-root { min-height: 100vh; background: #07090f; font-family: 'DM Sans', sans-serif; position: relative; overflow-x: hidden; padding: 40px 24px 80px; }
        .vc-glow1 { position: fixed; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,.055) 0%, transparent 70%); top: -200px; right: -200px; pointer-events: none; z-index: 0; }
        .vc-glow2 { position: fixed; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,.05) 0%, transparent 70%); bottom: -100px; left: -100px; pointer-events: none; z-index: 0; }
        .vc-grid { position: fixed; inset: 0; opacity: .02; pointer-events: none; z-index: 0; background-image: linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px); background-size: 56px 56px; }
        .vc-inner { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; }

        /* Back */
        .vc-back { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 8px 14px; color: rgba(255,255,255,.45); font-size: 12px; font-weight: 500; cursor: pointer; margin-bottom: 28px; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .vc-back:hover { color: #fff; background: rgba(255,255,255,.09); }

        /* Hero row */
        .vc-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 20px; }
        @media(max-width:760px){ .vc-hero { grid-template-columns: 1fr; } }

        .vc-thumb-wrap { border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,.08); position: relative; }
        .vc-thumb-wrap img { width: 100%; height: 280px; object-fit: cover; display: block; }
        .vc-cat-badge { position: absolute; top: 12px; left: 12px; background: rgba(7,9,15,.7); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.12); padding: 5px 12px; border-radius: 100px; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.7); text-transform: uppercase; letter-spacing: 1px; }

        .vc-info { display: flex; flex-direction: column; gap: 16px; }
        .vc-eyebrow { font-size: 11px; font-weight: 700; color: #10b981; letter-spacing: 2px; text-transform: uppercase; }
        .vc-course-title { font-family: 'Playfair Display', serif; font-size: clamp(22px, 2.5vw, 30px); font-weight: 700; color: #fff; line-height: 1.25; margin: 0; }
        .vc-subtitle { font-size: 14px; color: rgba(255,255,255,.45); margin: 0; line-height: 1.6; }

        .vc-rating-row { display: flex; align-items: center; gap: 8px; }
        .vc-stars { display: flex; gap: 3px; }
        .vc-star { color: #f59e0b; font-size: 13px; }
        .vc-star-empty { color: rgba(255,255,255,.15); font-size: 13px; }
        .vc-rating-num { font-size: 14px; font-weight: 700; color: #f59e0b; }
        .vc-review-count { font-size: 12px; color: rgba(255,255,255,.35); }

        .vc-price-row { display: flex; align-items: center; gap: 12px; }
        .vc-price { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #fff; }
        .vc-price-old { font-size: 16px; color: rgba(255,255,255,.25); text-decoration: line-through; }
        .vc-save-badge { background: rgba(16,185,129,.12); border: 1px solid rgba(16,185,129,.2); color: #10b981; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; }

        .vc-features { display: flex; flex-direction: column; gap: 8px; }
        .vc-feature { display: flex; align-items: center; gap: 10px; font-size: 13px; color: rgba(255,255,255,.5); }
        .vc-feature-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        .vc-enroll-btn { width: 100%; padding: 14px; border-radius: 12px; background: #10b981; border: none; color: #07090f; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .2s, transform .15s, box-shadow .2s; }
        .vc-enroll-btn:hover { background: #0ea472; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(16,185,129,.3); }
        .vc-continue-btn { width: 100%; padding: 14px; border-radius: 12px; background: rgba(16,185,129,.12); border: 1px solid rgba(16,185,129,.25); color: #10b981; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .vc-continue-btn:hover { background: rgba(16,185,129,.2); }

        /* Progress bar */
        .vc-progress-card { background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); border-radius: 14px; padding: 16px 20px; margin-bottom: 20px; }
        .vc-progress-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .vc-progress-label { font-size: 12px; font-weight: 700; color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: .8px; }
        .vc-progress-pct { font-size: 13px; font-weight: 700; color: #10b981; }
        .vc-progress-track { height: 5px; background: rgba(255,255,255,.07); border-radius: 100px; overflow: hidden; }
        .vc-progress-fill { height: 100%; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 100px; transition: width .4s ease; }
        .vc-progress-sub { font-size: 11px; color: rgba(255,255,255,.25); margin-top: 8px; }

        /* Main content grid */
        .vc-main { display: grid; grid-template-columns: 2fr 3fr; gap: 16px; margin-bottom: 20px; }
        @media(max-width:860px){ .vc-main { grid-template-columns: 1fr; } }

        /* Curriculum card */
        .vc-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 18px; padding: 22px; }
        .vc-card-title { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.3); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 6px; }
        .vc-card-sub { font-size: 12px; color: rgba(255,255,255,.2); margin-bottom: 16px; }

        .vc-lec-list { display: flex; flex-direction: column; gap: 6px; max-height: 440px; overflow-y: auto; padding-right: 4px; }
        .vc-lec-list::-webkit-scrollbar { width: 3px; }
        .vc-lec-list::-webkit-scrollbar-thumb { background: rgba(16,185,129,.3); border-radius: 100px; }

        .vc-lec-item { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,.06); cursor: pointer; transition: all .18s; background: rgba(255,255,255,.02); }
        .vc-lec-item.active { border-color: rgba(16,185,129,.3); background: rgba(16,185,129,.07); }
        .vc-lec-item.locked { opacity: .45; cursor: not-allowed; }
        .vc-lec-item:not(.locked):not(.active):hover { border-color: rgba(255,255,255,.12); background: rgba(255,255,255,.04); }

        .vc-lec-num { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .vc-lec-num-default { background: rgba(255,255,255,.06); color: rgba(255,255,255,.35); }
        .vc-lec-num-active { background: rgba(16,185,129,.15); color: #10b981; }
        .vc-lec-num-locked { background: rgba(255,255,255,.04); color: rgba(255,255,255,.2); }

        .vc-lec-name { flex: 1; font-size: 12px; font-weight: 500; color: rgba(255,255,255,.65); line-height: 1.4; }
        .vc-lec-name.active { color: #fff; font-weight: 600; }

        /* Watched tick */
        .vc-lec-tick { width: 20px; height: 20px; border-radius: 50%; background: rgba(16,185,129,.15); border: 1.5px solid rgba(16,185,129,.4); display: flex; align-items: center; justify-content: center; flex-shrink: 0; animation: tickPop .3s ease; }
        @keyframes tickPop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .vc-free-pill { font-size: 9px; font-weight: 700; color: #10b981; background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.2); padding: 2px 7px; border-radius: 100px; flex-shrink: 0; }

        /* Video card */
        .vc-video-wrap { aspect-ratio: 16/9; border-radius: 14px; overflow: hidden; background: #000; margin-bottom: 16px; position: relative; }
        .vc-video-wrap video { width: 100%; height: 100%; object-fit: cover; }
        .vc-video-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
        .vc-lec-info-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .vc-lec-info-sub { font-size: 12px; color: rgba(255,255,255,.35); }

        /* Review section */
        .vc-divider { height: 1px; background: rgba(255,255,255,.06); margin: 20px 0; }
        .vc-review-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 14px; }
        .vc-star-input { font-size: 22px; cursor: pointer; transition: transform .1s; color: rgba(255,255,255,.15); }
        .vc-star-input.active { color: #f59e0b; }
        .vc-star-input:hover { transform: scale(1.2); }
        .vc-review-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.35); text-transform: uppercase; letter-spacing: .8px; margin-bottom: 7px; }
        .vc-textarea { width: 100%; padding: 12px 14px; border-radius: 10px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); color: #fff; font-size: 13px; font-family: 'DM Sans', sans-serif; resize: none; outline: none; transition: border-color .2s; box-sizing: border-box; height: 90px; line-height: 1.6; }
        .vc-textarea:focus { border-color: #10b981; }
        .vc-textarea::placeholder { color: rgba(255,255,255,.2); }
        .vc-submit-btn { padding: 10px 22px; border-radius: 10px; background: #10b981; border: none; color: #07090f; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .2s; }
        .vc-submit-btn:hover:not(:disabled) { background: #0ea472; }
        .vc-submit-btn:disabled { background: rgba(255,255,255,.08); color: rgba(255,255,255,.25); cursor: not-allowed; }

        /* Info panels */
        .vc-two-panels { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
        @media(max-width:640px){ .vc-two-panels { grid-template-columns: 1fr; } }
        .vc-info-panel { background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); border-radius: 16px; padding: 20px; }
        .vc-info-panel-title { font-size: 13px; font-weight: 700; color: rgba(255,255,255,.6); margin-bottom: 12px; }
        .vc-info-list { display: flex; flex-direction: column; gap: 8px; }
        .vc-info-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,.45); }
        .vc-info-bullet { width: 5px; height: 5px; border-radius: 50%; background: #10b981; flex-shrink: 0; }

        /* Creator */
        .vc-creator-card { background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); border-radius: 18px; padding: 22px; margin-bottom: 20px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .vc-creator-avatar { width: 54px; height: 54px; border-radius: 12px; object-fit: cover; border: 1px solid rgba(255,255,255,.1); flex-shrink: 0; }
        .vc-creator-avatar-placeholder { width: 54px; height: 54px; border-radius: 12px; background: rgba(16,185,129,.12); border: 1px solid rgba(16,185,129,.2); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #10b981; flex-shrink: 0; }
        .vc-creator-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 3px; }
        .vc-creator-desc { font-size: 12px; color: rgba(255,255,255,.35); line-height: 1.5; }

        /* More courses */
        .vc-section-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 16px; }
        .vc-section-title em { color: #10b981; font-style: italic; }
        .vc-courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
      `}</style>

      <div className="vc-root">
        <div className="vc-glow1" /><div className="vc-glow2" /><div className="vc-grid" />

        <div className="vc-inner">

          {/* Back */}
          <button className="vc-back" onClick={() => navigate("/")}>
            <FaArrowLeftLong size={11} /> Back to Home
          </button>

          {/* Hero */}
          <div className="vc-hero">
            <div className="vc-thumb-wrap">
              <img src={selectedCourse.thumbnail || img} alt={selectedCourse.title} />
              <div className="vc-cat-badge">{selectedCourse.category}</div>
            </div>

            <div className="vc-info">
              <div className="vc-eyebrow">{selectedCourse.level || "Course"}</div>
              <h1 className="vc-course-title">{selectedCourse.title}</h1>
              {selectedCourse.subTitle && <p className="vc-subtitle">{selectedCourse.subTitle}</p>}

              {/* Rating */}
              <div className="vc-rating-row">
                <div className="vc-stars">
                  {[1,2,3,4,5].map(s => (
                    <FaStar key={s} className={s <= Math.round(avgRating) ? "vc-star" : "vc-star-empty"} />
                  ))}
                </div>
                <span className="vc-rating-num">{avgRating || "—"}</span>
                <span className="vc-review-count">({reviewsData.length} reviews)</span>
              </div>

              {/* Price */}
              {selectedCourse.price ? (
                <div className="vc-price-row">
                  <span className="vc-price">₹{selectedCourse.price}</span>
                  <span className="vc-price-old">₹{Math.round(selectedCourse.price * 1.5)}</span>
                  <span className="vc-save-badge">33% off</span>
                </div>
              ) : (
                <span className="vc-save-badge" style={{ width: "fit-content" }}>Free</span>
              )}

              {/* Features */}
              <div className="vc-features">
                {[
                  { color: "#10b981", text: "Lifetime access to course materials" },
                  { color: "#6366f1", text: `${totalLectures} comprehensive lectures` },
                  { color: "#f59e0b", text: "Certificate of completion" },
                ].map((f, i) => (
                  <div className="vc-feature" key={i}>
                    <div className="vc-feature-dot" style={{ background: f.color }} />
                    {f.text}
                  </div>
                ))}
              </div>

              {/* CTA */}
              {isEnrolled ? (
                <button className="vc-continue-btn" onClick={() => navigate(`/viewlecture/${courseId}`)}>
                  <FaPlayCircle size={14} /> Continue Learning
                </button>
              ) : (
                <button className="vc-enroll-btn" onClick={handleEnroll}>
                  {selectedCourse.price ? `Enroll Now — ₹${selectedCourse.price}` : "Enroll for Free"}
                </button>
              )}
            </div>
          </div>

          {/* Progress bar (only if enrolled and watched any) */}
          {isEnrolled && totalLectures > 0 && (
            <div className="vc-progress-card">
              <div className="vc-progress-top">
                <span className="vc-progress-label">Your Progress</span>
                <span className="vc-progress-pct">{progressPct}%</span>
              </div>
              <div className="vc-progress-track">
                <div className="vc-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="vc-progress-sub">
                {completedCount} of {totalLectures} lectures completed
                {completedCount === totalLectures && totalLectures > 0 && " 🎉 Course Complete!"}
              </div>
            </div>
          )}

          {/* Curriculum + Video */}
          <div className="vc-main">

            {/* Curriculum */}
            <div className="vc-card">
              <div className="vc-card-title">Curriculum</div>
              <div className="vc-card-sub">
                {totalLectures} lecture{totalLectures !== 1 ? "s" : ""}
                {totalLectures > 0 && selectedCourse.lectures?.some(l => l.isPreviewFree) &&
                  ` • ${selectedCourse.lectures.filter(l => l.isPreviewFree).length} free preview`}
              </div>

              <div className="vc-lec-list">
                {totalLectures > 0 ? selectedCourse.lectures.map((lec, i) => {
                  const isActive   = selectedLecture?._id === lec._id;
                  const accessible = lec.isPreviewFree || isEnrolled;
                  const watched    = watchedLectures[lec._id];
                  return (
                    <div
                      key={lec._id}
                      className={`vc-lec-item${isActive ? " active" : ""}${!accessible ? " locked" : ""}`}
                      onClick={() => handleLectureSelect(lec)}
                    >
                      <div className={`vc-lec-num ${isActive ? "vc-lec-num-active" : !accessible ? "vc-lec-num-locked" : "vc-lec-num-default"}`}>
                        {!accessible ? <FaLock size={9} /> : <FaPlayCircle size={10} />}
                      </div>
                      <span className={`vc-lec-name${isActive ? " active" : ""}`}>
                        {i + 1}. {lec.lectureTitle || "Untitled Lecture"}
                      </span>
                      {lec.isPreviewFree && !isEnrolled && <span className="vc-free-pill">Preview</span>}
                      {watched && (
                        <div className="vc-lec-tick" title="Completed">
                          <FaCheckCircle size={11} color="#10b981" />
                        </div>
                      )}
                    </div>
                  );
                }) : (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,.2)", fontSize: 13 }}>
                    No lectures available yet
                  </div>
                )}
              </div>
            </div>

            {/* Video + Review */}
            <div className="vc-card">
              {/* Video */}
              <div className="vc-video-wrap">
                {selectedLecture?.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={selectedLecture.videoUrl}
                    controls
                    autoPlay={false}
                    onTimeUpdate={handleVideoTimeUpdate}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <div className="vc-video-placeholder">
                    <FaPlayCircle size={48} color="rgba(255,255,255,.15)" />
                    <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                      {selectedLecture
                        ? selectedLecture.isPreviewFree ? "Preview video coming soon" : isEnrolled ? "Video being prepared" : "Enroll to access"
                        : "Select a lecture to preview"}
                    </p>
                  </div>
                )}
              </div>

              {/* Lecture title */}
              {selectedLecture && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <h3 className="vc-lec-info-title">{selectedLecture.lectureTitle}</h3>
                    {watchedLectures[selectedLecture._id] && (
                      <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.25)", padding: "3px 10px", borderRadius: 100 }}>
                        <FaCheckCircle size={11} color="#10b981" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", fontFamily: "'DM Sans', sans-serif" }}>Completed</span>
                      </div>
                    )}
                  </div>
                  {selectedLecture.isPreviewFree && !isEnrolled && (
                    <p className="vc-lec-info-sub">✦ Free preview — enroll to unlock all lectures</p>
                  )}
                </div>
              )}

              <div className="vc-divider" />

              {/* Review form */}
              <div className="vc-review-title">Leave a <em style={{ color: "#10b981", fontStyle: "italic" }}>review</em></div>

              <div style={{ marginBottom: 14 }}>
                <div className="vc-review-label">Rating</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1,2,3,4,5].map(s => (
                    <FaStar
                      key={s}
                      className={`vc-star-input${rating >= s ? " active" : ""}`}
                      onClick={() => setRating(s)}
                    />
                  ))}
                  {rating > 0 && <span style={{ fontSize: 12, color: "rgba(255,255,255,.3)", marginLeft: 6, alignSelf: "center" }}>{rating}/5</span>}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div className="vc-review-label">Comment</div>
                <textarea
                  className="vc-textarea"
                  placeholder="Share your thoughts about this course..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
              </div>

              <button
                className="vc-submit-btn"
                onClick={handleSubmitReview}
                disabled={!rating || !comment.trim()}
              >
                Submit Review
              </button>
            </div>
          </div>

          {/* Info panels */}
          <div className="vc-two-panels">
            <div className="vc-info-panel">
              <div className="vc-info-panel-title">What you'll learn</div>
              <div className="vc-info-list">
                {[
                  `Master ${selectedCourse.category} from beginner to advanced`,
                  "Build real-world projects",
                  "Learn industry best practices",
                ].map((item, i) => (
                  <div className="vc-info-item" key={i}>
                    <div className="vc-info-bullet" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="vc-info-panel">
              <div className="vc-info-panel-title">This course is for</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.45)", lineHeight: 1.7 }}>
                Beginners, aspiring developers, and professionals looking to upgrade their skills in {selectedCourse.category}.
              </div>
            </div>
          </div>

          {/* Creator */}
          {creatorData && (
            <div className="vc-creator-card">
              {creatorData.photoUrl ? (
                <img src={creatorData.photoUrl} alt={creatorData.name} className="vc-creator-avatar" />
              ) : (
                <div className="vc-creator-avatar-placeholder">
                  {creatorData.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <div>
                <div className="vc-creator-name">{creatorData.name || "Instructor"}</div>
                {creatorData.description && <div className="vc-creator-desc">{creatorData.description}</div>}
                {creatorData.email && <div style={{ fontSize: 11, color: "rgba(255,255,255,.2)", marginTop: 2 }}>{creatorData.email}</div>}
              </div>
            </div>
          )}

          {/* More courses */}
          {creatorCourses.length > 0 && (
            <div>
              <div className="vc-section-title">
                More by <em>{creatorData?.name || "this instructor"}</em>
              </div>
              <div className="vc-courses-grid">
                {creatorCourses.map((course, i) => (
                  <Card key={course._id} thumbnail={course.thumbnail} id={course._id} price={course.price} title={course.title} category={course.category} index={i} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ViewCourse;