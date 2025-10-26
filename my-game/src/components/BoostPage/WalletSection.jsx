// src/components/BoostPage/WalletSection.jsx
import React from "react";

const WalletSection = ({ walletAddress, userProfile, children }) => (
  <div className="wallet-section">
    <p className="wallet-info">
      <strong>Wallet:</strong> {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}
    </p>
    
    {userProfile?.referral_code && (
      <p className="referral-code">
        <strong>Your Referral Code:</strong> {userProfile.referral_code}
      </p>
    )}
    {children}
  </div>
);

export default WalletSection;