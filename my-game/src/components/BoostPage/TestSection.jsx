// src/components/BoostPage/TestSection.jsx
import React from "react";

const TestSection = ({ onTestStaking, onTestAPI, onTestBalances }) => (
  <div className="dev-test-section">
    <h4>🧪 Development Tests</h4>
    <div className="test-buttons">
      <button className="test-btn-small" onClick={onTestStaking}>
        Test Staking Modal
      </button>
      <button className="test-btn-small" onClick={onTestAPI}>
        Test API Connection
      </button>
      <button className="test-btn-small" onClick={onTestBalances}>
        Test Balances
      </button>
    </div>
  </div>
);

export default TestSection; // اضافه کردن export default