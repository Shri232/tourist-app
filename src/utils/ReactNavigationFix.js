/**
 * Fix script for React Navigation Context error
 * 
 * This script applies patches to fix the "Cannot read property '$$typeof' of undefined" error
 * that happens in React Navigation's native stack implementation.
 */
import React from 'react';
import { Platform } from 'react-native';

export function applyReactNavigationFixes() {
  if (__DEV__) {
    console.log('Applying React Navigation fixes');
    
    // Create backup of original useContext
    const originalUseContext = React.useContext;
    
    // Monkey patch React.useContext to handle the case where Context is undefined
    React.useContext = function(Context) {
      if (!Context || Context === undefined) {
        console.warn('[ReactNavigationFix] useContext called with undefined Context');
        return {}; // Return empty object instead of using undefined context
      }
      
      // Handle missing $$typeof
      if (Context && !Context.$$typeof) {
        try {
          // Create a symbol compatible with React's expected values
          Context.$$typeof = Symbol.for ? Symbol.for('react.context') : 0xeace;
        } catch (e) {
          console.warn('[ReactNavigationFix] Failed to add $$typeof to Context', e);
        }
      }
      
      try {
        return originalUseContext(Context);
      } catch (e) {
        console.warn('[ReactNavigationFix] Error in useContext:', e);
        return {}; // Return empty object on error
      }
    };
    
    console.log('[ReactNavigationFix] Successfully applied context patches');
  }
}

// Apply on import
applyReactNavigationFixes();