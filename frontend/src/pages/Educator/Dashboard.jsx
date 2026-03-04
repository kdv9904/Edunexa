import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Line, Bar } from 'react-chartjs-2';
import { FaChartLine, FaUsers, FaEdit, FaBook, FaStar, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS, LinearScale, CategoryScale, BarElement,
  PointElement, LineElement, Tooltip, Legend
} from "chart.js";

ChartJS.register(LinearScale, CategoryScale, BarElement, PointElement, LineElement, Tooltip, Legend);

const Dashboard = () => {
  const { userData } = useSelector(state => state.user);
  const [courses, setCourses]           = useState([]);
  const [enrollments, setEnrollments]   = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.user?._id) { toast.error('Please log in as an educator'); return; }
      try {
        setLoading(true);
        const res = await axios.get(`${serverUrl}/api/course/getcreator`, { withCredentials: true });
        const coursesData = Array.isArray(res.data?.courses) ? res.data.courses : Array.isArray(res.data) ? res.data : [];

        const withRatings = await Promise.all(coursesData.map(async (course) => {
          try {
            const detail = await axios.get(`${serverUrl}/api/course/getcourse/${course._id}`, { withCredentials: true });
            const d = detail.data;
            let rating = 0, count = 0;
            if (d?.reviews?.length > 0) {
              let valid = [];
              if (typeof d.reviews[0] === 'object' && d.reviews[0].rating !== undefined) {
                valid = d.reviews.filter(r => typeof r.rating === 'number' && !isNaN(r.rating));
              } else {
                const fetched = await Promise.all(d.reviews.map(async id => {
                  try { const r = await axios.get(`${serverUrl}/api/review/${id}`, { withCredentials: true }); return r.data.review; }
                  catch { return null; }
                }));
                valid = fetched.filter(r => r && typeof r.rating === 'number' && !isNaN(r.rating));
              }
              if (valid.length > 0) {
                rating = Number((valid.reduce((s, r) => s + r.rating, 0) / valid.length).toFixed(1));
                count = valid.length;
              }
            }
            return { ...course, averageRating: rating, reviewsCount: count, enrollments: course.enrolledStudents?.length || course.enrollments || 0 };
          } catch {
            return { ...course, averageRating: 0, reviewsCount: 0, enrollments: course.enrolledStudents?.length || course.enrollments || 0 };
          }
        }));

        setCourses(withRatings);
        setEnrollments(withRatings.reduce((s, c) => s + c.enrollments, 0));
        const rated = withRatings.filter(c => c.averageRating > 0);
        setAverageRating(rated.length > 0 ? parseFloat((rated.reduce((s, c) => s + c.averageRating, 0) / rated.length).toFixed(1)) : 0);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userData]);

  const filtered = courses.filter(c => filter === 'active' ? c.isPublished : filter === 'draft' ? !c.isPublished : true);

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: 'rgba(255,255,255,.4)', font: { size: 11, family: 'DM Sans' } } } },
    scales: {
      y: { beginAtZero: true, ticks: { color: 'rgba(255,255,255,.3)', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,.05)' }, border: { color: 'transparent' } },
      x: { ticks: { color: 'rgba(255,255,255,.3)', font: { size: 11 }, maxRotation: 30 }, grid: { color: 'rgba(255,255,255,.05)' }, border: { color: 'transparent' } },
    },
  };

  const lineData = {
    labels: filtered.map(c => c.title?.length > 18 ? c.title.slice(0, 18) + '…' : c.title),
    datasets: [{ label: 'Enrollments', data: filtered.map(c => c.enrollments), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.08)', tension: 0.4, borderWidth: 2, pointBackgroundColor: '#10b981', pointBorderColor: '#07090f', pointBorderWidth: 2, pointRadius: 5 }],
  };

  const barData = {
    labels: filtered.map(c => c.title?.length > 18 ? c.title.slice(0, 18) + '…' : c.title),
    datasets: [{ label: 'Rating', data: filtered.map(c => c.averageRating), backgroundColor: filtered.map(c => c.averageRating >= 4 ? 'rgba(16,185,129,.6)' : c.averageRating >= 3 ? 'rgba(99,102,241,.6)' : 'rgba(239,68,68,.6)'), borderColor: filtered.map(c => c.averageRating >= 4 ? '#10b981' : c.averageRating >= 3 ? '#6366f1' : '#ef4444'), borderWidth: 1.5, borderRadius: 6 }],
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#07090f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(16,185,129,.2)', borderTopColor: '#10b981', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 13 }}>Loading dashboard...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .db-root { min-height: 100vh; background: #07090f; font-family: 'DM Sans', sans-serif; position: relative; overflow-x: hidden; }
        .db-glow1 { position: fixed; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,.06) 0%, transparent 70%); top: -150px; right: -150px; pointer-events: none; }
        .db-glow2 { position: fixed; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,.05) 0%, transparent 70%); bottom: -100px; left: -100px; pointer-events: none; }
        .db-grid { position: fixed; inset: 0; opacity: .02; pointer-events: none; background-image: linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px); background-size: 56px 56px; }
        .db-inner { max-width: 1200px; margin: 0 auto; padding: 40px 28px 60px; position: relative; z-index: 1; }

        /* Back + header */
        .db-toprow { display: flex; align-items: center; gap: 20px; margin-bottom: 36px; flex-wrap: wrap; }
        .db-back { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 8px 14px; color: rgba(255,255,255,.45); font-size: 12px; font-weight: 500; cursor: pointer; transition: all .2s; }
        .db-back:hover { color: #fff; background: rgba(255,255,255,.1); }
        .db-eyebrow { font-size: 11px; font-weight: 700; color: #10b981; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
        .db-title { font-family: 'Playfair Display', serif; font-size: clamp(26px, 3vw, 38px); font-weight: 700; color: #fff; line-height: 1.15; margin: 0; }
        .db-title em { color: #10b981; font-style: italic; }

        /* Stat cards */
        .db-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
        @media (max-width: 680px) { .db-stats { grid-template-columns: 1fr; } }
        .db-stat { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 16px; padding: 22px 22px; display: flex; align-items: center; gap: 16px; transition: border-color .2s; }
        .db-stat:hover { border-color: rgba(16,185,129,.2); }
        .db-stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px; }
        .db-stat-label { font-size: 11px; color: rgba(255,255,255,.35); text-transform: uppercase; letter-spacing: .8px; margin-bottom: 4px; }
        .db-stat-value { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #fff; line-height: 1; }

        /* Filter row */
        .db-filter-row { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; flex-wrap: wrap; }
        .db-filter-btn { padding: 7px 18px; border-radius: 100px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.04); color: rgba(255,255,255,.45); font-family: 'DM Sans', sans-serif; transition: all .2s; }
        .db-filter-btn.active { background: rgba(16,185,129,.12); border-color: rgba(16,185,129,.3); color: #10b981; }
        .db-filter-btn:hover:not(.active) { background: rgba(255,255,255,.08); color: #fff; }

        /* Charts */
        .db-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 28px; }
        @media (max-width: 820px) { .db-charts { grid-template-columns: 1fr; } }
        .db-chart-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 16px; padding: 22px; }
        .db-chart-title { font-size: 13px; font-weight: 700; color: rgba(255,255,255,.6); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }

        /* Table card */
        .db-table-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 16px; overflow: hidden; }
        .db-table-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,.06); flex-wrap: wrap; gap: 12px; }
        .db-table-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #fff; }
        .db-btn-primary { padding: 9px 20px; border-radius: 10px; background: #10b981; border: none; color: #07090f; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 7px; transition: background .2s, transform .15s; }
        .db-btn-primary:hover { background: #0ea472; transform: translateY(-1px); }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: rgba(255,255,255,.02); }
        th { padding: 12px 20px; text-align: left; font-size: 10px; font-weight: 700; color: rgba(255,255,255,.3); text-transform: uppercase; letter-spacing: 1px; }
        td { padding: 14px 20px; border-top: 1px solid rgba(255,255,255,.05); font-size: 13px; color: rgba(255,255,255,.7); vertical-align: middle; }
        tbody tr:hover td { background: rgba(255,255,255,.02); }
        .db-course-thumb { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,.1); flex-shrink: 0; }
        .db-course-name { font-weight: 600; color: #fff; font-size: 13px; }
        .db-course-cat { font-size: 11px; color: rgba(255,255,255,.3); margin-top: 2px; }
        .db-pill { padding: 3px 10px; border-radius: 100px; font-size: 10px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
        .db-edit-btn { padding: 7px 14px; border-radius: 8px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.5); font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px; transition: all .2s; }
        .db-edit-btn:hover { border-color: #10b981; color: #10b981; background: rgba(16,185,129,.07); }
        .db-empty { text-align: center; padding: 60px 24px; }
        .db-empty-icon { font-size: 36px; opacity: .2; margin-bottom: 12px; }
        .db-empty-title { font-family: 'Playfair Display', serif; font-size: 18px; color: rgba(255,255,255,.3); margin-bottom: 6px; }
        .db-empty-sub { font-size: 13px; color: rgba(255,255,255,.2); }
      `}</style>

      <div className="db-root">
        <div className="db-glow1" /><div className="db-glow2" /><div className="db-grid" />

        <div className="db-inner">

          {/* Top row */}
          <div className="db-toprow">
            <button className="db-back" onClick={() => navigate('/')}>
              <FaArrowLeft size={11} /> Home
            </button>
            <div>
              <div className="db-eyebrow">Educator</div>
              <h1 className="db-title">Your <em>Dashboard</em></h1>
            </div>
          </div>

          {/* Stats */}
          <div className="db-stats">
            <div className="db-stat">
              <div className="db-stat-icon" style={{ background: 'rgba(16,185,129,.1)' }}>
                <FaBook color="#10b981" />
              </div>
              <div>
                <div className="db-stat-label">Total Courses</div>
                <div className="db-stat-value">{filtered.length}</div>
              </div>
            </div>
            <div className="db-stat">
              <div className="db-stat-icon" style={{ background: 'rgba(99,102,241,.1)' }}>
                <FaUsers color="#6366f1" />
              </div>
              <div>
                <div className="db-stat-label">Enrollments</div>
                <div className="db-stat-value">{enrollments}</div>
              </div>
            </div>
            <div className="db-stat">
              <div className="db-stat-icon" style={{ background: 'rgba(245,158,11,.1)' }}>
                <FaStar color="#f59e0b" />
              </div>
              <div>
                <div className="db-stat-label">Avg Rating</div>
                <div className="db-stat-value">{averageRating > 0 ? `${averageRating}` : '—'}</div>
              </div>
            </div>
          </div>

          {/* Filter pills */}
          <div className="db-filter-row">
            {['all', 'active', 'draft'].map(f => (
              <button key={f} className={`db-filter-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'active' ? 'Published' : 'Drafts'}
              </button>
            ))}
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.25)', marginLeft: 6 }}>{filtered.length} course{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Charts */}
          {filtered.length > 0 && (
            <div className="db-charts">
              <div className="db-chart-card">
                <div className="db-chart-title"><FaChartLine color="#10b981" size={12} /> Enrollment Trends</div>
                <div style={{ height: 220 }}><Line data={lineData} options={chartOptions} /></div>
              </div>
              <div className="db-chart-card">
                <div className="db-chart-title"><FaStar color="#f59e0b" size={12} /> Course Ratings</div>
                <div style={{ height: 220 }}><Bar data={barData} options={{ ...chartOptions, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, max: 5 } } }} /></div>
              </div>
            </div>
          )}

          {/* Course table */}
          <div className="db-table-card">
            <div className="db-table-header">
              <div className="db-table-title">Your Courses</div>
              <button className="db-btn-primary" onClick={() => navigate('/create-course')}>
                <FaBook size={11} /> Create Course
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="db-empty">
                <div className="db-empty-icon">📚</div>
                <div className="db-empty-title">No courses found</div>
                <div className="db-empty-sub">Create your first course to get started.</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Enrolled</th>
                      <th>Rating</th>
                      <th>Reviews</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(course => (
                      <tr key={course._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="db-course-thumb" />}
                            <div>
                              <div className="db-course-name">{course.title}</div>
                              <div className="db-course-cat">{course.category}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="db-pill" style={course.isPublished ? { background: 'rgba(16,185,129,.1)', color: '#10b981', border: '1px solid rgba(16,185,129,.2)' } : { background: 'rgba(245,158,11,.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,.2)' }}>
                            {course.isPublished ? <><FaEye size={9} /> Published</> : <><FaEyeSlash size={9} /> Draft</>}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FaUsers color="#6366f1" size={11} />
                            <span style={{ fontWeight: 600, color: '#fff' }}>{course.enrollments}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FaStar color="#f59e0b" size={11} />
                            <span style={{ fontWeight: 600, color: '#fff' }}>{course.averageRating > 0 ? course.averageRating : '—'}</span>
                          </div>
                        </td>
                        <td style={{ color: 'rgba(255,255,255,.35)' }}>{course.reviewsCount}</td>
                        <td>
                          <button className="db-edit-btn" onClick={() => navigate(`/editcourse/${course._id}`)}>
                            <FaEdit size={11} /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;