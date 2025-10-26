import React, { useState, useEffect,useMemo,useCallback } from "react";
import fanImg from "../assets/blades.png";
import fh from "../assets/f1.png";
import logo from "../assets/1.png";

import HamburgerMenu from "../components/HamburgerMenu";
import ClaimPopup from "../components/ClaimPopup";
import EcgDisplay from "../components/EcgDisplay";
import Timer from "../components/Timer";

export default function MainPage() {
  const baseECG = 0.11555;
  const growthRate = 1.001;
  const totalTime = 24 * 60 * 60;
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [ecgValue, setEcgValue] = useState(baseECG);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [showPopup, setShowPopup] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting"); // "connecting", "connected", "disconnected", "no_metamask"
  

  const isMetaMaskInstalled = useMemo(() => {
        return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
      }, []);
      useEffect(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const ref = urlParams.get("ref");
      
          if (ref && ref.trim().length >= 10) {
            localStorage.setItem("referrer", ref.trim());
            setReferrerInput(ref.trim());
          }
        }, []);
      
        // 🔹 Auto-connect on component mount
        useEffect(() => {
          if (!isMetaMaskInstalled) {
            setConnectionStatus("no_metamask");
            setIsConnecting(false);
            return;
          }
      
          const autoConnectWallet = async () => {
            try {
              setIsConnecting(true);
              setConnectionStatus("connecting");
      
              // Check if we have permission to access accounts
              const accounts = await window.ethereum.request({ 
                method: "eth_accounts" 
              });
      
              if (accounts.length > 0) {
                // Auto-connect successful
                const currentWallet = accounts[0];
                setWalletAddress(currentWallet);
                localStorage.setItem("walletAddress", currentWallet);
                setConnectionStatus("connected");
                
                // Send to backend
                await connectToBackend(currentWallet);
                
                // Fetch friends data
                await fetchFriends(currentWallet);
                console.log("✅ Wallet auto-connected:", currentWallet);
              } else {
                // No permission - request connection
                await requestWalletConnection();
              }
            } catch (error) {
              console.error("Auto-connect error:", error);
              setConnectionStatus("disconnected");
              localStorage.removeItem("walletAddress");
            } finally {
              setIsConnecting(false);
            }
          };
      
          autoConnectWallet();
        }, [isMetaMaskInstalled]);
      
        // 🔹 Request wallet connection
        const requestWalletConnection = useCallback(async () => {
          if (!isMetaMaskInstalled) return;
      
          try {
            setIsConnecting(true);
            setConnectionStatus("connecting");
      
            // Request accounts access
            const accounts = await window.ethereum.request({ 
              method: "eth_requestAccounts" 
            });
            
            const newWallet = accounts[0];
            
            if (!newWallet) {
              throw new Error("No accounts found");
            }
      
            // Set wallet address
            setWalletAddress(newWallet);
            localStorage.setItem("walletAddress", newWallet);
            setConnectionStatus("connected");
      
            // Send to backend
            await connectToBackend(newWallet);
            
            // Fetch friends data
            await fetchFriends(newWallet);
            
            console.log("✅ Wallet connected successfully:", newWallet);
      
          } catch (err) {
            console.error("MetaMask connection error:", err);
            setConnectionStatus("disconnected");
            localStorage.removeItem("walletAddress");
            
      
          } finally {
            setIsConnecting(false);
          }
        }, [isMetaMaskInstalled]);
      
        // 🔹 Connect to backend
        const connectToBackend = useCallback(async (wallet) => {
          try {
            const finalReferrer = localStorage.getItem("referrer") || "direct_access";
      
            const res = await fetch(`${API_BASE}/connect-wallet/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ wallet: wallet, referrer: finalReferrer })
            });
      
            if (res.ok) {
              const data = await res.json();
              console.log("Backend connection successful:", data);
            }
          } catch (backendError) {
            console.warn("Backend connection failed:", backendError);
          }
        }, []);
      
        // 🔹 Listen for account changes
        useEffect(() => {
          if (!isMetaMaskInstalled || !window.ethereum) return;
      
          const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
              // User disconnected all accounts
              setWalletAddress("");
              setFriends([]);
              setConnectionStatus("disconnected");
              localStorage.removeItem("walletAddress");
              console.log("🔌 Wallet disconnected by user");
            } else if (accounts[0] !== walletAddress) {
              // User switched accounts
              const newWallet = accounts[0];
              setWalletAddress(newWallet);
              localStorage.setItem("walletAddress", newWallet);
              setConnectionStatus("connected");
              fetchFriends(newWallet);
              connectToBackend(newWallet);
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
        }, [isMetaMaskInstalled, walletAddress, connectToBackend]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? totalTime : prev - 1));
      setEcgValue((prev) => (prev <= 0 ? baseECG : prev * growthRate));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-box">
      <HamburgerMenu />

      <img src={logo} alt="Logo" className="lb" /><br />
      <h1 >AI POLIFY</h1>
      <EcgDisplay ecgValue={ecgValue} />

      <div className="claim-btn">
        <button className="kj" onClick={() => setShowPopup(true)}>
          CLAIM NOW
        </button>
      </div>

      {showPopup && (
        <ClaimPopup ecgValue={ecgValue} onClose={() => setShowPopup(false)} />
      )}

      <div className="my-box">
        <img src={fanImg} alt="Fan" className="blades" />
      </div>

      <Timer timeLeft={timeLeft} />
    </div>
  );
}