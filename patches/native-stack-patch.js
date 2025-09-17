/**
 * Specific patch for NativeStackView.native.js
 * 
 * This is a more targeted approach to fixing the $$typeof error.
 * This file should be placed in node_modules after installation.
 */

import { SceneView } from '@react-navigation/native-stack';
import { SafeSceneViewWrapper } from '../patches';

// If SceneView exists and we're in dev mode, patch it
if (SceneView && __DEV__) {
  try {
    console.log('Patching @react-navigation/native-stack SceneView');
    
    // Store original render function
    const originalSceneView = SceneView;
    
    // Replace with our safe version
    SceneView = function PatchedSceneView(props) {
      return (
        <SafeSceneViewWrapper>
          {() => originalSceneView(props)}
        </SafeSceneViewWrapper>
      );
    };
    
    // Preserve name and displayName
    SceneView.displayName = 'PatchedSceneView';
  } catch (err) {
    console.warn('Failed to patch SceneView:', err);
  }
}