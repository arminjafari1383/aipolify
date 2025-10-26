import React from "react";

export default function EcgDisplay({ ecgValue }) {
  return (
    <div className="my-row">
      <span className="sw">{ecgValue.toFixed(5)} ECG</span>
    </div>
  );
}
