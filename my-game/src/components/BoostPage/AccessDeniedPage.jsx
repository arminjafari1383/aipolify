import React from "react";

export default function AccessDeniedPage({ navigate }) {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>🚫 Access Denied</h2>
      <p>This page is only accessible through referral links.</p>
      <button
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "15px",
        }}
        onClick={() => navigate("/")}
      >
        Go to Home
      </button>
    </div>
  );
}
