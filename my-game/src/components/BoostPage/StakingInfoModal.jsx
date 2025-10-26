// src/components/BoostPage/StakingInfoModal.jsx
import React from 'react';

const StakingInfoModal = ({ isOpen, onClose, stakingData, walletAddress, tokenBalances, conversionHistory }) => {
  if (!isOpen || !stakingData) return null;

  return (
    <div className="modal-overlay">
      <div>
        <div className="modal-header">
          <h2>💰 Staking & Conversion Information</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* نمایش منبع داده */}
        {stakingData.data_source && (
          <div className="data-source-banner">
            📊 داده‌های واقعی از {stakingData.data_source === "database" ? "دیتابیس" : "تراکنش‌ها"}
            {stakingData.extracted_from_txs && " (استخراج شده از تراکنش‌ها)"}
          </div>
        )}

        <div className="staking-info-grid">
          {/* اطلاعات کیف پول */}
          <div className="info-section">
            <h3>👛 Wallet Information</h3>
            <div className="info-row">
              <span>Wallet Address:</span>
              <span className="wallet-address">{walletAddress}</span>
            </div>
            <div className="info-row">
              <span>Current Tier:</span>
              <span className={`tier-badge tier-${stakingData.staking_tier?.toLowerCase()}`}>
                {stakingData.staking_tier || 'BRONZE'}
              </span>
            </div>
            {stakingData.data_source && (
              <div className="info-row">
                <span>Data Source:</span>
                <span className="data-source">
                  {stakingData.data_source === "database" ? "دیتابیس اصلی" : 
                   stakingData.data_source === "transactions" ? "تراکنش‌ها" : "سیستم"}
                </span>
              </div>
            )}
          </div>

          {/* اطلاعات استیک */}
          <div className="info-section">
            <h3>🪙 Staking Information</h3>
            <div className="info-row">
              <span>Total Staked:</span>
              <span className="highlight">
                {parseFloat(stakingData.total_staked || '0').toFixed(4)} BNB
              </span>
            </div>
            <div className="info-row">
              <span>APY Rate:</span>
              <span className="highlight">{stakingData.apy_rate || '0'}%</span>
            </div>
            <div className="info-row">
              <span>Estimated Rewards:</span>
              <span className="highlight">
                {parseFloat(stakingData.estimated_rewards || '0').toFixed(6)} BNB
              </span>
            </div>
            <div className="info-row">
              <span>Next Reward Date:</span>
              <span>
                {stakingData.next_reward_date ? 
                  new Date(stakingData.next_reward_date).toLocaleDateString('fa-IR') : 
                  'تعیین نشده'
                }
              </span>
            </div>
          </div>

          {/* اطلاعات تبدیل */}
          <div className="info-section">
            <h3>💵 Conversion Information</h3>
            <div className="info-row">
              <span>Total USDT Converted:</span>
              <span className="highlight">
                {parseFloat(stakingData.total_usdt_converted || '0').toFixed(2)} USDT
              </span>
            </div>
            <div className="info-row">
              <span>Total ECG Earned:</span>
              <span className="highlight">
                {parseFloat(stakingData.total_ecg_earned || '0').toFixed(2)} ECG
              </span>
            </div>
            <div className="info-row">
              <span>Conversion Count:</span>
              <span>{conversionHistory?.length || 0} تراکنش</span>
            </div>
          </div>

          {/* موجودی فعلی */}
          <div className="info-section">
            <h3>💰 Current Balances</h3>
            <div className="info-row">
              <span>BNB Balance:</span>
              <span>{tokenBalances.BNB || '0'} BNB</span>
            </div>
            <div className="info-row">
              <span>USDT Balance:</span>
              <span>{tokenBalances.USDT || '0'} USDT</span>
            </div>
            <div className="info-row">
              <span>ECG Balance:</span>
              <span>{tokenBalances.ECG || '0'} ECG</span>
            </div>
          </div>
        </div>

        {/* تاریخچه استیک واقعی */}
        {stakingData.staking_history && stakingData.staking_history.length > 0 ? (
          <div className="history-section">
            <h3>📊 Staking History ({stakingData.staking_history.length} تراکنش)</h3>
            <div className="history-table">
              <div className="history-header">
                <span>Amount</span>
                <span>Date</span>
                <span>Type</span>
                <span>Status</span>
              </div>
              {stakingData.staking_history.map((stake, index) => (
                <div key={index} className="history-row">
                  <span className="amount">{parseFloat(stake.amount).toFixed(4)} BNB</span>
                  <span>{new Date(stake.date).toLocaleDateString('fa-IR')}</span>
                  <span className={`type ${stake.type?.toLowerCase()}`}>
                    {stake.type || 'STAKE'}
                  </span>
                  <span className={`status ${(stake.status || 'COMPLETED').toLowerCase()}`}>
                    {stake.status || 'COMPLETED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-data-section">
            <h3>📊 Staking History</h3>
            <p>هنوز هیچ استیکی انجام نشده است</p>
          </div>
        )}

        {/* تاریخچه تبدیل */}
        {conversionHistory && conversionHistory.length > 0 ? (
          <div className="history-section">
            <h3>🔄 Conversion History ({conversionHistory.length} تراکنش)</h3>
            <div className="history-table">
              <div className="history-header">
                <span>From</span>
                <span>To</span>
                <span>Date</span>
                <span>Status</span>
              </div>
              {conversionHistory.slice(0, 10).map((conversion, index) => (
                <div key={index} className="history-row">
                  <span>{conversion.from_amount} {conversion.from_currency}</span>
                  <span>{conversion.to_amount} {conversion.to_currency}</span>
                  <span>{new Date(conversion.timestamp).toLocaleDateString('fa-IR')}</span>
                  <span className="status completed">Completed</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-data-section">
            <h3>🔄 Conversion History</h3>
            <p>هنوز هیچ تبدیلی انجام نشده است</p>
          </div>
        )}

        <div className="modal-footer">
          <button className="primary-btn" onClick={onClose}>
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default StakingInfoModal;