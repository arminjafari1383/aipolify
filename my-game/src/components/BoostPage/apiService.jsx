// src/components/BoostPage/apiService.js
import config from './config';

class ApiService {
  constructor() {
    this.baseURL = config.API_BASE_URL;
    console.log("🔧 API Service initialized with base URL:", this.baseURL);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const configOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (options.body) {
      configOptions.body = JSON.stringify(options.body);
    }

    try {
      console.log(`🌐 API Call: ${url}`, options.body ? { body: options.body } : '');
      const response = await fetch(url, configOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Success: ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error('🚨 API request failed:', error);
      throw error;
    }
  }

  // همگام‌سازی تراکنش جدید - اصلاح شده برای مطابقت با backend
  async syncTransaction(transactionData) {
    try {
      console.log("🔄 Syncing transaction with backend:", transactionData);
      
      // تبدیل داده‌ها به فرمت مورد انتظار backend
      const formattedData = this.formatTransactionForBackend(transactionData);
      console.log("📦 Formatted transaction data:", formattedData);
      
      // استفاده از endpoint اصلی transactions
      const result = await this.request('/transactions/', {
        method: 'POST',
        body: formattedData,
      });
      
      console.log("✅ Transaction synced successfully:", result);
      return result;
    } catch (error) {
      console.error("❌ Error syncing transaction:", error);
      
      // اگر endpoint اصلی کار نکرد، از endpoint جایگزین استفاده کن
      try {
        console.log("🔄 Trying alternative sync method...");
        const formattedData = this.formatTransactionForBackend(transactionData);
        
        const alternativeResult = await this.request('/transactions/sync_transaction/', {
          method: 'POST',
          body: formattedData,
        });
        
        console.log("✅ Transaction synced via alternative method:", alternativeResult);
        return alternativeResult;
      } catch (fallbackError) {
        console.error("❌ All sync methods failed:", fallbackError);
        
        // حتی اگر sync با خطا مواجه شد، ادامه بده
        return { 
          success: false, 
          error: fallbackError.message, 
          synced_locally: true,
          transaction_data: transactionData 
        };
      }
    }
  }

  // تبدیل داده‌های تراکنش به فرمت مورد انتظار backend
  formatTransactionForBackend(transactionData) {
    // مقادیر معتبر برای transaction_type بر اساس backend
    const validTransactionTypes = {
      'CONVERSION': 'conversion',
      'STAKE': 'stake',
      'UNSTAKE': 'unstake',
      'REWARD': 'reward',
      'TRANSFER': 'transfer',
      'TEST': 'test'
    };

    // تبدیل transaction_type به مقدار معتبر
    const transactionType = validTransactionTypes[transactionData.transaction_type] || 'transfer';
    
    // اطمینان از وجود amount
    const amount = transactionData.amount || transactionData.from_amount || '0';
    
    // فرمت نهایی داده‌ها
    const formattedData = {
      wallet_address: transactionData.wallet_address,
      transaction_hash: transactionData.transaction_hash,
      transaction_type: transactionType,
      amount: amount,
      status: transactionData.status || 'pending',
      timestamp: transactionData.timestamp || new Date().toISOString(),
    };

    // اضافه کردن فیلدهای اختیاری اگر وجود دارند
    if (transactionData.from_currency) {
      formattedData.from_currency = transactionData.from_currency;
    }
    if (transactionData.to_currency) {
      formattedData.to_currency = transactionData.to_currency;
    }
    if (transactionData.from_amount) {
      formattedData.from_amount = transactionData.from_amount;
    }
    if (transactionData.to_amount) {
      formattedData.to_amount = transactionData.to_amount;
    }
    if (transactionData.conversion_rate) {
      formattedData.conversion_rate = transactionData.conversion_rate;
    }
    if (transactionData.fee_percent) {
      formattedData.fee_percent = transactionData.fee_percent;
    }
    if (transactionData.recipient_address) {
      formattedData.recipient_address = transactionData.recipient_address;
    }
    if (transactionData.token_address) {
      formattedData.token_address = transactionData.token_address;
    }
    if (transactionData.block_number) {
      formattedData.block_number = transactionData.block_number;
    }
    if (transactionData.gas_used) {
      formattedData.gas_used = transactionData.gas_used;
    }

    return formattedData;
  }

  // بقیه متدها بدون تغییر...
  async getUserTransactions(walletAddress) {
    try {
      console.log(`📊 Fetching transactions for: ${walletAddress}`);
      
      // روش ۱: استفاده از endpoint اصلی transactions با فیلتر
      try {
        const data = await this.request(`/transactions/?wallet_address=${walletAddress}`);
        if (data && (data.results || Array.isArray(data))) {
          const transactions = data.results || data;
          console.log(`✅ Found ${transactions.length} transactions from main endpoint`);
          return transactions;
        }
      } catch (error) {
        console.log("🔄 Main transactions endpoint failed, trying alternatives...");
      }

      // روش ۲: دریافت همه تراکنش‌ها و فیلتر کردن سمت کلاینت
      try {
        const allData = await this.request('/transactions/');
        const allTransactions = allData.results || allData || [];
        
        // فیلتر تراکنش‌های مربوط به کاربر
        const userTransactions = allTransactions.filter(tx => 
          tx.wallet_address?.toLowerCase() === walletAddress.toLowerCase() ||
          tx.user_wallet?.toLowerCase() === walletAddress.toLowerCase()
        );
        
        console.log(`✅ Filtered ${userTransactions.length} transactions from all transactions`);
        return userTransactions;
      } catch (error) {
        console.log("🔄 All transactions endpoint failed");
      }

      // اگر هیچکدام کار نکرد، آرایه خالی برگردان
      console.warn("⚠️ No transaction endpoints worked, returning empty array");
      return [];

    } catch (error) {
      console.error("❌ Error getting transactions:", error);
      return [];
    }
  }

  async saveUserConnection(walletAddress, referralCode = '') {
    return this.request('/users/connect_wallet/', {
      method: 'POST',
      body: {
        wallet_address: walletAddress,
        referral_code: referralCode
      },
    });
  }

  async getUserProfile(walletAddress) {
    try {
      const response = await this.request(`/users/${walletAddress}/`);
      return response;
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      return {
        wallet_address: walletAddress,
        join_date: new Date().toISOString(),
        tier: "STANDARD",
        is_fallback: true
      };
    }
  }

  async getRealStakingInfo(walletAddress) {
    try {
      console.log(`📊 Fetching REAL staking info for: ${walletAddress}`);
      const transactions = await this.getUserTransactions(walletAddress);
      const stakingData = this.extractStakingFromTransactions(transactions, walletAddress);
      console.log("💰 Staking data extracted from transactions:", stakingData);
      return stakingData;
    } catch (error) {
      console.error("❌ Failed to get real staking data:", error);
      return this.getFallbackStakingInfo(walletAddress);
    }
  }

  extractStakingFromTransactions(transactions, walletAddress) {
    // تبدیل transaction_type به lowercase برای تطابق
    const stakingTxs = transactions.filter(tx => {
      const txType = (tx.transaction_type || '').toLowerCase();
      return txType === 'stake' || 
             txType === 'STAKE' ||
             (tx.description && tx.description.toLowerCase().includes("stake"));
    });

    const totalStaked = stakingTxs.reduce((sum, tx) => {
      const amount = parseFloat(tx.amount || tx.value || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const stakingHistory = stakingTxs.map(tx => ({
      amount: (tx.amount || tx.value || 0).toString(),
      date: tx.timestamp || tx.created_at || tx.date || new Date().toISOString(),
      type: "STAKE",
      transaction_hash: tx.transaction_hash || tx.hash || "N/A",
      status: tx.status || "COMPLETED"
    }));

    let stakingTier = "BRONZE";
    if (totalStaked >= 10) stakingTier = "PLATINUM";
    else if (totalStaked >= 5) stakingTier = "GOLD";
    else if (totalStaked >= 2) stakingTier = "SILVER";

    const apyRates = { 
      BRONZE: "12.5", 
      SILVER: "15.5", 
      GOLD: "18.5", 
      PLATINUM: "22.0" 
    };

    return {
      wallet_address: walletAddress,
      total_staked: totalStaked.toFixed(8),
      staking_tier: stakingTier,
      apy_rate: apyRates[stakingTier],
      estimated_rewards: (totalStaked * parseFloat(apyRates[stakingTier]) / 100 / 12).toFixed(8),
      next_reward_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      staking_history: stakingHistory,
      is_real_data: true,
      data_source: "transactions",
      transaction_count: stakingTxs.length
    };
  }

  getFallbackStakingInfo(walletAddress) {
    console.log("🛠️ Using fallback staking data");
    return {
      wallet_address: walletAddress,
      total_staked: "0.00000000",
      staking_tier: "BRONZE",
      apy_rate: "12.5",
      estimated_rewards: "0.00000000",
      next_reward_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      staking_history: [],
      is_fallback_data: true,
      data_source: "fallback"
    };
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;