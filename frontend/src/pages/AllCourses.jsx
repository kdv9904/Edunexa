import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaBookOpen, FaUsers, FaFire, FaSlidersH } from "react-icons/fa";
import Nav from "../component/Nav";
import Card from "../component/Card";
import usePublishedCourse from "../customHooks/getPublishedCourse";

const AllCourses = () => {
  const navigate = useNavigate();
  const { creatorCourseData: courseData = [] } = useSelector((state) => state.course);
  const [category, setCategory]       = useState([]);
  const [filterCourses, setFilterCourses] = useState([]);
  const [searchTerm, setSearchTerm]   = useState("");
  const [sortBy, setSortBy]           = useState("popular");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  usePublishedCourse();

  const categories = [
    { name: "Web Development",       icon: "🌐" },
    { name: "App Development",       icon: "📱" },
    { name: "Data Science",          icon: "📊" },
    { name: "Machine Learning",      icon: "🤖" },
    { name: "Artificial Intelligence", icon: "🧠" },
    { name: "Cloud Computing",       icon: "☁️" },
    { name: "Cyber Security",        icon: "🔒" },
    { name: "Blockchain",            icon: "⛓️" },
    { name: "Game Development",      icon: "🎮" },
    { name: "UI/UX Design",          icon: "🎨" },
  ];

  useEffect(() => {
    let filtered = [...courseData];
    if (category.length > 0)
      filtered = filtered.filter(c => category.includes(c.category));
    if (searchTerm)
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    switch (sortBy) {
      case "price-low":  filtered.sort((a,b) => (a.price||0) - (b.price||0)); break;
      case "price-high": filtered.sort((a,b) => (b.price||0) - (a.price||0)); break;
      case "newest":     filtered.sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0)); break;
      default:           filtered.sort((a,b) => (b.enrollmentCount||0) - (a.enrollmentCount||0));
    }
    setFilterCourses(filtered);
  }, [category, courseData, searchTerm, sortBy]);

  const toggleCategory = (name) =>
    setCategory(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);

  const clearAll = () => { setCategory([]); setSearchTerm(""); setSortBy("popular"); };

  const hasFilters = category.length > 0 || searchTerm || sortBy !== "popular";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .ac-root { min-height: 100vh; background: #07090f; font-family: 'DM Sans', sans-serif; position: relative; overflow-x: hidden; }
        .ac-glow1 { position: fixed; width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,.05) 0%, transparent 70%); top: -250px; right: -250px; pointer-events: none; z-index: 0; }
        .ac-glow2 { position: fixed; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,.045) 0%, transparent 70%); bottom: -150px; left: -150px; pointer-events: none; z-index: 0; }
        .ac-grid-bg { position: fixed; inset: 0; opacity: .018; pointer-events: none; z-index: 0; background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 56px 56px; }
        .ac-inner { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; padding: 100px 24px 80px; }

        /* ── Header ── */
        .ac-header { text-align: center; margin-bottom: 48px; }
        .ac-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 16px; }
        .ac-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; }
        .ac-title { font-family: 'Playfair Display', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 700; color: #fff; margin: 0 0 14px; line-height: 1.15; }
        .ac-title em { color: #10b981; font-style: italic; }
        .ac-subtitle { font-size: 16px; color: rgba(255,255,255,.38); max-width: 480px; margin: 0 auto 32px; line-height: 1.6; }

        /* ── Search ── */
        .ac-search-wrap { position: relative; max-width: 560px; margin: 0 auto 40px; }
        .ac-search-input { width: 100%; padding: 14px 48px 14px 20px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: 14px; color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .2s, background .2s; }
        .ac-search-input:focus { border-color: rgba(16,185,129,.4); background: rgba(255,255,255,.06); }
        .ac-search-input::placeholder { color: rgba(255,255,255,.2); }
        .ac-search-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,.2); pointer-events: none; }

        /* ── Stats ── */
        .ac-stats { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; }
        .ac-stat { display: flex; align-items: center; gap: 9px; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); border-radius: 100px; padding: 8px 16px; }
        .ac-stat-icon { font-size: 13px; }
        .ac-stat-val { font-size: 13px; font-weight: 700; color: #fff; }
        .ac-stat-label { font-size: 12px; color: rgba(255,255,255,.3); }

        /* ── Layout ── */
        .ac-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; align-items: start; }
        @media(max-width:900px) { .ac-layout { grid-template-columns: 1fr; } }

        /* ── Sidebar ── */
        .ac-sidebar { background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); border-radius: 20px; padding: 22px; position: sticky; top: 90px; }
        .ac-sidebar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .ac-sidebar-title { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: 1.2px; }
        .ac-clear-btn { font-size: 11px; font-weight: 700; color: #10b981; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 0; }
        .ac-clear-btn:hover { color: #34d399; }

        /* Sort */
        .ac-section-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.25); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .ac-sort-wrap { position: relative; margin-bottom: 20px; }
        .ac-sort-select { width: 100%; padding: 10px 14px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 10px; color: #fff; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; appearance: none; cursor: pointer; transition: border-color .2s; }
        .ac-sort-select:focus { border-color: rgba(16,185,129,.3); }
        .ac-sort-select option { background: #0f172a; }
        .ac-sort-chevron { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,.2); pointer-events: none; font-size: 10px; }

        /* Category pills */
        .ac-divider { height: 1px; background: rgba(255,255,255,.06); margin: 16px 0; }
        .ac-cat-list { display: flex; flex-direction: column; gap: 5px; max-height: 400px; overflow-y: auto; padding-right: 2px; }
        .ac-cat-list::-webkit-scrollbar { width: 3px; }
        .ac-cat-list::-webkit-scrollbar-thumb { background: rgba(16,185,129,.25); border-radius: 100px; }
        .ac-cat-btn { display: flex; align-items: center; gap: 9px; padding: 9px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,.06); background: rgba(255,255,255,.02); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; text-align: left; width: 100%; }
        .ac-cat-btn:hover:not(.active) { background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.1); }
        .ac-cat-btn.active { background: rgba(16,185,129,.08); border-color: rgba(16,185,129,.25); }
        .ac-cat-icon { font-size: 14px; flex-shrink: 0; }
        .ac-cat-name { flex: 1; font-size: 12px; font-weight: 500; color: rgba(255,255,255,.5); }
        .ac-cat-btn.active .ac-cat-name { color: #10b981; font-weight: 600; }
        .ac-cat-check { width: 16px; height: 16px; border-radius: 5px; background: rgba(16,185,129,.15); border: 1px solid rgba(16,185,129,.3); display: flex; align-items: center; justify-content: center; font-size: 9px; color: #10b981; flex-shrink: 0; }

        /* ── Content area ── */
        .ac-content-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
        .ac-results-count { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #fff; }
        .ac-results-count em { color: #10b981; font-style: italic; }
        .ac-results-sub { font-size: 12px; color: rgba(255,255,255,.25); margin-top: 3px; }

        /* Active filter tags */
        .ac-tags { display: flex; flex-wrap: wrap; gap: 7px; }
        .ac-tag { display: inline-flex; align-items: center; gap: 6px; background: rgba(16,185,129,.08); border: 1px solid rgba(16,185,129,.2); padding: 4px 10px 4px 12px; border-radius: 100px; font-size: 11px; font-weight: 600; color: #10b981; }
        .ac-tag-remove { width: 14px; height: 14px; border-radius: 50%; border: none; background: rgba(16,185,129,.15); color: #10b981; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; font-size: 8px; transition: background .15s; }
        .ac-tag-remove:hover { background: rgba(16,185,129,.3); }

        /* Grid */
        .ac-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 16px; }

        /* Empty state */
        .ac-empty { text-align: center; padding: 64px 24px; background: rgba(255,255,255,.02); border: 1px solid rgba(255,255,255,.06); border-radius: 20px; }
        .ac-empty-icon { font-size: 48px; margin-bottom: 16px; opacity: .4; }
        .ac-empty-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px; }
        .ac-empty-sub { font-size: 13px; color: rgba(255,255,255,.3); margin-bottom: 24px; }
        .ac-empty-btn { padding: 11px 24px; background: #10b981; border: none; border-radius: 10px; color: #07090f; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .2s; }
        .ac-empty-btn:hover { background: #0ea472; }

        /* Mobile filter fab */
        .ac-fab { display: none; position: fixed; bottom: 24px; right: 24px; z-index: 50; width: 52px; height: 52px; border-radius: 50%; background: #10b981; border: none; color: #07090f; cursor: pointer; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(16,185,129,.35); transition: transform .2s; }
        .ac-fab:hover { transform: scale(1.08); }
        @media(max-width:900px) { .ac-fab { display: flex; } .ac-sidebar { display: none; } }

        /* Mobile drawer */
        .ac-drawer-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.6); backdrop-filter: blur(4px); z-index: 100; }
        .ac-drawer { position: fixed; right: 0; top: 0; height: 100%; width: 300px; background: #0a0d16; border-left: 1px solid rgba(255,255,255,.08); z-index: 101; padding: 24px; overflow-y: auto; }
        .ac-drawer-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .ac-drawer-title { font-size: 16px; font-weight: 700; color: #fff; }
        .ac-drawer-close { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.5); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; }
      `}</style>

      <div className="ac-root">
        <div className="ac-glow1" /><div className="ac-glow2" /><div className="ac-grid-bg" />
        <Nav />

        <div className="ac-inner">

          {/* Header */}
          <div className="ac-header">
            <div className="ac-eyebrow">
              <div className="ac-eyebrow-dot" /> Explore Courses <div className="ac-eyebrow-dot" />
            </div>
            <h1 className="ac-title">
              Discover your next <em>skill</em>
            </h1>
            <p className="ac-subtitle">
              Browse our curated collection of expert-led courses and start learning today.
            </p>

            {/* Search */}
            <div className="ac-search-wrap">
              <input
                className="ac-search-input"
                type="text"
                placeholder="Search courses, topics, categories..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <FaSearch className="ac-search-icon" size={13} />
            </div>

            {/* Stats */}
            <div className="ac-stats">
              <div className="ac-stat">
                <span className="ac-stat-icon">📚</span>
                <span className="ac-stat-val">{courseData.length}</span>
                <span className="ac-stat-label">Courses</span>
              </div>
              <div className="ac-stat">
                <span className="ac-stat-icon">🗂️</span>
                <span className="ac-stat-val">{categories.length}</span>
                <span className="ac-stat-label">Categories</span>
              </div>
              <div className="ac-stat">
                <span className="ac-stat-icon">🔥</span>
                <span className="ac-stat-val">12+</span>
                <span className="ac-stat-label">New this week</span>
              </div>
              <div className="ac-stat">
                <span className="ac-stat-icon">👥</span>
                <span className="ac-stat-val">2.5K+</span>
                <span className="ac-stat-label">Learners</span>
              </div>
            </div>
          </div>

          {/* Layout */}
          <div className="ac-layout">

            {/* Sidebar */}
            <div className="ac-sidebar">
              <div className="ac-sidebar-header">
                <div className="ac-sidebar-title">
                  <FaSlidersH size={11} /> Filters
                </div>
                {hasFilters && <button className="ac-clear-btn" onClick={clearAll}>Clear all</button>}
              </div>

              {/* Sort */}
              <div className="ac-section-label">Sort by</div>
              <div className="ac-sort-wrap">
                <select className="ac-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <span className="ac-sort-chevron">▼</span>
              </div>

              <div className="ac-divider" />

              {/* Categories */}
              <div className="ac-section-label" style={{ marginBottom: 10 }}>Categories</div>
              <div className="ac-cat-list">
                {categories.map(cat => {
                  const active = category.includes(cat.name);
                  return (
                    <button
                      key={cat.name}
                      className={`ac-cat-btn${active ? ' active' : ''}`}
                      onClick={() => toggleCategory(cat.name)}
                    >
                      <span className="ac-cat-icon">{cat.icon}</span>
                      <span className="ac-cat-name">{cat.name}</span>
                      {active && <div className="ac-cat-check">✓</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div>
              {/* Results header */}
              <div className="ac-content-header">
                <div>
                  <div className="ac-results-count">
                    <em>{filterCourses.length}</em> {filterCourses.length === 1 ? 'course' : 'courses'} found
                  </div>
                  <div className="ac-results-sub">
                    {category.length > 0 ? `in ${category.join(', ')}` : 'across all categories'}
                  </div>
                </div>

                {/* Active tags */}
                {category.length > 0 && (
                  <div className="ac-tags">
                    {category.map(c => (
                      <span key={c} className="ac-tag">
                        {c}
                        <button className="ac-tag-remove" onClick={() => setCategory(category.filter(x => x !== c))}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid */}
              {filterCourses.length > 0 ? (
                <div className="ac-grid">
                  {filterCourses.map((course, i) => (
                    <Card
                      key={course._id || i}
                      thumbnail={course.thumbnail}
                      title={course.title}
                      category={course.category}
                      price={course.price}
                      id={course._id}
                      rating={course.rating}
                      enrollmentCount={course.enrollmentCount}
                      duration={course.duration}
                      review={course.reviews}
                    />
                  ))}
                </div>
              ) : (
                <div className="ac-empty">
                  <div className="ac-empty-icon">🔍</div>
                  <div className="ac-empty-title">No courses found</div>
                  <div className="ac-empty-sub">Try adjusting your search or filters.</div>
                  <button className="ac-empty-btn" onClick={clearAll}>Clear filters</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile FAB */}
        <button className="ac-fab" onClick={() => setIsFilterOpen(true)}>
          <FaSlidersH size={18} />
        </button>

        {/* Mobile Drawer */}
        {isFilterOpen && (
          <>
            <div className="ac-drawer-backdrop" onClick={() => setIsFilterOpen(false)} />
            <div className="ac-drawer">
              <div className="ac-drawer-top">
                <div className="ac-drawer-title">Filters</div>
                <button className="ac-drawer-close" onClick={() => setIsFilterOpen(false)}>✕</button>
              </div>

              <div className="ac-section-label">Sort by</div>
              <div className="ac-sort-wrap" style={{ marginBottom: 16 }}>
                <select className="ac-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <span className="ac-sort-chevron">▼</span>
              </div>

              <div className="ac-divider" />
              <div className="ac-section-label" style={{ marginBottom: 10 }}>Categories</div>
              <div className="ac-cat-list" style={{ maxHeight: '60vh' }}>
                {categories.map(cat => {
                  const active = category.includes(cat.name);
                  return (
                    <button
                      key={cat.name}
                      className={`ac-cat-btn${active ? ' active' : ''}`}
                      onClick={() => toggleCategory(cat.name)}
                    >
                      <span className="ac-cat-icon">{cat.icon}</span>
                      <span className="ac-cat-name">{cat.name}</span>
                      {active && <div className="ac-cat-check">✓</div>}
                    </button>
                  );
                })}
              </div>

              {hasFilters && (
                <button
                  onClick={() => { clearAll(); setIsFilterOpen(false); }}
                  style={{ marginTop: 20, width: '100%', padding: '11px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: 'rgba(255,255,255,.5)', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AllCourses;