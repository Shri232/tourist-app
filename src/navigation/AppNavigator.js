// src/navigation/AppNavigator.js
import React, { useContext, useEffect, useState, memo } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator, View, Text } from 'react-native';

export default function AppNavigator() {
  const [navError, setNavError] = useState(null);
  // Use try/catch block to prevent context errors
  let authState = { touristId: null, loading: true };
  
  try {
    authState = useContext(AuthContext) || { touristId: null, loading: true };
  } catch (err) {
    console.error('Error accessing AuthContext:', err);
    setNavError(err.message);
  }
  
  const { touristId, loading } = authState;

  useEffect(() => {
    console.log('AppNavigator - touristId changed:', touristId);
  }, [touristId]);

  console.log('AppNavigator render - touristId:', touristId, 'loading:', loading);

  // Handle navigation errors
  if (navError) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center', padding: 20}}>
        <Text style={{fontSize: 18, marginBottom: 10}}>Navigation Error</Text>
        <Text style={{marginBottom: 20, textAlign: 'center'}}>{navError}</Text>
        <Text onPress={() => setNavError(null)} style={{color: 'blue', padding: 10}}>
          Try Again
        </Text>
      </View>
    );
  }

  // Show loading state
  if (loading) {
    console.log('AppNavigator - showing loading screen');
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log('AppNavigator - rendering navigation, will show:', touristId ? 'MainStack' : 'AuthStack');

  // Create a custom theme with all required properties
  const MyTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: '#2563EB',
      background: '#F8FAFC',
      card: '#FFFFFF',
      text: '#121212',
      border: '#D1D5DB',
      notification: '#EF4444',
    },
  };

  // Memoize stacks to prevent unnecessary re-renders
  const MemoizedAuthStack = memo(() => <AuthStack />);
  const MemoizedMainStack = memo(() => <MainStack />);

  return (
    <NavigationContainer theme={MyTheme} fallback={<ActivityIndicator size="large" />}>
      {touristId ? <MemoizedMainStack /> : <MemoizedAuthStack />}
    </NavigationContainer>
  );
}
