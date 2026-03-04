import React from 'react'
import { FaPlus, FaEdit } from 'react-icons/fa'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useCreatorCourses from '../../customHooks/getCreatorCourse'
import img from '../../assets/empty.jpg'

const Courses = () => {
  useCreatorCourses()
  const navigate = useNavigate()
  const { creatorCourseData } = useSelector(state => state.course)
  const count = creatorCourseData?.length || 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .co-root { min-height: 100vh; background: #07090f; font-family: 'DM Sans', sans-serif; position: relative; overflow-x: hidden; padding: 48px 28px 72px; }
        .co-glow1 { position: fixed; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,.06) 0%, transparent 70%); top: -150px; right: -150px; pointer-events: none; z-index: 0; }
        .co-glow2 { position: fixed; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,.05) 0%, transparent 70%); bottom: -100px; left: -100px; pointer-events: none; z-index: 0; }
        .co-grid { position: fixed; inset: 0; opacity: .022; pointer-events: none; z-index: 0; background-image: linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px); background-size: 56px 56px; }

        .co-inner { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; }

        /* Top row */
        .co-toprow { display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; flex-wrap: wrap; gap: 16px; }
        .co-topleft { display: flex; align-items: center; gap: 16px; }
        .co-back { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 8px 14px; color: rgba(255,255,255,.45); font-size: 12px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .co-back:hover { color: #fff; background: rgba(255,255,255,.09); border-color: rgba(255,255,255,.2); }
        .co-eyebrow { font-size: 11px; font-weight: 700; color: #10b981; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px; }
        .co-title { font-family: 'Playfair Display', serif; font-size: clamp(22px, 2.5vw, 30px); font-weight: 700; color: #fff; margin: 0; line-height: 1.2; }
        .co-title em { color: #10b981; font-style: italic; }

        .co-btn-primary { padding: 10px 20px; border-radius: 10px; background: #10b981; border: none; color: #07090f; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 7px; transition: background .2s, transform .15s, box-shadow .2s; }
        .co-btn-primary:hover { background: #0ea472; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(16,185,129,.28); }

        .co-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 20px; overflow: hidden; }

        /* Table */
        .co-table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: rgba(255,255,255,.025); border-bottom: 1px solid rgba(255,255,255,.06); }
        th { padding: 13px 20px; text-align: left; font-size: 10px; font-weight: 700; color: rgba(255,255,255,.3); text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; }
        td { padding: 14px 20px; border-top: 1px solid rgba(255,255,255,.05); font-size: 13px; color: rgba(255,255,255,.65); vertical-align: middle; }
        tbody tr:hover td { background: rgba(255,255,255,.02); }

        .co-thumb { width: 52px; height: 34px; border-radius: 7px; object-fit: cover; border: 1px solid rgba(255,255,255,.1); flex-shrink: 0; }
        .co-course-name { font-weight: 600; color: #fff; font-size: 13px; }
        .co-price { font-weight: 700; color: #10b981; font-size: 13px; }
        .co-price-na { color: rgba(255,255,255,.25); font-size: 13px; }

        .co-pill { padding: 3px 10px; border-radius: 100px; font-size: 10px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
        .co-pill-published { background: rgba(16,185,129,.1); color: #10b981; border: 1px solid rgba(16,185,129,.2); }
        .co-pill-draft { background: rgba(245,158,11,.1); color: #f59e0b; border: 1px solid rgba(245,158,11,.2); }

        .co-edit-btn { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .2s; color: rgba(255,255,255,.4); }
        .co-edit-btn:hover { background: rgba(16,185,129,.1); border-color: rgba(16,185,129,.25); color: #10b981; }

        /* Mobile cards */
        .co-mobile-list { display: flex; flex-direction: column; gap: 10px; }
        .co-mobile-card { background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; transition: border-color .2s; }
        .co-mobile-card:hover { border-color: rgba(16,185,129,.2); }
        .co-mobile-info { flex: 1; }
        .co-mobile-name { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 4px; }
        .co-mobile-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

        /* Empty state */
        .co-empty { text-align: center; padding: 56px 24px; }
        .co-empty-icon { font-size: 36px; opacity: .2; margin-bottom: 12px; }
        .co-empty-title { font-family: 'Playfair Display', serif; font-size: 18px; color: rgba(255,255,255,.25); margin-bottom: 6px; }
        .co-empty-sub { font-size: 12px; color: rgba(255,255,255,.15); margin-bottom: 20px; }

        @media (max-width: 700px) { .co-desktop { display: none !important; } }
        @media (min-width: 701px) { .co-mobile { display: none !important; } }
      `}</style>

      <div className="co-root">
        <div className="co-glow1" /><div className="co-glow2" /><div className="co-grid" />

        <div className="co-inner">

          {/* Top row */}
          <div className="co-toprow">
            <div className="co-topleft">
              <button className="co-back" onClick={() => navigate('/dashboard')}>
                <FaArrowLeftLong size={11} /> Dashboard
              </button>
              <div>
                <div className="co-eyebrow">Educator</div>
                <h1 className="co-title">My <em>Courses</em></h1>
              </div>
            </div>
            <button className="co-btn-primary" onClick={() => navigate('/create-course')}>
              <FaPlus size={11} /> Create Course
            </button>
          </div>

          {/* Desktop Table */}
          <div className="co-card co-desktop">
            {count === 0 ? (
              <div className="co-empty">
                <div className="co-empty-icon">📚</div>
                <div className="co-empty-title">No courses yet</div>
                <div className="co-empty-sub">Create your first course to get started</div>
                <button className="co-btn-primary" style={{ margin: '0 auto' }} onClick={() => navigate('/create-course')}>
                  <FaPlus size={11} /> Create Course
                </button>
              </div>
            ) : (
              <div className="co-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {creatorCourseData.map((course, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img
                              src={course?.thumbnail || img}
                              alt={course?.title}
                              className="co-thumb"
                            />
                            <span className="co-course-name">{course?.title}</span>
                          </div>
                        </td>
                        <td>
                          {course?.price
                            ? <span className="co-price">₹{course.price}</span>
                            : <span className="co-price-na">—</span>
                          }
                        </td>
                        <td>
                          <span className={`co-pill ${course.isPublished ? 'co-pill-published' : 'co-pill-draft'}`}>
                            {course.isPublished ? '● Published' : '● Draft'}
                          </span>
                        </td>
                        <td>
                          <button className="co-edit-btn" onClick={() => navigate(`/editcourse/${course?._id}`)}>
                            <FaEdit size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="co-mobile">
            {count === 0 ? (
              <div className="co-card">
                <div className="co-empty">
                  <div className="co-empty-icon">📚</div>
                  <div className="co-empty-title">No courses yet</div>
                  <div className="co-empty-sub">Create your first course to get started</div>
                  <button className="co-btn-primary" style={{ margin: '0 auto' }} onClick={() => navigate('/create-course')}>
                    <FaPlus size={11} /> Create Course
                  </button>
                </div>
              </div>
            ) : (
              <div className="co-mobile-list">
                {creatorCourseData.map((course, i) => (
                  <div className="co-mobile-card" key={i}>
                    <img src={course?.thumbnail || img} alt={course?.title} className="co-thumb" style={{ width: 56, height: 40 }} />
                    <div className="co-mobile-info">
                      <div className="co-mobile-name">{course?.title}</div>
                      <div className="co-mobile-meta">
                        <span className={`co-pill ${course.isPublished ? 'co-pill-published' : 'co-pill-draft'}`}>
                          {course.isPublished ? '● Published' : '● Draft'}
                        </span>
                        {course?.price
                          ? <span className="co-price">₹{course.price}</span>
                          : <span className="co-price-na" style={{ fontSize: 11 }}>No price</span>
                        }
                      </div>
                    </div>
                    <button className="co-edit-btn" onClick={() => navigate(`/editcourse/${course?._id}`)}>
                      <FaEdit size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export default Courses