import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .ft-root {
          background: #07090f;
          border-top: 1px solid rgba(255,255,255,.07);
          padding: 64px 24px 32px;
          font-family: 'DM Sans', sans-serif;
        }
        .ft-inner {
          max-width: 1160px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr;
          gap: 48px;
        }
        @media (max-width: 760px) {
          .ft-inner { grid-template-columns: 1fr; gap: 36px; }
        }

        /* Brand col */
        .ft-brand { display: flex; flex-direction: column; gap: 14px; }
        .ft-logo { display: flex; align-items: center; gap: 10px; }
        .ft-logo-img {
          width: 34px; height: 34px; border-radius: 8px; overflow: hidden;
          border: 1px solid rgba(255,255,255,.1);
        }
        .ft-logo-img img { width: 100%; height: 100%; object-fit: cover; }
        .ft-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -.2px;
        }
        .ft-logo-name span { color: #10b981; }
        .ft-tagline { font-size: 13px; color: rgba(255,255,255,.35); line-height: 1.7; max-width: 260px; }
        .ft-socials { display: flex; gap: 10px; margin-top: 4px; }
        .ft-social {
          width: 36px; height: 36px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.04);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,.4); font-size: 15px;
          transition: border-color .2s, color .2s, background .2s;
          text-decoration: none;
        }
        .ft-social:hover { border-color: #10b981; color: #10b981; background: rgba(16,185,129,.07); }

        /* Link cols */
        .ft-col-title {
          font-size: 11px; font-weight: 700; color: rgba(255,255,255,.5);
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 16px;
        }
        .ft-links { display: flex; flex-direction: column; gap: 11px; }
        .ft-link {
          font-size: 13.5px; color: rgba(255,255,255,.4);
          background: none; border: none; cursor: pointer; text-align: left;
          padding: 0; font-family: 'DM Sans', sans-serif;
          transition: color .2s;
        }
        .ft-link:hover { color: #fff; }

        /* Contact items */
        .ft-contacts { display: flex; flex-direction: column; gap: 11px; }
        .ft-contact-item { display: flex; align-items: center; gap: 9px; }
        .ft-contact-icon { font-size: 13px; flex-shrink: 0; opacity: .5; }
        .ft-contact-text { font-size: 13px; color: rgba(255,255,255,.4); }

        /* Bottom bar */
        .ft-bottom {
          max-width: 1160px; margin: 48px auto 0;
          padding-top: 24px; border-top: 1px solid rgba(255,255,255,.06);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 10px;
        }
        .ft-copy { font-size: 12px; color: rgba(255,255,255,.2); }
        .ft-copy strong { color: rgba(255,255,255,.35); }
        .ft-bottom-links { display: flex; gap: 20px; }
        .ft-bottom-link {
          font-size: 12px; color: rgba(255,255,255,.2);
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: color .2s;
        }
        .ft-bottom-link:hover { color: rgba(255,255,255,.5); }
      `}</style>

      <footer className="ft-root">
        <div className="ft-inner">

          {/* Brand */}
          <div className="ft-brand">
            <div className="ft-logo">
              <div className="ft-logo-img"><img src={logo} alt="EduNexa" /></div>
              <div className="ft-logo-name">Edu<span>nexa</span></div>
            </div>
            <p className="ft-tagline">
              AI-powered education platform helping learners worldwide build real skills for a changing world.
            </p>
            <div className="ft-socials">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="ft-social"><FaLinkedin /></a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="ft-social"><FaGithub /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="ft-col-title">Platform</div>
            <div className="ft-links">
              {[
                { label: "Home", path: "/" },
                { label: "All Courses", path: "/allcourses" },
                { label: "My Courses", path: "/mycourses" },
                { label: "Profile", path: "/profile" },
              ].map(l => (
                <button key={l.label} className="ft-link" onClick={() => navigate(l.path)}>{l.label}</button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="ft-col-title">Contact</div>
            <div className="ft-contacts">
              <div className="ft-contact-item">
                <span className="ft-contact-icon">📍</span>
                <span className="ft-contact-text">Dhoraji, Gujarat, India</span>
              </div>
              <div className="ft-contact-item">
                <span className="ft-contact-icon">📧</span>
                <span className="ft-contact-text">kirtanvyas9916@gmail.com</span>
              </div>
              <div className="ft-contact-item">
                <span className="ft-contact-icon">📞</span>
                <span className="ft-contact-text">+91 93289 09056</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="ft-bottom">
          <p className="ft-copy">© {new Date().getFullYear()} <strong>EduNexa</strong>. All rights reserved.</p>
          <div className="ft-bottom-links">
            <button className="ft-bottom-link">Privacy Policy</button>
            <button className="ft-bottom-link">Terms of Service</button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;