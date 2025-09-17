/**
 * Direct fix for the `useFrameSize is not a function` error
 * 
 * This patch directly modifies the React Navigation elements module
 * to provide a working implementation of useFrameSize
 */

import React from 'react';
import { Dimensions } from 'react-native';

// Create a mock implementation
function createUseFrameSizeMock() {
  return function useFrameSize(callback) {
    const { width, height } = Dimensions.get('window');
    const frame = { width, height, x: 0, y: 0 };
    const isLandscape = width > height;
    
    if (typeof callback === 'function') {
      return callback(frame);
    }
    return frame;
  };
}

/**
 * Apply the patch to the React Navigation elements module
 */
export function fixUseFrameSize() {
  try {
    console.log('Attempting to fix useFrameSize...');
    
    // Try to get the @react-navigation/elements module
    const elementsModule = require('@react-navigation/elements');
    
    // Create our mock implementation
    const useFrameSizeMock = createUseFrameSizeMock();
    
    // Patch the module
    if (!elementsModule.useFrameSize || typeof elementsModule.useFrameSize !== 'function') {
      console.log('Patching @react-navigation/elements with useFrameSize implementation');
      elementsModule.useFrameSize = useFrameSizeMock;
      
      // Also export directly in case it's imported from a specific path
      module.exports.useFrameSize = useFrameSizeMock;
    }
    
    return true;
  } catch (e) {
    console.error('Failed to patch useFrameSize:', e);
    return false;
  }
}

// Apply fix immediately
fixUseFrameSize();