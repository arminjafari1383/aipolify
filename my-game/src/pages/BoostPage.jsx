import React, { useState, useEffect, useCallback } from "react";
import Chart from "../../src/assets/chart.jpg";
import CurrencyConverter from "../components/BoostPage/CurrencyConverter";

const API_BASE = "https://server.cryptoohubcapital.com/api"; // بک‌اند Django
const BOT_SERVER = "https://bot.cryptoohubcapital.com/api/send_message/"; // Node بات
const APP_URL = "https://cryptoohubcapital.com/boost"; // آدرس محلی React

const BoostPage = () => {
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem("walletAddress") || "");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(walletAddress ? "connected" : "disconnected");

  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);

  // 🦊 تابع اتصال به متامسک
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert("⚠️ MetaMask not detected!");
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionStatus("connecting");

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const currentWallet = accounts[0];

      if (!currentWallet) throw new Error("No wallet returned");

      // ✅ ذخیره و تنظیم وضعیت
      setWalletAddress(currentWallet);
      localStorage.setItem("walletAddress", currentWallet);
      setConnectionStatus("connected");

      console.log("✅ Connected wallet:", currentWallet);

      // گرفتن اطلاعات از URL
      const params = new URLSearchParams(window.location.search);
      const tg_id = params.get("tg_id");
      const ref = params.get("ref");

      // 📤 ارسال به Django
      await fetch(`${API_BASE}/connect-wallet/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: currentWallet,
          referrer: ref || "direct",
          telegram_id: tg_id || null,
        }),
      });

      // 📩 اطلاع‌رسانی به بات
      if (tg_id) {
        await fetch(BOT_SERVER, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telegram_id: tg_id,
            message: `✅ کیف پول شما با موفقیت متصل شد!\n<code>${currentWallet}</code>`,
          }),
        });
      }
    } catch (err) {
      console.error("❌ MetaMask connection error:", err);
      localStorage.removeItem("walletAddress");
      setConnectionStatus("disconnected");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // 🟢 اگر ولت از قبل وصل بوده، وضعیت رو بازیابی کن
  useEffect(() => {
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setConnectionStatus("connected");
    }
  }, []);

  // 🟡 اگر موبایل هست و ولت وصل نشده، MetaMask باز کن
  useEffect(() => {
    if (isMobile && !walletAddress && !window.ethereum) {
      const params = new URLSearchParams(window.location.search);
      const tg_id = params.get("tg_id") || "";
      const ref = params.get("ref") || "direct";

      const currentUrl = `${APP_URL}?ref=${ref}&tg_id=${tg_id}`;
      const encoded = encodeURIComponent(currentUrl);
      const metamaskDeepLink = `https://metamask.app.link/dapp/${encoded}`;

      console.log("📱 Opening MetaMask DeepLink:", metamaskDeepLink);
      window.location.href = metamaskDeepLink;
    }
  }, [isMobile, walletAddress]);

  return (
    <div className="boost-page">
      <button className="back-btn" onClick={() => window.history.back()}>
        ← Back
      </button>

      <div className="container">
        {/* 🔹 عنوان و نمودار همیشه نمایش داده میشه */}
        <div className="wallet-connect-card">
          <h1>Stake</h1>
          {/* <img src={Chart} className="cha" alt="chart" /> */}

          {/* 🔹 فرم ثابت همیشه نمایش داده میشه */}
          <div className="card-body">
            <label className="input-label">You Pay (USDT)</label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              className="amount-input"
              disabled={connectionStatus !== "connected"}
            />

            <label className="output-label">You Receive (ECG)</label>
            <input
              type="text"
              readOnly
              placeholder="0.00"
              className="amount-input"
              disabled={connectionStatus !== "connected"}
            />

            {connectionStatus !== "connected" ? (
              <button
                className="connect-btnh"
                onClick={connectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "🔗 Connect MetaMask"}
              </button>
            ) : (
              <CurrencyConverter
                walletAddress={walletAddress}
                onConversionComplete={(res) => console.log("🎉 Conversion done:", res)}
              />
            )}
          </div>
        </div>
      </div>

      {/* 🔸 وضعیت اتصال پایین صفحه */}
      <div
        style={{
          textAlign: "center",
          marginTop: "15px",
          color:
            connectionStatus === "connected"
              ? "limegreen"
              : connectionStatus === "connecting"
              ? "orange"
              : "gray",
        }}
      >
        {connectionStatus === "connected"
          ? `✅ Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
          : connectionStatus === "connecting"
          ? "⏳ Connecting to MetaMask..."
          : "🔴 Wallet not connected"}
      </div>
    </div>
  );
};

export default BoostPage;
