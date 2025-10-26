// services/conversionService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const conversionAPI = {
  // ذخیره اطلاعات تبدیل
  saveConversion: async (conversionData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/conversions`, conversionData);
      return response.data;
    } catch (error) {
      console.error('Error saving conversion:', error);
      throw error;
    }
  },

  // دریافت تاریخچه تبدیل‌های کاربر
  getConversionHistory: async (walletAddress) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversions/${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversion history:', error);
      throw error;
    }
  }
};