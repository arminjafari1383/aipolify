import React from "react";
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="referral-card">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", marginTop: "20px" }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>🚫</div>
        <h2 style={{ color: "#ff4444", marginBottom: "15px" }}>Access Denied</h2>
        <p style={{ color: "#666", marginBottom: "25px", fontSize: "16px" }}>This page is only accessible through referral links.</p>
        <div style={{ background: "#fff3cd", border: "1px solid #ffeaa7", borderRadius: "8px", padding: "15px", margin: "20px 0" }}>
          <h4 style={{ color: "#856404", marginBottom: "10px" }}>Developer Access</h4>
          <p style={{ color: "#856404", fontSize: "14px", marginBottom: "15px" }}>Developers can access by adding <code>?dev=true</code> to the URL</p>
          <button onClick={() => window.location.href = `${window.location.pathname}?dev=true`} style={{ padding: "10px 20px", background: "#667eea", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}>🔓 Developer Login</button>
        </div>
        <button onClick={() => navigate("/")} style={{ marginTop: "20px", padding: "12px 24px", background: "#667eea", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>Go to Home Page</button>
      </div>
    </div>
  );
}
