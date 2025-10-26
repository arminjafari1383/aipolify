// testData.js
export const generateTestStakingData = () => {
  return {
    transactions: [
      {
        id: 1,
        ecg_amount: "15000",
        ecgAmount: "15000",
        amount: "5.0",
        transaction_hash: "0xa1b2c3d4e5f678901234567890abcdef1234567890",
        status: "CONFIRMED",
        timestamp: "2024-01-10T08:20:00Z",
        type: "STAKE"
      },
      {
        id: 2,
        ecg_amount: "25000",
        ecgAmount: "25000",
        amount: "8.5",
        transaction_hash: "0xb2c3d4e5f678901234567890abcdef1234567890a1",
        status: "CONFIRMED",
        timestamp: "2024-01-12T11:30:00Z",
        type: "STAKE"
      }
    ],
    total_staked: 15.5,
    total_rewards: 3.2,
    current_apy: 12.5,
    staking_tier: "GOLD",
    referral_count: 8,
    referral_rewards: 1.5,
    total_usdt_converted: 450,
    total_ecg_earned: 66150,
    conversion_history: [
      {
        id: 1,
        from_currency: "USDT",
        from_amount: "100",
        to_currency: "ECG",
        to_amount: "14700",
        conversion_rate: 150,
        fee_percent: 2,
        transaction_hash: "0x7d8f4a1b3c6e9d2f5a8b4c7e6f3a9d1b2c8e5f4a",
        status: "CONFIRMED",
        timestamp: "2024-01-15T10:30:00Z"
      }
    ],
    referral_data: {
      total_referrals: 8,
      active_referrals: 5,
      total_earnings: 1.5,
      referral_code: "ECG2024"
    }
  };
};

export const TEST_BALANCES = {
  ETH: { balance: 2.5, symbol: "ETH", decimals: 18 },
  BNB: { balance: 5.8, symbol: "BNB", decimals: 18 },
  USDT: { balance: 1250.75, symbol: "USDT", decimals: 6 },
};