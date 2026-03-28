import React, { useState, useEffect } from "react";
import { FaStar, FaUsers, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";

const ACCENTS = [
  "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b",
  "#ec4899", "#6366f1", "#ef4444", "#14b8a6"
];

function Card({ thumbnail, title, category, price, id, index }) {
  const [courseRating, setCourseRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const accent = ACCENTS[index % ACCENTS.length];

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!userData?.user?._id || !id) return;
      try {
        const localCheck = userData?.enrolledCourse?.some(
          c => (typeof c === 'string' ? c : c._id).toString() === id.toString()
        );
        if (localCheck) { setIsEnrolled(true); return; }
        const res = await axios.post(`${serverUrl}/api/payment/check-enrollment`,
          { userId: userData.user._id, courseId: id }, { withCredentials: true });
        if (res.data.success && res.data.isEnrolled) setIsEnrolled(true);
      } catch {
        const fallback = userData?.enrolledCourse?.some(
          c => (typeof c === 'string' ? c : c._id).toString() === id.toString()
        );
        setIsEnrolled(fallback || false);
      }
    };
    checkEnrollment();
  }, [userData, id]);

  useEffect(() => {
    const fetchRating = async () => {
      if (!id) return;
      try {
        setRatingLoading(true);
        const { data: course } = await axios.get(`${serverUrl}/api/course/getcourse/${id}`, { withCredentials: true });
        if (course?.reviews?.length > 0) {
          let valid = [];
          if (typeof course.reviews[0] === 'object' && course.reviews[0].rating !== undefined) {
            valid = course.reviews.filter(r => typeof r.rating === 'number' && !isNaN(r.rating));
          } else {
            const fetched = await Promise.all(course.reviews.map(async rid => {
              try { const r = await axios.get(`${serverUrl}/api/review/${rid}`, { withCredentials: true }); return r.data.review; }
              catch { return null; }
            }));
            valid = fetched.filter(r => r && typeof r.rating === 'number' && !isNaN(r.rating));
          }
          if (valid.length > 0) {
            setCourseRating(Number((valid.reduce((s, r) => s + r.rating, 0) / valid.length).toFixed(1)));
            setReviewsCount(valid.length);
          }
        }
      } catch { setCourseRating(0);
  setReviewsCount(0); }
      finally { setRatingLoading(false); }
    };
    fetchRating();
  }, [id]);

  const handleClick = () => {
    if (!userData?.user?._id) { toast.error("Please log in to access courses"); navigate("/login"); return; }
    navigate(`/viewcourse/${id}`);
  };

  const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n;
  const discounted = price ? Math.round(price * 1.5) : null;

  return (
    <>
      <style>{`
        .card-root {
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 18px; overflow: hidden;
          cursor: pointer; position: relative;
          transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .card-root:hover {
          transform: translateY(-6px);
          border-color: var(--accent);
          box-shadow: 0 16px 48px rgba(0,0,0,.4), 0 0 0 1px var(--accent);
        }

        /* Thumbnail */
        .card-thumb {
          position: relative; overflow: hidden; height: 176px;
        }
        .card-thumb img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .5s ease;
        }
        .card-root:hover .card-thumb img { transform: scale(1.06); }
        .card-thumb-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 50%);
        }

        /* Play button */
        .card-play {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity .25s;
        }
        .card-root:hover .card-play { opacity: 1; }
        .card-play-circle {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,.95);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: #07090f;
          box-shadow: 0 4px 20px rgba(0,0,0,.3);
          transform: scale(.8); transition: transform .25s;
        }
        .card-root:hover .card-play-circle { transform: scale(1); }

        /* Category badge */
        .card-cat {
          position: absolute; top: 12px; left: 12px;
          padding: 4px 10px; border-radius: 100px;
          font-size: 10px; font-weight: 700; letter-spacing: .5px;
          text-transform: uppercase; color: #fff;
          background: var(--accent);
        }

        /* Enrolled badge */
        .card-enrolled-badge {
          position: absolute; top: 12px; right: 12px;
          padding: 4px 10px; border-radius: 100px;
          font-size: 10px; font-weight: 700;
          background: #10b981; color: #fff;
          letter-spacing: .3px;
        }

        /* Body */
        .card-body { padding: 18px 18px 16px; }

        .card-title {
          font-size: 14px; font-weight: 700; color: #fff;
          line-height: 1.4; margin-bottom: 12px;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }

        /* Meta row */
        .card-meta {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 14px;
        }
        .card-meta-left { display: flex; align-items: center; gap: 12px; }
        .card-meta-item {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; color: rgba(255,255,255,.35);
        }
        .card-meta-item svg { font-size: 10px; }
        .card-rating {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600; color: #f59e0b;
        }
        .card-rating-sub { font-size: 10px; color: rgba(255,255,255,.25); font-weight: 400; }

        /* Divider */
        .card-divider { height: 1px; background: rgba(255,255,255,.06); margin-bottom: 14px; }

        /* Price row */
        .card-price-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 8px;
        }
        .card-prices { display: flex; align-items: baseline; gap: 6px; flex-shrink: 0; }
        .card-price {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #fff;
        }
        .card-price-original {
          font-size: 12px; color: rgba(255,255,255,.25); text-decoration: line-through;
        }
        .card-action {
          padding: 7px 14px; border-radius: 9px;
          font-size: 12px; font-weight: 700; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap; flex-shrink: 0;
          transition: opacity .2s, transform .15s;
        }
        .card-action:hover { opacity: .88; transform: translateY(-1px); }
        .card-action.enrolled { background: #10b981; color: #fff; }
        .card-action.view { background: var(--accent); color: #fff; }
      `}</style>

      <div
        className="card-root"
        style={{ '--accent': accent }}
        onClick={handleClick}
      >
        {/* Thumbnail */}
        <div className="card-thumb">
          <img src={thumbnail || "/fallback.jpg"} alt={title} />
          <div className="card-thumb-overlay" />
          <div className="card-play">
            <div className="card-play-circle">▶</div>
          </div>
          <span className="card-cat">{category || "General"}</span>
          {isEnrolled && <span className="card-enrolled-badge">✓ Enrolled</span>}
        </div>

        {/* Body */}
        <div className="card-body">
          <div className="card-title">{title}</div>

          <div className="card-meta">
            <div className="card-meta-left">
              <div className="card-meta-item">
                <FaUsers /><span>{fmt(1200)}</span>
              </div>
              <div className="card-meta-item">
                <FaClock /><span>8h</span>
              </div>
            </div>
            <div className="card-rating">
              <FaStar size={10} />
              {ratingLoading
                ? <span style={{ color: 'rgba(255,255,255,.2)', fontWeight: 400 }}>—</span>
                : courseRating > 0
                  ? <><span>{courseRating}</span><span className="card-rating-sub">({fmt(reviewsCount)})</span></>
                  : <span style={{ fontSize: 10, color: 'rgba(255,255,255,.25)', fontWeight: 400 }}>No ratings</span>
              }
            </div>
          </div>

          <div className="card-divider" />

          <div className="card-price-row">
            <div className="card-prices">
              <span className="card-price">{price ? `₹${price}` : "Free"}</span>
              {discounted && <span className="card-price-original">₹{discounted}</span>}
            </div>
            <button className={`card-action ${isEnrolled ? 'enrolled' : 'view'}`}>
              {isEnrolled ? "✓ Enrolled" : "View Course"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;