// src/api/touristApi.js
import axios from 'axios';
import { API_URL } from '../constants/apiConfig';

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Send OTP
export const sendOtp = async ({ mobile, type, aadhaar, visaId }) => {
  try {
    const res = await client.post('/tourists/send-otp', { mobile, type, aadhaar, visaId });
    return res.data;
  } catch (err) {
    console.warn('sendOtp error:', err.message);
    throw err;
  }
};

// Verify OTP and register tourist
export const verifyOtpAndRegister = async (payload) => {
  try {
    const res = await client.post('/tourists/verify-otp', payload); // fixed route
    return res.data;
  } catch (err) {
    console.warn('verifyOtpAndRegister error:', err.message);
    throw err;
  }
};
console.log('API_URL:', API_URL);
