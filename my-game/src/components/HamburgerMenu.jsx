import React, { useState } from "react";

export default function HamburgerMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="hamburger-container">
      <button
        className={`hamburger-btn ${isMenuOpen ? "active" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isMenuOpen && (
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
                ✕
              </button>
            </div>

            <div className="menu-items">
              <a href="/profile" className="menu-item">
                Shop
              </a>
              <a href="/wallet" className="menu-item">
                Support
              </a>
              <a href="/settings" className="menu-item">
                About Us
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hamburger-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
        }
        .hamburger-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        .hamburger-btn span {
          display: block;
          width: 20px;
          height: 2px;
          background: #333;
          margin: 2px 0;
          transition: all 0.3s ease;
        }
        .hamburger-btn.active span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }
        .hamburger-btn.active span:nth-child(2) {
          opacity: 0;
        }
        .hamburger-btn.active span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }
        .menu-overlay {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }
        .menu-content {
          position: absolute;
          top: 0;
          right: 0;
          width: 280px;
          height: 100%;
          background: white;
          box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
        }
        .menu-item {
          padding: 15px 25px;
          text-decoration: none;
          color: #333;
          display: block;
        }
        .menu-item:hover {
          background: #f8f9fa;
          color: #667eea;
        }
      `}</style>
    </div>
  );
}
