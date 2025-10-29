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
    </div>
  );
}
