import React from "react";

export default function DeveloperLoginPopup({ devPassword, setDevPassword, handleDevLogin, setShowDevLogin, setAccessDenied }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000
    }}>
      <div style={{
        background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        textAlign: "center", minWidth: "320px", maxWidth: "90%"
      }}>
        <div style={{ fontSize: "48px", marginBottom: "15px" }}>🔐</div>
        <h2 style={{ color: "#333", marginBottom: "10px" }}>Developer Access</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>Please enter developer password to continue</p>
        <input
          type="password"
          value={devPassword}
          onChange={(e) => setDevPassword(e.target.value)}
          placeholder="Enter developer password..."
          style={{
            width: "100%", padding: "12px", border: "2px solid #667eea", borderRadius: "8px",
            fontSize: "16px", marginBottom: "15px", boxSizing: "border-box"
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleDevLogin()}
        />
        <div style={{ background: "#f8f9fa", border: "1px solid #e9ecef", borderRadius: "6px", padding: "10px", marginBottom: "15px", textAlign: "left" }}>
          <p style={{ fontSize: "12px", color: "#6c757d", margin: "0" }}>
            <strong>Available passwords:</strong><br/>
            • ECG@Dev2024!<br/>• CryptoHub$567<br/>• Admin123<br/>• dev<br/>• test123
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button onClick={handleDevLogin} style={{ padding: "12px 24px", background: "#667eea", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>🔓 Login</button>
          <button onClick={() => { setShowDevLogin(false); setAccessDenied(true); }} style={{ padding: "12px 24px", background: "#ff4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>❌ Cancel</button>
        </div>
      </div>
    </div>
  );
}
