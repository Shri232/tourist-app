/**
 * Direct patch for NativeStackView.native.js
 * This file creates a modified version of the problematic file
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useWindowDimensions } from 'react-native';

// Create a minimal version of the NativeStackView component that avoids using problematic hooks
export function createSafeNativeStackView() {
  return function SafeNativeStackView(props) {
    const { state, descriptors, navigation } = props;
    const dimensions = useWindowDimensions();
    
    // Simplified implementation that just renders the current route
    const activeRoute = state.routes[state.index];
    const activeDescriptor = descriptors[activeRoute.key];
    
    return (
      <View style={styles.container}>
        {activeDescriptor.render()}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Function to apply the patch
export function applyNativeStackViewPatch() {
  try {
    if (__DEV__) {
      const nativeStackModule = require('@react-navigation/native-stack');
      
      // Only patch if module exists and has NativeStackView
      if (nativeStackModule && nativeStackModule.NativeStackView) {
        console.log('Patching @react-navigation/native-stack NativeStackView');
        
        // Create and apply our safe implementation
        const SafeNativeStackView = createSafeNativeStackView();
        nativeStackModule.NativeStackView = SafeNativeStackView;
      }
    }
  } catch (e) {
    console.error('Failed to patch NativeStackView:', e);
  }
}

// Don't auto-apply this patch as it's more invasive
// Call applyNativeStackViewPatch() from your main app file if needed