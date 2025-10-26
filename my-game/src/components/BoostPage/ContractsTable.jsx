import React from "react";

export default function ContractsTable({ transactions, loading, showContracts, setShowContracts }) {
  return (
    <div
      className={`contracts-overlay ${showContracts ? "show" : ""}`}
      onClick={() => setShowContracts(false)}
    >
      <div className="contracts-dropdown" onClick={(e) => e.stopPropagation()}>
        <div className="dropdown-header" onClick={() => setShowContracts(!showContracts)}>
          <div className="header-content">
            <h3>📋 قراردادهای استیک شما</h3>
            <span className="contracts-count">({transactions.length})</span>
          </div>
          <div className={`dropdown-arrow ${showContracts ? "open" : ""}`}>⌄</div>
        </div>

        <div className={`dropdown-content ${showContracts ? "open" : ""}`}>
          <div className="contracts-table-container">
            <div className="table-header">
              <div>تاریخ</div>
              <div>مبلغ USDT</div>
              <div>دریافتی ECG</div>
              <div>نوع پرداخت</div>
              <div>وضعیت</div>
              <div>TX Hash</div>
            </div>

            <div className="table-body">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx.id} className="table-row">
                    <div className="timestamp">{tx.timestamp || tx.created_at}</div>
                    <div className="usdt-amount">{tx.usdtAmount || tx.usdt_amount} USDT</div>
                    <div className="ecg-amount">{tx.ecgAmount || tx.ecg_amount} ECG</div>
                    <div className="payment-type">{tx.type || tx.payment_type}</div>
                    <div className={`status ${(tx.status === "موفق" || tx.status === "success") ? "success" : "failed"}`}>
                      {tx.status === "success" ? "موفق" : tx.status}
                    </div>
                    <div className="tx-hash">
                      {tx.txHash?.slice(0, 8) || tx.tx_hash?.slice(0, 8)}...
                      {tx.txHash?.slice(-6) || tx.tx_hash?.slice(-6)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  {loading ? "⏳ در حال بارگذاری..." : "📝 هیچ قراردادی ثبت نشده است"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
