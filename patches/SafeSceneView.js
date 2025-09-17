/**
 * SafeSceneView wrapper
 * Provides a safer version of the SceneView component used in React Navigation's native stack
 */

import React from 'react';
import { View, Text } from 'react-native';

// This component wraps the SceneView to provide safer context access
export const SafeSceneViewWrapper = (props) => {
  const { children, ...rest } = props;

  // Catch any render errors
  try {
    // If children is a function, call it with default values
    if (typeof children === 'function') {
      return children(rest);
    }
    
    // Otherwise just render children normally
    return children || null;
  } catch (error) {
    console.error('Error rendering SceneView:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
          Navigation Error
        </Text>
        <Text style={{ textAlign: 'center', marginHorizontal: 20 }}>
          {error.message || 'Could not render this screen'}
        </Text>
      </View>
    );
  }
};

export default SafeSceneViewWrapper;