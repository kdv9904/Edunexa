import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

const CardPage = () => {
  const { creatorCourseData } = useSelector((state) => state.course);
  const [popularCourses, setPopularCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const published = creatorCourseData
      .filter((course) => course.isPublished)
      .slice(0, 8);
    setPopularCourses(published);
  }, [creatorCourseData]);

  return (
    <>
      <style>{`
        .cp-root {
          background: #0a0d16;
          padding: 30px 24px;
          font-family: 'DM Sans', sans-serif;
        }
        .cp-inner { max-width: 1160px; margin: 0 auto; }

        /* Header */
        .cp-header {
          display: flex; flex-direction: column; gap: 6px;
          align-items: flex-start; margin-bottom: 40px;
        }
        @media (min-width: 700px) {
          .cp-header { flex-direction: row; align-items: flex-end; justify-content: space-between; }
        }
        .cp-eyebrow {
          font-size: 11px; font-weight: 600; color: #10b981;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;
        }
        .cp-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 3.5vw, 40px); font-weight: 700;
          color: #fff; line-height: 1.15;
        }
        .cp-title em { color: #10b981; font-style: italic; }
        .cp-sub { font-size: 13.5px; color: rgba(255,255,255,.35); margin-top: 8px; }

        .cp-browse-btn {
          flex-shrink: 0; margin-top: 16px;
          padding: 11px 24px; border-radius: 12px;
          background: rgba(255,255,255,.05); border: 1.5px solid rgba(255,255,255,.1);
          color: rgba(255,255,255,.6); font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: border-color .2s, color .2s, background .2s;
          white-space: nowrap;
        }
        .cp-browse-btn:hover { border-color: #10b981; color: #10b981; background: rgba(16,185,129,.05); }

        /* Grid */
        .cp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        /* Empty state */
        .cp-empty {
          text-align: center; padding: 80px 24px;
          border: 1px solid rgba(255,255,255,.07); border-radius: 20px;
          background: rgba(255,255,255,.02);
        }
        .cp-empty-icon {
          font-size: 48px; margin-bottom: 16px; opacity: .3;
        }
        .cp-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; color: rgba(255,255,255,.5); margin-bottom: 8px;
        }
        .cp-empty-sub { font-size: 13px; color: rgba(255,255,255,.25); }

        /* Bottom */
        .cp-bottom {
          margin-top: 44px; display: flex;
          align-items: center; justify-content: center; gap: 16px;
          flex-wrap: wrap;
        }
        .cp-count { font-size: 12px; color: rgba(255,255,255,.25); }
        .cp-load-btn {
          padding: 11px 28px; border-radius: 12px;
          background: transparent; border: 1.5px solid rgba(255,255,255,.1);
          color: rgba(255,255,255,.5); font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: border-color .2s, color .2s, background .2s;
        }
        .cp-load-btn:hover { border-color: #10b981; color: #10b981; background: rgba(16,185,129,.05); }
      `}</style>

      <div className="cp-root">
        <div className="cp-inner">

          {/* Header */}
          <div className="cp-header">
            <div>
              <div className="cp-eyebrow">Featured Courses</div>
              <h2 className="cp-title">Most <em>popular</em> right now.</h2>
              <p className="cp-sub">Handpicked top-rated courses loved by thousands of learners.</p>
            </div>
            <button className="cp-browse-btn" onClick={() => navigate("/allcourses")}>
              View all courses <span style={{ fontSize: 15 }}>→</span>
            </button>
          </div>

          {/* Courses */}
          {popularCourses.length > 0 ? (
            <div className="cp-grid">
              {popularCourses.map((course, index) => (
                <Card
                  key={course._id}
                  thumbnail={course.thumbnail}
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  id={course._id}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="cp-empty">
              <div className="cp-empty-icon">📚</div>
              <div className="cp-empty-title">Courses coming soon</div>
              <div className="cp-empty-sub">We're preparing amazing content. Check back shortly.</div>
            </div>
          )}

          {/* Bottom */}
          {popularCourses.length > 0 && (
            <div className="cp-bottom">
              <span className="cp-count">Showing {popularCourses.length} courses</span>
              <button className="cp-load-btn" onClick={() => navigate("/allcourses")}>
                Browse all courses
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default CardPage;