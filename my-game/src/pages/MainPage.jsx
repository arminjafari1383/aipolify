// src/pages/MainPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import logo from "../assets/1.png";
import HamburgerMenu from "../components/HamburgerMenu";
import ClaimPopup from "../components/ClaimPopup";
import EcgDisplay from "../components/EcgDisplay";
import Timer from "../components/Timer";
import NeonMiner3D from "../components/NeonMiner3D";

export default function MainPage() {
  const baseECG = 0.11555;
  const growthRate = 1.001;
  const totalTime = 24 * 60 * 60; // ۲۴ ساعت

  const [walletAddress, setWalletAddress] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [ecgValue, setEcgValue] = useState(baseECG);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [showPopup, setShowPopup] = useState(false);

  // بررسی نصب بودن متامسک
  const isMetaMaskInstalled = useMemo(
    () => typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask,
    []
  );

  // ⛓️ تابع اتصال به متامسک
  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      alert("⚠️ MetaMask نصب نیست!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      setWalletAddress(address);
      setConnectionStatus("connected");

      // بررسی زمان ذخیره‌شده برای این ولت
      const startKey = `timerStart_${address}`;
      const savedStart = localStorage.getItem(startKey);

      if (!savedStart) {
        // اولین بار اتصال با این ولت
        const now = Date.now();
        localStorage.setItem(startKey, now.toString());
        setTimeLeft(totalTime);
      } else {
        // محاسبه زمان باقی‌مانده
        const elapsed = Math.floor((Date.now() - parseInt(savedStart, 10)) / 1000);
        const remaining = Math.max(totalTime - elapsed, 0);
        setTimeLeft(remaining);
      }

      localStorage.setItem("walletAddress", address);
    } catch (err) {
      console.error("❌ خطا در اتصال متامسک:", err);
      setConnectionStatus("disconnected");
    }
  };

  // 🟢 بازیابی وضعیت قبلی
  useEffect(() => {
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setConnectionStatus("connected");

      const startKey = `timerStart_${savedWallet}`;
      const savedStart = localStorage.getItem(startKey);

      if (savedStart) {
        const elapsed = Math.floor((Date.now() - parseInt(savedStart, 10)) / 1000);
        const remaining = Math.max(totalTime - elapsed, 0);
        setTimeLeft(remaining);
      } else {
        localStorage.setItem(startKey, Date.now().toString());
        setTimeLeft(totalTime);
      }
    }
  }, []);

  // ⏱️ تایمر — هر ثانیه زمان و ECG به‌روزرسانی میشه
  useEffect(() => {
    if (connectionStatus !== "connected" || !walletAddress) return;

    const startKey = `timerStart_${walletAddress}`;
    const interval = setInterval(() => {
      // هر ثانیه اختلاف بین الان و زمان شروع رو حساب کن
      const savedStart = localStorage.getItem(startKey);
      if (!savedStart) return;

      const elapsed = Math.floor((Date.now() - parseInt(savedStart, 10)) / 1000);
      const remaining = Math.max(totalTime - elapsed, 0);
      setTimeLeft(remaining);

      setEcgValue((prev) => (prev <= 0 ? baseECG : prev * growthRate));

      // اگه تایمر تموم شد، متوقفش کن
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [connectionStatus, walletAddress]);

  return (
    <div className="min-h-screen bg-[#06071A] text-white flex flex-col items-center justify-start p-6 relative overflow-hidden">
      {/* افکت پس‌زمینه */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 50% 0%, rgba(0,230,255,0.08) 0%, rgba(6,7,26,0) 60%), radial-gradient(60% 60% at 50% 100%, rgba(124,77,255,0.08) 0%, rgba(6,7,26,0) 60%)",
        }}
      ></div>

      <HamburgerMenu />

      <img src={logo} alt="Logo" className="mo" />
      <h1 className="text-3xl font-extrabold tracking-wide mb-4">AI POLIFY</h1>

      <EcgDisplay ecgValue={ecgValue} />

      <div className="mt-6 flex justify-center items-center">
        <NeonMiner3D className="w-[320px] h-auto drop-shadow-[0_0_40px_rgba(0,255,255,0.4)]" />
      </div>

      {/* دکمه اتصال ولت */}
      {connectionStatus !== "connected" ? (
        <button className="glass-button mt-8" onClick={connectWallet}>
          🔗 اتصال کیف پول
        </button>
      ) : (
        <div className="mt-8 text-green-400">
          ✅ کیف پول متصل شد: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
      )}

      {/* دکمه Claim */}
      {connectionStatus === "connected" && (
        <div className="mt-8">
          <button className="glass-button" onClick={() => setShowPopup(true)}>
            CLAIM NOW
          </button>
        </div>
      )}

      {showPopup && (
        <ClaimPopup ecgValue={ecgValue} onClose={() => setShowPopup(false)} />
      )}

      {/* تایمر فقط وقتی ولت وصله */}
      {connectionStatus === "connected" && (
        <div className="mt-8 w-full flex justify-center">
          <Timer timeLeft={timeLeft} />
        </div>
      )}
    </div>
  );
}
