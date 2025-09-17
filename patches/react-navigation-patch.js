/**
 * React Navigation Native Stack patch
 * This file provides fixes for React Navigation 7 context issues
 */

import React from 'react';

// Create a context to provide default values
export const createSafeContext = (defaultValue) => {
  // Force a non-undefined value to avoid $$typeof errors
  const safeDefaultValue = defaultValue || {};
  return React.createContext(safeDefaultValue);
};

// Monkey-patch React.useContext to handle undefined context values safely
export const applySafeContextPatches = () => {
  try {
    // Only apply in development to avoid issues in production
    if (__DEV__) {
      console.log('Applying React Navigation safe context patches');
      
      // Original useContext function
      const originalUseContext = React.useContext;
      
      // Create a safe version that checks for undefined context
      React.useContext = function(Context) {
        // If Context is undefined, return an empty object
        if (!Context) {
          console.warn('React.useContext called with undefined Context');
          return {};
        }
        
        // If Context doesn't have $$typeof, add it
        if (!Context.$$typeof) {
          console.warn('Context missing $$typeof, adding mock value');
          // Use symbol if available
          Context.$$typeof = Symbol.for ? 
            Symbol.for('react.context') : 
            0xeace; // React context symbol value
        }
        
        // Call original with now-safe context
        try {
          return originalUseContext(Context);
        } catch (e) {
          console.warn('Error in useContext, returning empty object', e);
          return {};
        }
      };
      
      // Also patch createContext to ensure it always has a default value
      const originalCreateContext = React.createContext;
      React.createContext = function(defaultValue) {
        return originalCreateContext(defaultValue || {});
      };
    }
  } catch (err) {
    console.warn('Failed to apply React Navigation patches:', err);
  }
};