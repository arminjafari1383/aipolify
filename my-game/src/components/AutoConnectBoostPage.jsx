// pages/AutoConnectBoostPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CurrencyConverter from "../components/BoostPage/CurrencyConverter";
import Chart from "../../src/assets/chart.jpg";

const AutoConnectBoostPage = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenBalances, setTokenBalances] = useState({});
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("initializing"); // "initializing", "connecting", "connected", "disconnected", "no_metamask"

  // 🔹 Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;

  // 🔹 Auto-connect immediately on component mount
  useEffect(() => {
    const initializeWallet = async () => {
      if (!isMetaMaskInstalled) {
        setConnectionStatus("no_metamask");
        setIsConnecting(false);
        return;
      }

      try {
        setConnectionStatus("connecting");
        setIsConnecting(true);

        // First, try to get accounts without prompting (silent connection)
        const accounts = await window.ethereum.request({ 
          method: "eth_accounts" 
        });

        if (accounts.length > 0) {
          // Silent auto-connect successful
          const currentWallet = accounts[0];
          setWalletAddress(currentWallet);
          setConnectionStatus("connected");
          updateTokenBalances(currentWallet);
          console.log("✅ Wallet auto-connected silently:", currentWallet);
        } else {
          // No accounts available, try to request with minimal interruption
          await requestWalletConnection();
        }
      } catch (error) {
        console.error("Auto-connect initialization error:", error);
        setConnectionStatus("disconnected");
      } finally {
        setIsConnecting(false);
      }
    };

    // Start auto-connect immediately
    initializeWallet();
  }, [isMetaMaskInstalled]);

  // 🔹 Request wallet connection
  const requestWalletConnection = useCallback(async () => {
    if (!isMetaMaskInstalled) return;

    try {
      setConnectionStatus("connecting");
      setIsConnecting(true);

      // Request accounts access (this will show MetaMask popup)
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      
      const newWallet = accounts[0];
      
      if (!newWallet) {
        throw new Error("No accounts found");
      }

      // Set wallet address
      setWalletAddress(newWallet);
      setConnectionStatus("connected");
      updateTokenBalances(newWallet);
      
      console.log("✅ Wallet connected successfully:", newWallet);

    } catch (err) {
      console.error("MetaMask connection error:", err);
      setConnectionStatus("disconnected");
      
      // Only show alert for unexpected errors, not user rejection
      if (err.code !== 4001) {
        console.warn(`Connection Error: ${err.message || "Failed to connect wallet"}`);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled]);

  // 🔹 Update token balances (simulated)
  const updateTokenBalances = useCallback(async (wallet) => {
    try {
      // Simulate API call to get token balances
      setTimeout(() => {
        setTokenBalances({
          USDT: "150.50",
          BNB: "0.5",
          ECG: "0",
        });
        console.log("✅ Token balances updated for:", wallet);
      }, 500);
    } catch (error) {
      console.error("❌ Balance update failed:", error);
    }
  }, []);

  // 🔹 Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled || !window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // User disconnected all accounts
        setWalletAddress("");
        setTokenBalances({});
        setConnectionStatus("disconnected");
        console.log("🔌 Wallet disconnected by user");
      } else if (accounts[0] !== walletAddress) {
        // User switched accounts
        const newWallet = accounts[0];
        setWalletAddress(newWallet);
        setConnectionStatus("connected");
        updateTokenBalances(newWallet);
        console.log("🔄 Account changed to:", newWallet);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    // Add event listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Cleanup function
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [isMetaMaskInstalled, walletAddress, updateTokenBalances]);

  // 🔹 Sync transaction with backend
  const handleTransactionSync = async (transactionData) => {
    console.log("📡 Syncing transaction with backend:", transactionData);
    try {
      // Your backend sync logic here
      return { success: true };
    } catch (error) {
      console.error("❌ Transaction sync failed:", error);
      return { success: false, error: error.message };
    }
  };

  // 🔹 Update balances after conversion
  const handleBalanceUpdate = async () => {
    console.log("🔄 Updating balances...");
    try {
      setTokenBalances((prev) => ({
        ...prev,
        USDT: (parseFloat(prev.USDT) - 10).toFixed(2),
        ECG: (parseFloat(prev.ECG) + 1500).toFixed(2),
      }));
      console.log("✅ Balances updated");
    } catch (error) {
      console.error("❌ Balance update failed:", error);
    }
  };

  // 🔹 Handle conversion completion
  const handleConversionComplete = (conversionResult) => {
    console.log("🎉 Conversion completed:", conversionResult);
    if (conversionResult.success) {
      console.log(`✅ Conversion successful! ${conversionResult.from_amount} ${conversionResult.from_currency} → ${conversionResult.to_amount} ${conversionResult.to_currency}`);
    } else {
      console.error(`❌ Conversion failed: ${conversionResult.error}`);
    }
  };

  // 🔹 Render connection status
  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case "initializing":
      case "connecting":
        return (
          <div style={{ 
            background: "#e3f2fd", 
            color: "#1565c0", 
            padding: "15px", 
            borderRadius: "8px", 
            marginBottom: "20px",
            border: "1px solid #bbdefb",
            textAlign: "center"
          }}>
            <p>🔄 Auto-connecting to MetaMask...</p>
            <small>Please wait while we connect to your wallet</small>
          </div>
        );
      
      case "connected":
        return (
          <div style={{ 
            background: "#e8f5e8", 
            color: "#2e7d32", 
            padding: "15px", 
            borderRadius: "8px", 
            marginBottom: "20px",
            border: "1px solid #c8e6c9"
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <strong>✅ Auto-Connected to MetaMask</strong>
                <div style={{ fontSize: '0.9em', marginTop: '5px', wordBreak: 'break-all' }}>
                  {walletAddress}
                </div>
              </div>
              <div style={{ fontSize: '0.8em', color: '#2e7d32' }}>
                Ready to convert
              </div>
            </div>
          </div>
        );
      
      case "disconnected":
        return (
          <div style={{ 
            background: "#fff3cd", 
            color: "#856404", 
            padding: "15px", 
            borderRadius: "8px", 
            marginBottom: "20px",
            border: "1px solid #ffeaa7",
            textAlign: "center"
          }}>
            <p>🔌 Connect Wallet to Continue</p>
            <button 
              onClick={requestWalletConnection}
              disabled={isConnecting}
              style={{
                background: isConnecting ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: isConnecting ? 'not-allowed' : 'pointer',
                marginTop: '10px',
                fontSize: '1em'
              }}
            >
              {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          </div>
        );
      
      case "no_metamask":
        return (
          <div style={{ 
            background: "#ffebee", 
            color: "#c62828", 
            padding: "20px", 
            borderRadius: "8px", 
            marginBottom: "20px",
            border: "1px solid #ffcdd2",
            textAlign: "center"
          }}>
            <h3>⚠️ MetaMask Not Found</h3>
            <p>To use this feature, please install MetaMask browser extension.</p>
            <button 
              onClick={() => window.open("https://metamask.io/download/", "_blank")}
              style={{
                background: "#f39c12",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "15px",
                fontSize: "1em"
              }}
            >
              Install MetaMask
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  // 🔹 Render loading skeleton while connecting
  if (isConnecting && !walletAddress) {
    return (
      <div className="boost-page">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '20px',
              color: '#666'
            }}>
              🔄 Connecting to Your Wallet...
            </div>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="boost-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      {/* Connection Status */}
      {renderConnectionStatus()}

      {/* Main Content */}
      <div className="container">
        {connectionStatus === "connected" ? (
          <CurrencyConverter
            walletAddress={walletAddress}
            tokenBalances={tokenBalances}
            onConversionComplete={handleConversionComplete}
            onBalanceUpdate={handleBalanceUpdate}
            onTransactionSync={handleTransactionSync}
          />
        ) : (
          <div className="wallet-connect-card">
            <h1>Stake & Convert</h1>
            <img src={Chart} alt="Chart" className="cha" />
            <div className="card-body">
              <label className="input-label">You Pay (USDT)</label>
              <div className="input-container">
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="amount-input"
                  disabled={connectionStatus !== "connected"}
                />
              </div>

              <div className="output-section">
                <label className="output-label">You Receive (ECG)</label>
                <div className="output-container">
                  <input
                    type="text"
                    readOnly
                    placeholder="0.00"
                    className="amount-input"
                  />
                </div>
              </div>

              <button 
                className="connect-btnh"
                disabled={connectionStatus !== "connected"}
                style={{
                  opacity: connectionStatus === "connected" ? 1 : 0.6,
                  cursor: connectionStatus === "connected" ? "pointer" : "not-allowed",
                  width: '100%',
                  padding: '12px',
                  fontSize: '1.1em'
                }}
              >
                {connectionStatus === "connected" ? "Convert USDT to ECG" : "Connect Wallet First"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoConnectBoostPage;