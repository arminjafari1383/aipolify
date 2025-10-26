// components/BoostPage/ConversionInfoModal.jsx
import React from "react";

const ConversionInfoModal = ({ 
  isOpen, 
  onClose, 
  conversionHistory, 
  tokenBalances,
  walletAddress 
}) => {
  if (!isOpen) return null;

  // محاسبه آمار کلی
  const totalUSDTConverted = conversionHistory.reduce((sum, tx) => 
    sum + parseFloat(tx.from_amount || 0), 0
  );
  
  const totalECGEarned = conversionHistory.reduce((sum, tx) => 
    sum + parseFloat(tx.to_amount || 0), 0
  );

  const averageRate = totalUSDTConverted > 0 ? 
    (totalECGEarned / totalUSDTConverted).toFixed(2) : 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>💵 USDT to ECG Conversion History</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* آمار کلی */}
          <div className="conversion-stats-section">
            <h3>📊 Conversion Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card total-converted">
                <div className="stat-icon">💵</div>
                <div className="stat-content">
                  <h4>Total USDT Converted</h4>
                  <p className="stat-value">{totalUSDTConverted.toFixed(2)} USDT</p>
                </div>
              </div>

              <div className="stat-card total-earned">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <h4>Total ECG Earned</h4>
                  <p className="stat-value">{totalECGEarned.toLocaleString()} ECG</p>
                </div>
              </div>

              <div className="stat-card conversion-count">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <h4>Conversion Count</h4>
                  <p className="stat-value">{conversionHistory.length} Transactions</p>
                </div>
              </div>

              <div className="stat-card avg-rate">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <h4>Average Rate</h4>
                  <p className="stat-value">1 USDT = {averageRate} ECG</p>
                </div>
              </div>
            </div>
          </div>

          {/* موجودی فعلی */}
          <div className="current-balances-section">
            <h3>💰 Current Balances</h3>
            <div className="balances-display">
              <div className="balance-item">
                <span className="balance-label">USDT Balance:</span>
                <span className="balance-value">
                  {tokenBalances?.USDT?.balance?.toFixed(2) || '0.00'} USDT
                </span>
              </div>
              <div className="balance-item">
                <span className="balance-label">BNB Balance:</span>
                <span className="balance-value">
                  {tokenBalances?.BNB?.balance?.toFixed(4) || '0.0000'} BNB
                </span>
              </div>
            </div>
          </div>

          {/* تاریخچه تبدیل‌ها */}
          <div className="conversion-history-section">
            <h3>🕐 Conversion History</h3>
            {conversionHistory.length > 0 ? (
              <div className="history-table">
                <div className="table-header">
                  <div>Date</div>
                  <div>From</div>
                  <div>To</div>
                  <div>Rate</div>
                  <div>Status</div>
                </div>
                <div className="table-body">
                  {conversionHistory.map((conversion, index) => (
                    <div key={index} className="table-row">
                      <div className="date-cell">
                        {new Date(conversion.timestamp || conversion.created_at).toLocaleDateString()}
                      </div>
                      <div className="from-cell">
                        <strong>{conversion.from_amount} {conversion.from_currency}</strong>
                      </div>
                      <div className="to-cell">
                        <strong className="ecg-amount">
                          {parseFloat(conversion.to_amount).toLocaleString()} ECG
                        </strong>
                      </div>
                      <div className="rate-cell">
                        1:{conversion.conversion_rate}
                      </div>
                      <div className="status-cell">
                        <span className="status-badge confirmed">✅ Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-conversions">
                <p>📝 No conversion history yet.</p>
                <p>Convert some USDT to ECG to see your history here!</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ConversionInfoModal;