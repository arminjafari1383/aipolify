import React, { useState, useCallback } from "react";
import { ethers } from "ethers";

const CurrencyConverter = ({ 
  walletAddress, 
  onTransactionSync, 
  tokenBalances, 
  onBalanceUpdate,
  onConversionComplete
}) => {
  const [fromAmount, setFromAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USDT");
  const [toAmount, setToAmount] = useState("");
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");

  const RECIPIENT_ADDRESS = "0x4923fbAaf387F5C12b273DF82C501a369e079bB6";
  const USDT_BSC_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";

  const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ];

  const conversionRates = {
    USDT: { rate: 150, fee: 0.02, symbol: "💵", decimals: 18 }
  };

  const calculateToAmount = useCallback((amount, currency) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setToAmount("");
      setError("");
      return;
    }

    const rateInfo = conversionRates[currency];
    if (!rateInfo) return;

    const amountNum = parseFloat(amount);
    const fee = amountNum * rateInfo.fee;
    const netAmount = amountNum - fee;
    const ecgAmount = netAmount * rateInfo.rate;

    setToAmount(ecgAmount.toFixed(2));
    setError("");
  }, []);

  const handleFromAmountChange = (e) => {
    const value = e.target.value;
    setFromAmount(value);
    calculateToAmount(value, fromCurrency);
  };

  const hasSufficientBalance = useCallback(() => {
    if (!fromAmount || fromAmount <= 0) return false;
    const availableBalance = parseFloat(tokenBalances[fromCurrency] || 0);
    return parseFloat(fromAmount) <= availableBalance;
  }, [fromAmount, fromCurrency, tokenBalances]);

  const isValidAmount = useCallback(() => {
    if (!fromAmount || fromAmount <= 0) return false;
    const amountNum = parseFloat(fromAmount);
    return !isNaN(amountNum) && amountNum > 0;
  }, [fromAmount]);

  const handleConvertUSDT = async () => {
    setError("");

    if (!walletAddress) return setError("آدرس کیف پول یافت نشد");
    if (!isValidAmount()) return setError("مقدار معتبر وارد کنید");
    if (!window.ethereum) return setError("MetaMask نصب نشده است");
    if (!hasSufficientBalance()) {
      return setError(`موجودی USDT کافی نیست! موجودی: ${tokenBalances.USDT || '0.00'} USDT`);
    }

    setConverting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const usdtContract = new ethers.Contract(USDT_BSC_ADDRESS, ERC20_ABI, signer);

      const amountInWei = ethers.parseUnits(fromAmount, 18);
      const rateInfo = conversionRates[fromCurrency];
      const ecgAmount = (parseFloat(fromAmount) * rateInfo.rate * (1 - rateInfo.fee)).toFixed(2);

      const transferTx = await usdtContract.transfer(RECIPIENT_ADDRESS, amountInWei);
      console.log("TX sent:", transferTx.hash);

      if (onTransactionSync) {
        await onTransactionSync({
          wallet_address: walletAddress,
          transaction_hash: transferTx.hash,
          from_currency: fromCurrency,
          from_amount: fromAmount,
          to_currency: "ECG",
          to_amount: ecgAmount,
          status: "PENDING"
        });
      }

      await transferTx.wait();
      onBalanceUpdate?.();
      onConversionComplete?.({ success: true, from_amount: fromAmount, to_amount: ecgAmount });
      alert(`✅ تبدیل موفق: ${fromAmount} USDT → ${ecgAmount} ECG`);
      setFromAmount("");
      setToAmount("");
    } catch (err) {
      console.error(err);
      setError("تبدیل ناموفق بود: " + err.message);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="converter-inline">
      <h3>💵 Convert USDT to ECG</h3>

      {error && <div className="error-message">⚠️ {error}</div>}

      <div className="input-section">
        <label>You Pay (USDT)</label>
        <input
          type="number"
          value={fromAmount}
          onChange={handleFromAmountChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          disabled={converting}
        />
        <small>Available: {tokenBalances.USDT || "0.00"} USDT</small>
      </div>

      <div className="output-section">
        <label>You Receive (ECG)</label>
        <input type="text" value={toAmount} readOnly placeholder="0.00" />
      </div>

      <button
        className="convert-button"
        onClick={handleConvertUSDT}
        disabled={!fromAmount || converting || !!error}
      >
        {converting ? "در حال تبدیل..." : `Convert ${fromAmount || "0"} USDT to ECG`}
      </button>

      <p className="note">⚠️ لطفاً مطمئن شوید در شبکه BNB Smart Chain هستید.</p>

      <style jsx>{`
        .converter-inline {
          background: linear-gradient(135deg, #1e293b, #334155);
          padding: 24px;
          border-radius: 16px;
          margin-top: 24px;
          margin-bottom:400px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
          color: #e2e8f0;
        }
        h3 {
          text-align: center;
          margin-bottom: 16px;
          color: #26a17b;
        }
        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
        }
        input {
          width: 100%;
          padding: 1px;
          border-radius: 8px;
          border: 2px solid #4b5563;
          background: #374151;
          color: white;
          font-size: 1rem;
          margin-bottom: 8px;
        }
        input:focus {
          border-color: #26a17b;
          outline: none;
        }
        .convert-button {
          background: linear-gradient(135deg, #26a17b, #1e8c6c);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
          width: 100%;
          cursor: pointer;
          transition: 0.3s;
        }
        .convert-button:hover:not(:disabled) {
          background: #1e8c6c;
        }
        .convert-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .error-message {
          background: #dc2626;
          color: white;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 12px;
        }
        .note {
          font-size: 0.85rem;
          text-align: center;
          color: #9ca3af;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default CurrencyConverter;
