// src/navigation/AppNavigator.js
import React, { useContext, useEffect, useState, memo } from 'react';
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

  // Since we're not using React Navigation's NavigationContainer anymore with our simple navigator,
  // we can just render the stacks directly
  
  // We'll still memoize to prevent unnecessary re-renders
  const MemoizedAuthStack = memo(() => <AuthStack />);
  const MemoizedMainStack = memo(() => <MainStack />);

  // With our simplified navigator, we don't need NavigationContainer anymore
  return (
    <View style={{flex: 1}}>
      {touristId ? <MemoizedMainStack /> : <MemoizedAuthStack />}
    </View>
  );
}
