/**
 * Fix React Navigation Issues Script
 * Run this before your app starts
 */
import { Alert } from 'react-native';

export function fixReactNavigation() {
  try {
    // Get SceneView from node_modules
    const reactNavigationNative = require('@react-navigation/native');
    const reactNavigationNativeStack = require('@react-navigation/native-stack');
    
    // Fix potential issue with navigation
    if (reactNavigationNative.NavigationContainer) {
      console.log('Fixing NavigationContainer');
      
      // Ensure the context is properly created
      const original = reactNavigationNative.NavigationContainer;
      reactNavigationNative.NavigationContainer = function FixedNavigationContainer(props) {
        // Apply fixes to children recursively
        const patchedChildren = React.Children.map(props.children, patchChild);
        
        // Return with patched children
        return React.createElement(original, props, patchedChildren);
      };
    }
    
    console.log('React Navigation fixes applied successfully');
    return true;
  } catch (e) {
    console.error('Failed to apply React Navigation fixes', e);
    
    // In dev mode, show an alert
    if (__DEV__) {
      Alert.alert(
        'Navigation Fix Failed',
        'Could not apply navigation fixes: ' + e.message,
        [{ text: 'OK' }]
      );
    }
    
    return false;
  }
}

// Helper to recursively patch child components
function patchChild(child) {
  if (!child) return child;
  
  // If it's a component that uses context
  if (child.type && child.type.name && 
      (child.type.name === 'SceneView' || 
       child.type.name.includes('Stack') ||
       child.type.name.includes('Navigator'))) {
    
    // Create a safer version
    return React.createElement(
      SafeComponent,
      { originalType: child.type, originalProps: child.props },
      child.props.children
    );
  }
  
  // If it has children, patch them too
  if (child.props && child.props.children) {
    const patchedChildren = React.Children.map(
      child.props.children,
      patchChild
    );
    
    return React.cloneElement(child, {}, patchedChildren);
  }
  
  return child;
}

// Safe component wrapper
const SafeComponent = ({ originalType, originalProps, children }) => {
  try {
    return React.createElement(originalType, originalProps, children);
  } catch (e) {
    console.warn('Error rendering component:', e);
    return null;
  }
};

// Run immediately
fixReactNavigation();