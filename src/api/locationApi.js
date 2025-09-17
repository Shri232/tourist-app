// src/api/locationApi.js
import axios from 'axios';
import { API_URL } from '../constants/apiConfig';

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const sendLocation = async (payload) => {
  const res = await client.post('/locations', payload);
  return res.data;
};
