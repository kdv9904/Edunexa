import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.png';
import { IoMenu, IoClose } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBook, FaSignOutAlt, FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa';

const Nav = () => {
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/login");
      setShowDropdown(false);
      setMobileOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isEducator = userData?.user?.role === 'educator';
  const isStudent  = userData?.user?.role === 'student';

  return (
    <>
      <style>{`
        .nav-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          height: 68px;
          display: flex; align-items: center;
          padding: 0 32px;
          justify-content: space-between;
          font-family: 'DM Sans', sans-serif;
          transition: background .3s ease, border-color .3s ease, backdrop-filter .3s ease;
        }
        .nav-root.scrolled {
          background: rgba(7,9,15,.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .nav-root.top {
          background: transparent;
        }

        /* Logo */
        .nav-logo {
          display: flex; align-items: center; gap: 10px; cursor: pointer;
          text-decoration: none;
        }
        .nav-logo-img {
          width: 36px; height: 36px; border-radius: 10px; overflow: hidden;
          border: 1px solid rgba(255,255,255,.12);
          flex-shrink: 0;
        }
        .nav-logo-img img { width: 100%; height: 100%; object-fit: cover; }
        .nav-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -.2px;
        }
        .nav-logo-name span { color: #10b981; }

        /* Desktop right side */
        .nav-right {
          display: flex; align-items: center; gap: 8px;
        }
        @media (max-width: 768px) { .nav-right { display: none; } }

        /* Nav buttons */
        .nav-btn {
          padding: 8px 18px; border-radius: 10px;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
          color: rgba(255,255,255,.7); font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; gap: 7px;
          transition: all .2s;
        }
        .nav-btn:hover { background: rgba(255,255,255,.1); color: #fff; border-color: rgba(255,255,255,.2); }

        /* Sign out btn */
        .nav-btn-signout {
          padding: 8px 14px; border-radius: 10px;
          background: transparent; border: 1px solid rgba(239,68,68,.25);
          color: rgba(239,68,68,.7); font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; gap: 6px;
          transition: all .2s;
        }
        .nav-btn-signout:hover { background: rgba(239,68,68,.1); color: #ef4444; border-color: rgba(239,68,68,.4); }

        /* Get started btn */
        .nav-btn-cta {
          padding: 9px 22px; border-radius: 10px;
          background: #10b981; color: #07090f;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
          transition: background .2s, transform .15s, box-shadow .2s;
        }
        .nav-btn-cta:hover { background: #0ea472; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(16,185,129,.3); }

        /* Avatar */
        .nav-avatar-wrap {
          position: relative; cursor: pointer;
        }
        .nav-avatar {
          width: 36px; height: 36px; border-radius: 10px; overflow: hidden;
          border: 1.5px solid rgba(255,255,255,.15);
          background: linear-gradient(135deg, #10b981, #6366f1);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: #fff;
          transition: border-color .2s;
        }
        .nav-avatar:hover { border-color: #10b981; }
        .nav-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .nav-online {
          position: absolute; bottom: -2px; right: -2px;
          width: 10px; height: 10px; border-radius: 50%;
          background: #10b981; border: 2px solid #07090f;
        }

        /* Dropdown */
        .nav-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 260px;
          background: #0f172a;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 16px;
          padding: 6px;
          box-shadow: 0 20px 60px rgba(0,0,0,.6);
          z-index: 100;
        }
        .nav-dropdown-header {
          padding: 14px 14px 12px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          margin-bottom: 4px;
        }
        .nav-dropdown-name { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
        .nav-dropdown-email { font-size: 11px; color: rgba(255,255,255,.35); margin-bottom: 8px; word-break: break-all; }
        .nav-dropdown-role {
          display: inline-block;
          padding: 3px 10px; border-radius: 100px;
          background: rgba(16,185,129,.12); border: 1px solid rgba(16,185,129,.2);
          font-size: 10px; font-weight: 600; color: #10b981;
          text-transform: capitalize; letter-spacing: .5px;
        }
        .nav-dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          color: rgba(255,255,255,.6); font-size: 13px; font-weight: 500;
          cursor: pointer; background: none; border: none; width: 100%;
          font-family: 'DM Sans', sans-serif; text-align: left;
          transition: background .15s, color .15s;
        }
        .nav-dropdown-item:hover { background: rgba(255,255,255,.06); color: #fff; }
        .nav-dropdown-item svg { font-size: 13px; flex-shrink: 0; }

        /* Mobile toggle */
        .nav-mobile-btn {
          display: none;
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
          color: #fff; font-size: 20px; border-radius: 10px;
          padding: 8px; cursor: pointer; align-items: center; justify-content: center;
          transition: background .2s;
        }
        .nav-mobile-btn:hover { background: rgba(255,255,255,.12); }
        @media (max-width: 768px) { .nav-mobile-btn { display: flex; } }

        /* Mobile menu */
        .nav-mobile-menu {
          position: fixed; top: 68px; left: 0; right: 0;
          background: #0a0d16;
          border-bottom: 1px solid rgba(255,255,255,.07);
          padding: 16px 20px 24px;
          display: flex; flex-direction: column; gap: 8px;
          z-index: 49;
        }
        .nav-mobile-user {
          display: flex; align-items: center; gap: 12px;
          padding: 14px; border-radius: 14px;
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
          margin-bottom: 4px;
        }
        .nav-mobile-avatar {
          width: 40px; height: 40px; border-radius: 10px; overflow: hidden;
          border: 1.5px solid rgba(255,255,255,.15);
          background: linear-gradient(135deg, #10b981, #6366f1);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 700; color: #fff; flex-shrink: 0;
        }
        .nav-mobile-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .nav-mobile-name { font-size: 14px; font-weight: 700; color: #fff; }
        .nav-mobile-role {
          font-size: 10px; color: #10b981; font-weight: 600;
          text-transform: capitalize; letter-spacing: .5px; margin-top: 2px;
        }
        .nav-mobile-item {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; border-radius: 10px;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
          color: rgba(255,255,255,.6); font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: background .15s, color .15s; width: 100%; text-align: left;
        }
        .nav-mobile-item:hover { background: rgba(255,255,255,.08); color: #fff; }
        .nav-mobile-item.danger {
          border-color: rgba(239,68,68,.2); color: rgba(239,68,68,.7);
        }
        .nav-mobile-item.danger:hover { background: rgba(239,68,68,.08); color: #ef4444; }
        .nav-mobile-item.cta {
          background: #10b981; border-color: #10b981; color: #07090f;
          font-weight: 700; justify-content: center;
        }
        .nav-mobile-item.cta:hover { background: #0ea472; }
      `}</style>

      <nav className={`nav-root${scrolled ? ' scrolled' : ' top'}`}>

        {/* Logo */}
        <div className="nav-logo" onClick={() => navigate("/")}>
          <div className="nav-logo-img"><img src={logo} alt="EduNexa" /></div>
          <div className="nav-logo-name">Edu<span>nexa</span></div>
        </div>

        {/* Desktop right */}
        <div className="nav-right">
          {isStudent && (
            <button className="nav-btn" onClick={() => navigate("/mycourses")}>
              <FaGraduationCap size={12} /> My Learning
            </button>
          )}
          {isEducator && (
            <button className="nav-btn" onClick={() => navigate("/dashboard")}>
              <FaChalkboardTeacher size={12} /> Dashboard
            </button>
          )}

          {userData ? (
            <>
              <button className="nav-btn-signout" onClick={handleLogout}>
                <FaSignOutAlt size={12} /> Sign Out
              </button>

              <div style={{ position: "relative" }} ref={dropdownRef}>
                <div className="nav-avatar-wrap" onClick={() => setShowDropdown(p => !p)}>
                  <div className="nav-avatar">
                    {userData.user.photoUrl
                      ? <img src={userData.user.photoUrl} alt="avatar" />
                      : userData.user.name?.charAt(0).toUpperCase()
                    }
                  </div>
                  <div className="nav-online" />
                </div>

                {showDropdown && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-header">
                      <div className="nav-dropdown-name">{userData.user.name}</div>
                      <div className="nav-dropdown-email">{userData.user.email}</div>
                      <span className="nav-dropdown-role">{userData.user.role}</span>
                    </div>
                    <button className="nav-dropdown-item" onClick={() => { navigate("/profile"); setShowDropdown(false); }}>
                      <FaUser /> My Profile
                    </button>
                    <button className="nav-dropdown-item" onClick={() => {
                      navigate(isEducator ? "/courses" : "/allcourses");
                      setShowDropdown(false);
                    }}>
                      <FaBook /> {isEducator ? "My Courses" : "All Courses"}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="nav-btn-cta" onClick={() => navigate("/login")}>
              Get Started
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="nav-mobile-btn" onClick={() => setMobileOpen(p => !p)}>
          {mobileOpen ? <IoClose /> : <IoMenu />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="nav-mobile-menu">
          {userData && (
            <div className="nav-mobile-user">
              <div className="nav-mobile-avatar">
                {userData.user.photoUrl
                  ? <img src={userData.user.photoUrl} alt="avatar" />
                  : userData.user.name?.charAt(0).toUpperCase()
                }
              </div>
              <div>
                <div className="nav-mobile-name">{userData.user.name}</div>
                <div className="nav-mobile-role">{userData.user.role}</div>
              </div>
            </div>
          )}

          {isStudent && (
            <button className="nav-mobile-item" onClick={() => { navigate("/mycourses"); setMobileOpen(false); }}>
              <FaGraduationCap size={13} /> My Learning
            </button>
          )}
          {isEducator && (
            <button className="nav-mobile-item" onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}>
              <FaChalkboardTeacher size={13} /> Dashboard
            </button>
          )}

          {userData ? (
            <>
              <button className="nav-mobile-item" onClick={() => { navigate("/profile"); setMobileOpen(false); }}>
                <FaUser size={13} /> My Profile
              </button>
              <button className="nav-mobile-item" onClick={() => {
                navigate(isEducator ? "/courses" : "/allcourses");
                setMobileOpen(false);
              }}>
                <FaBook size={13} /> {isEducator ? "My Courses" : "All Courses"}
              </button>
              <button className="nav-mobile-item danger" onClick={handleLogout}>
                <FaSignOutAlt size={13} /> Sign Out
              </button>
            </>
          ) : (
            <button className="nav-mobile-item cta" onClick={() => { navigate("/login"); setMobileOpen(false); }}>
              Get Started
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Nav;