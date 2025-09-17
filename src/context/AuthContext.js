// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize with default values to avoid the $$typeof error
export const AuthContext = createContext({
  touristId: null,
  loading: true,
  register: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [touristId, setTouristId] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('AuthProvider render - touristId:', touristId, 'loading:', loading);

  useEffect(() => {
    (async () => {
      try {
        const tid = await AsyncStorage.getItem('touristId');
        console.log('Loaded touristId from storage:', tid);
        if (tid) setTouristId(tid);
      } catch (e) {
        console.warn('AuthProvider load failed', e.message);
      } finally {
        setLoading(false);
        console.log('AuthProvider loading complete');
      }
    })();
  }, []);

  const register = (id) => {
    console.log('Register function called with ID:', id);
    console.log('Current touristId before update:', touristId);
    
    // Use functional update to ensure the latest state
    setTouristId(prevId => {
      console.log('setTouristId functional update - prev:', prevId, 'new:', id);
      return id;
    });
    
    // Save to storage asynchronously
    AsyncStorage.setItem('touristId', id)
      .then(() => console.log('Tourist ID saved to storage successfully'))
      .catch(e => {
        console.warn('Failed to save touristId to storage:', e.message);
      });
  };

  const logout = async () => {
    try {
      setTouristId(null);
      await AsyncStorage.removeItem('touristId');
    } catch (e) {
      console.warn('Failed to remove touristId', e.message);
    }
  };

  return (
    <AuthContext.Provider value={{ touristId, loading, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
