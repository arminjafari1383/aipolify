// constants.js
export const RECIPIENT_ADDRESS = "0x4923fbAaf387F5C12b273DF82C501a369e079bB6";

export const TOKEN_ADDRESSES = {
  ETH: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  BNB: "0x55d398326f99059fF775485246999027B3197955",
};

export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

export const INITIAL_TOKEN_BALANCES = {
  ETH: { balance: 0, symbol: "ETH", decimals: 18 },
  BNB: { balance: 0, symbol: "BNB", decimals: 18 },
  USDT: { balance: 0, symbol: "USDT", decimals: 6 },
};