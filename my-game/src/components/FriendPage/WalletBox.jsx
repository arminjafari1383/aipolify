import React from "react";

export default function WalletBox({ label, value, onCopy, children }) {
  return (
    <div className="ref-box">
      <label>{label}</label>
      <div className="input-group">
        <input type="text" readOnly value={value} />
        {onCopy && <button onClick={() => onCopy(value)}>📋</button>}
        {children}
      </div>
    </div>
  );
}
