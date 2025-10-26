import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import WalletBox from "../components/FriendPage/WalletBox.jsx";

function ReferralCard() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem("walletAddress") || "");
  const [referrerInput, setReferrerInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const BOT_USERNAME = "pooooooooooobot"; // 👈 آیدی ربات بدون @
  const APP_URL = "https://cryptoohubcapital.com/referral"; // آدرس HTTPS صفحه فعلی (با ngrok یا دامنه واقعی)

  // ✅ بررسی نصب متامسک
  const isMetaMaskInstalled = useMemo(() => {
    return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
  }, []);

  // ✅ تشخیص موبایل
  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);

  // ✅ دریافت referrer از URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");
    if (ref && ref.trim().length >= 10) {
      localStorage.setItem("referrer", ref.trim());
      setReferrerInput(ref.trim());
    }
  }, []);

  // ✅ تلاش برای اتصال خودکار به MetaMask (اگر قبلاً وصل شده بود)
  useEffect(() => {
    if (!isMetaMaskInstalled) return;

    const autoConnectWallet = async () => {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const currentWallet = accounts[0];
          setWalletAddress(currentWallet);
          localStorage.setItem("walletAddress", currentWallet);
        }
      } catch (error) {
        console.error("⚠️ Auto-connect error:", error);
      }
    };

    autoConnectWallet();
  }, [isMetaMaskInstalled]);

  // ✅ Deep link MetaMask برای موبایل
  const openMetaMaskMobile = useCallback(() => {
    const currentUrl = encodeURIComponent(APP_URL);
    const metamaskDeepLink = `metamask://dapp/${currentUrl}`;
    console.log("📱 Opening MetaMask deep link:", metamaskDeepLink);
    window.location.href = metamaskDeepLink;
  }, []);

  // ✅ دکمه اتصال به MetaMask (دسکتاپ یا miniapp)
  const connectWallet = useCallback(async () => {
    if (isMobile && !isMetaMaskInstalled) {
      openMetaMaskMobile();
      return;
    }

    if (!window.ethereum) {
      alert("⚠️ MetaMask not detected!");
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const currentWallet = accounts[0];

      setWalletAddress(currentWallet);
      localStorage.setItem("walletAddress", currentWallet);
      console.log("✅ Connected wallet:", currentWallet);
    } catch (err) {
      console.error("❌ MetaMask connection failed:", err);
      alert("Failed to connect MetaMask");
    } finally {
      setIsConnecting(false);
    }
  }, [isMobile, isMetaMaskInstalled, openMetaMaskMobile]);

  // ✅ ساخت لینک دعوت تلگرام
  const telegramInviteLink = walletAddress
    ? `https://t.me/${BOT_USERNAME}?start=${walletAddress}`
    : "";

  // ✅ تابع کپی لینک
  const copyTelegramReferral = useCallback(() => {
    if (!walletAddress) return alert("Please connect your wallet first!");
    navigator.clipboard
      .writeText(telegramInviteLink)
      .then(() => alert("✅ Telegram invite link copied!\n" + telegramInviteLink))
      .catch(() => alert("❌ Failed to copy link"));
  }, [walletAddress, telegramInviteLink]);

  // ✅ دکمه بازکردن در تلگرام
  const shareInTelegram = useCallback(() => {
    if (!walletAddress) return alert("Please connect your wallet first!");

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(telegramInviteLink);
    } else {
      window.open(telegramInviteLink, "_blank");
    }
  }, [walletAddress, telegramInviteLink]);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "#6c757d",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ← Back
      </button>

      <h2
        style={{
          textAlign: "center",
          color: "#2c3e50",
          marginBottom: "30px",
          fontSize: "28px",
          fontWeight: "700",
        }}
      >
        🎯 Referral Program
      </h2>

      {referrerInput && <WalletBox label="👤 Your Referrer" value={referrerInput} />}

      {walletAddress ? (
        <WalletBox
          label="🔗 My Telegram Invite Link"
          value={telegramInviteLink}
          onCopy={copyTelegramReferral}
        >
          <button
            onClick={shareInTelegram}
            style={{
              background: "#28a745",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              marginLeft: "10px",
            }}
          >
            🤖 Open in Telegram
          </button>
        </WalletBox>
      ) : (
        <div
          style={{
            textAlign: "center",
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "12px",
            color: "#6c757d",
            marginTop: "20px",
          }}
        >
          <p style={{ marginBottom: "10px" }}>
            Please connect your MetaMask wallet to get your referral link.
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {isConnecting ? "Connecting..." : "Connect MetaMask"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ReferralCard;
