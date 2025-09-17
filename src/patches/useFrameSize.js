/**
 * useFrameSize patch for React Navigation
 * This patch creates a mock implementation of useFrameSize for React Navigation
 */

import { useWindowDimensions } from 'react-native';

// Create a mock implementation of useFrameSize
export function useFrameSize(callback) {
  // Get window dimensions
  const dimensions = useWindowDimensions();
  
  // Default frame size based on window dimensions
  const frame = {
    width: dimensions.width,
    height: dimensions.height,
    x: 0,
    y: 0
  };
  
  // Calculate if landscape based on width > height
  const isLandscape = dimensions.width > dimensions.height;
  
  // If a callback is provided, call it with the frame
  if (typeof callback === 'function') {
    return callback(frame);
  }
  
  // Otherwise just return the frame
  return frame;
}

// Apply patch to @react-navigation/elements
export function applyUseFrameSizePatch() {
  try {
    if (__DEV__) {
      // Try to get the module
      const elementsModule = require('@react-navigation/elements');
      
      // If useFrameSize doesn't exist or isn't a function, replace it
      if (!elementsModule.useFrameSize || typeof elementsModule.useFrameSize !== 'function') {
        console.log('Patching @react-navigation/elements.useFrameSize');
        elementsModule.useFrameSize = useFrameSize;
      }
    }
  } catch (e) {
    console.error('Failed to patch useFrameSize:', e);
  }
}

// Apply the patch automatically when imported
applyUseFrameSizePatch();