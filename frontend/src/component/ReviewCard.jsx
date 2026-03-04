import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const ReviewCard = ({
  comment,
  rating,
  photoUrl,
  name,
  description,
  courseTitle,
  reviewedAt
}) => {
  const r = rating || 0;
  const displayName = name || "Anonymous";
  const displayComment = comment || "No comment provided.";
  const displayCourse = courseTitle || "Unknown Course";
  const displayRole = description || "Student";

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <>
      <style>{`
        .rc-root {
          padding: 18px 18px 20px;
          font-family: 'DM Sans', sans-serif;
          display: flex; flex-direction: column; gap: 14px;
        }

        /* Top row: stars + date */
        .rc-top {
          display: flex; align-items: center; justify-content: space-between;
        }
        .rc-stars { display: flex; align-items: center; gap: 2px; }
        .rc-star-filled { color: #f59e0b; font-size: 13px; }
        .rc-star-empty  { color: rgba(255,255,255,.15); font-size: 13px; }
        .rc-date { font-size: 11px; color: rgba(255,255,255,.25); }

        /* Course pill */
        .rc-course {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.2);
          padding: 4px 12px; border-radius: 100px;
          font-size: 11px; font-weight: 600; color: #10b981;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 100%;
        }
        .rc-course-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; flex-shrink: 0; }

        /* Comment */
        .rc-comment {
          font-size: 13.5px; color: rgba(255,255,255,.6);
          line-height: 1.75; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 4;
          -webkit-box-orient: vertical; overflow: hidden;
        }

        /* Divider */
        .rc-divider { height: 1px; background: rgba(255,255,255,.06); }

        /* Author */
        .rc-author { display: flex; align-items: center; gap: 12px; }
        .rc-avatar-wrap { position: relative; flex-shrink: 0; }
        .rc-avatar {
          width: 38px; height: 38px; border-radius: 50%; object-fit: cover;
          border: 1.5px solid rgba(255,255,255,.1);
        }
        .rc-avatar-fallback {
          width: 38px; height: 38px; border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #6366f1);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: #fff;
          border: 1.5px solid rgba(255,255,255,.1);
        }
        .rc-author-name {
          font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px;
        }
        .rc-author-role { font-size: 11px; color: rgba(255,255,255,.3); }
      `}</style>

      <div className="rc-root">

        {/* Stars + date */}
        <div className="rc-top">
          <div className="rc-stars">
            {[1,2,3,4,5].map(s => (
              <span key={s}>
                {s <= r
                  ? <FaStar className="rc-star-filled" />
                  : <FaRegStar className="rc-star-empty" />
                }
              </span>
            ))}
          </div>
          {reviewedAt && <span className="rc-date">{formatDate(reviewedAt)}</span>}
        </div>

        {/* Course */}
        <div className="rc-course">
          <div className="rc-course-dot" />
          <span>{displayCourse}</span>
        </div>

        {/* Comment */}
        <p className="rc-comment">"{displayComment}"</p>

        <div className="rc-divider" />

        {/* Author */}
        <div className="rc-author">
          <div className="rc-avatar-wrap">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={displayName}
                className="rc-avatar"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <div
              className="rc-avatar-fallback"
              style={{ display: photoUrl ? 'none' : 'flex' }}
            >
              {displayName[0].toUpperCase()}
            </div>
          </div>
          <div>
            <div className="rc-author-name">{displayName}</div>
            <div className="rc-author-role">{displayRole}</div>
          </div>
        </div>

      </div>
    </>
  );
};

export default ReviewCard;