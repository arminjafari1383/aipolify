// src/components/BoostPage/BalancesSection.jsx
import React from "react";

const BalancesSection = ({ tokenBalances, loadingBalances, conversionHistory }) => {
  // تابع ایمن برای فرمت کردن مقادیر
  const formatBalance = (balance, decimals = 4) => {
    if (balance === null || balance === undefined || balance === "" || isNaN(parseFloat(balance))) {
      return "0.00".padEnd(decimals + 3, '0');
    }
    return parseFloat(balance).toFixed(decimals);
  };

  // تابع ایمن برای دسترسی به موجودی
  const getSafeBalance = (token) => {
    if (!tokenBalances || typeof tokenBalances !== 'object') {
      return "0.00";
    }
    
    // اگر tokenBalances به صورت { BNB: "1.5", USDT: "100.0" } است
    if (tokenBalances[token] !== undefined) {
      return tokenBalances[token];
    }
    
    // اگر tokenBalances به صورت { BNB: { balance: "1.5" }, USDT: { balance: "100.0" } } است
    if (tokenBalances[token]?.balance !== undefined) {
      return tokenBalances[token].balance;
    }
    
    return "0.00";
  };

  return (
    <div className="balances-section">
      <h3 className="balances-title">💰 Token Balances (BNB Chain)</h3>
      {loadingBalances ? (
        <div className="loading-balances">
          <p>Loading balances...</p>
        </div>
      ) : (
        <div className="balances-grid">
          <div className="balance-card bnb">
            <div className="balance-icon">💎</div>
            <div className="balance-info">
              <span className="balance-symbol">BNB</span>
              <span className="balance-amount">
                {formatBalance(getSafeBalance('BNB'))}
              </span>
            </div>
          </div>

          <div className="balance-card usdt">
            <div className="balance-icon">💵</div>
            <div className="balance-info">
              <span className="balance-symbol">USDT</span>
              <span className="balance-amount">
                {formatBalance(getSafeBalance('USDT'), 2)}
              </span>
            </div>
          </div>

          <div className="balance-card ecg">
            <div className="balance-icon">⚡</div>
            <div className="balance-info">
              <span className="balance-symbol">ECG</span>
              <span className="balance-amount">
                {formatBalance(getSafeBalance('ECG'), 2)}
              </span>
            </div>
          </div>

          {conversionHistory && conversionHistory.length > 0 && (
            <div className="balance-card conversion-stats">
              <div className="balance-icon">📊</div>
              <div className="balance-info">
                <span className="balance-symbol">Total Converted</span>
                <span className="balance-amount">
                  {conversionHistory.length} tx
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .balances-section {
          background: linear-gradient(135deg, #1e293b, #334155);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #475569;
          margin-bottom: 20px;
        }

        .balances-title {
          margin: 0 0 16px 0;
          color: white;
          font-size: 1.2rem;
          font-weight: 600;
          text-align: center;
        }

        .loading-balances {
          text-align: center;
          color: #9ca3af;
          padding: 20px;
        }

        .balances-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .balance-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #475569;
          border-radius: 10px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .balance-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .balance-card.bnb {
          border-left: 4px solid #f0b90b;
        }

        .balance-card.usdt {
          border-left: 4px solid #26a17b;
        }

        .balance-card.ecg {
          border-left: 4px solid #00d1b2;
        }

        .balance-card.conversion-stats {
          border-left: 4px solid #8b5cf6;
        }

        .balance-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }

        .balance-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .balance-symbol {
          color: #cbd5e1;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .balance-amount {
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          font-family: 'Courier New', monospace;
        }

        @media (max-width: 768px) {
          .balances-grid {
            grid-template-columns: 1fr 1fr;
          }
          
          .balance-card {
            padding: 12px;
          }
          
          .balance-icon {
            font-size: 1.2rem;
            width: 32px;
            height: 32px;
          }
          
          .balance-amount {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .balances-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BalancesSection;