import React, { useState, useEffect } from "react";
import MetaMaskIcon from "../assets/metamask.png";

const BOT_USERNAME = "pooooooooooobot"; // 👈 آیدی بات تلگرام بدون @

function Wallets() {
  const [account, setAccount] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("connectedWallet");
    if (saved) setAccount(saved);
  }, []);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert("⚠️ لطفاً MetaMask را نصب کنید.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const wallet = accounts[0];
        setAccount(wallet);
        localStorage.setItem("connectedWallet", wallet);

        const telegramLink = `https://t.me/${BOT_USERNAME}?start=${wallet}`;
        console.log("✅ Connected:", wallet);
        console.log("🤖 Redirecting to Telegram:", telegramLink);

        // ✅ پرتاب مستقیم به تلگرام بعد از اتصال
        window.location.href = telegramLink;
      }
    } catch (err) {
      console.error("❌ MetaMask connection failed:", err);
      alert("اتصال به MetaMask با خطا مواجه شد.");
    }
  };

  return (
    <div className="wallets-container">
      <h1 className="wallets-title">Wallet Connection</h1>

      {account ? (
        <p className="wallets-connected">
          ✅ Connected Wallet:
          <br />
          <code>{account}</code>
        </p>
      ) : (
        <>
          <button onClick={() => setShowPopup(true)} className="connect-btnh">
            Connect Wallet
          </button>

          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-box">
                <h2 className="popup-title">Select Wallet</h2>

                {/* فقط MetaMask */}
                <button className="po" onClick={connectMetaMask}>
                  <img
                    src={MetaMaskIcon}
                    alt="MetaMask"
                    className="wallet-img"
                  />
                  <span>MetaMask</span>
                </button>

                <button
                  onClick={() => setShowPopup(false)}
                  className="popup-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Wallets;
