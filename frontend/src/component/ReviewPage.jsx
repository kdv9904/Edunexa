import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReviewCard from './ReviewCard';
import useGetAllReviews from '../customHooks/getAllReviews';

const ReviewPage = () => {
  useGetAllReviews();
  const { reviewData } = useSelector(state => state.review);
  const [latestReview, setLatestReview] = useState([]);

  useEffect(() => {
    if (Array.isArray(reviewData) && reviewData.length > 0) {
      setLatestReview(reviewData.slice(0, 6));
    }
  }, [reviewData]);

  return (
    <>
      <style>{`
        .rp-root {
          background: #07090f;
          padding: 30px 24px;
          font-family: 'DM Sans', sans-serif;
        }
        .rp-inner { max-width: 1160px; margin: 0 auto; }

        /* Header */
        .rp-header {
          display: flex; align-items: flex-end;
          justify-content: space-between; gap: 24px;
          flex-wrap: wrap; margin-bottom: 40px;
        }
        .rp-eyebrow {
          font-size: 11px; font-weight: 600; color: #10b981;
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;
        }
        .rp-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 3.5vw, 40px); font-weight: 700;
          color: #fff; line-height: 1.15;
        }
        .rp-title em { color: #10b981; font-style: italic; }
        .rp-sub { font-size: 13.5px; color: rgba(255,255,255,.35); margin-top: 8px; }

        /* Grid */
        .rp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        /* Review card wrapper */
        .rp-card {
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 18px; overflow: hidden;
          transition: border-color .3s, transform .3s;
        }
        .rp-card:hover {
          border-color: rgba(16,185,129,.25);
          transform: translateY(-4px);
        }

        /* Empty state */
        .rp-empty {
          text-align: center; padding: 80px 24px;
          border: 1px solid rgba(255,255,255,.06); border-radius: 20px;
          background: rgba(255,255,255,.02);
        }
        .rp-empty-icon { font-size: 40px; opacity: .3; margin-bottom: 14px; }
        .rp-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px; color: rgba(255,255,255,.4); margin-bottom: 6px;
        }
        .rp-empty-sub { font-size: 13px; color: rgba(255,255,255,.2); }
      `}</style>

      <div className="rp-root">
        <div className="rp-inner">

          {/* Header */}
          <div className="rp-header">
            <div>
              <div className="rp-eyebrow">Student Reviews</div>
              <h2 className="rp-title">Real words from<br /><em>real learners.</em></h2>
              <p className="rp-sub">Authentic feedback from students who've transformed their skills.</p>
            </div>
          </div>

          {/* Reviews */}
          {latestReview.length === 0 ? (
            <div className="rp-empty">
              <div className="rp-empty-icon">💬</div>
              <div className="rp-empty-title">No reviews yet</div>
              <div className="rp-empty-sub">Be the first to share your experience.</div>
            </div>
          ) : (
            <div className="rp-grid">
              {latestReview.map((review, index) => (
                <div className="rp-card" key={review._id || index}>
                  <ReviewCard
                    comment={review.comment}
                    rating={review.rating}
                    photoUrl={review.user?.photoUrl}
                    name={review.user?.name}
                    description={review.user?.description}
                    courseTitle={review.course?.title}
                    reviewedAt={review.reviewedAt}
                  />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default ReviewPage;