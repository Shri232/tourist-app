/**
 * SafeSceneView Component
 * 
 * This is a safe replacement for the SceneView component from React Navigation
 * which avoids the "Cannot read property '$$typeof' of undefined" error.
 */

import React from 'react';
import { View, Text } from 'react-native';

/**
 * A safe implementation of SceneView to avoid context errors
 */
export default function SafeSceneView({
  screen,
  route,
  navigation,
  ...rest
}) {
  // Create a custom navigation prop with sensible defaults
  const safeNavigation = navigation || {
    dispatch: () => {},
    navigate: () => {},
    goBack: () => {},
    setOptions: () => {},
    setParams: () => {},
    isFocused: () => true,
    addListener: () => { return { remove: () => {} }; },
  };
  
  // Handle screen rendering with error boundary
  try {
    if (!screen) {
      console.warn('SafeSceneView: No screen component provided');
      return null;
    }

    // If screen is a component class or function, render it
    if (typeof screen === 'function' || (typeof screen === 'object' && screen !== null)) {
      const screenProps = {
        route,
        navigation: safeNavigation,
        ...rest,
      };
      
      return (
        <View style={{ flex: 1 }}>
          {React.createElement(screen, screenProps)}
        </View>
      );
    }
    
    console.warn('SafeSceneView: Invalid screen type:', typeof screen);
    return null;
  } catch (e) {
    console.error('SafeSceneView: Error rendering screen:', e);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error rendering screen: {e.message}</Text>
      </View>
    );
  }
}