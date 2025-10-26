import React, { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ClaimPopup({ ecgValue, onClose }) {
  useEffect(() => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  }, []);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-glass" onClick={(e) => e.stopPropagation()}>
        <h3>🎉 Claim Successful</h3>
        <p>
          شما <b>{ecgValue.toFixed(5)} ECG</b> دریافت کردید.
        </p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
