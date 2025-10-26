import React from "react";

export default function Banner({ type, message }) {
  const colors = {
    developer: "linear-gradient(135deg, #667eea, #764ba2)",
    referral: "linear-gradient(135deg, #4CAF50, #45a049)"
  };

  return (
    <div style={{
      background: colors[type] || "#eee",
      color: "white",
      padding: "15px",
      borderRadius: "10px",
      marginBottom: "20px",
      textAlign: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    }}>
      {message}
    </div>
  );
}
