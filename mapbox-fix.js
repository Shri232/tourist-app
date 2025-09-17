/**
 * Mapbox Mock for React Native
 * This file provides a mock implementation for Mapbox GL when the native module fails.
 */

import React from 'react';
import { View, Text } from 'react-native';

// Create mock components that render fallback UI instead of crashing
const MapView = ({ children, style, ...props }) => {
  return (
    <View 
      style={[{ 
        backgroundColor: '#e6e8eb', 
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        overflow: 'hidden'
      }, style]} 
      {...props}
    >
      <Text style={{ fontWeight: 'bold' }}>Map View Placeholder</Text>
      <Text style={{ fontSize: 12, marginTop: 5, color: '#666' }}>
        Native Mapbox module not available
      </Text>
      {children}
    </View>
  );
};

const Camera = ({ children, ...props }) => {
  return <View {...props}>{children}</View>;
};

const UserLocation = ({ visible, ...props }) => {
  if (!visible) return null;
  return (
    <View 
      style={{
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'blue',
        borderWidth: 2,
        borderColor: 'white',
        top: '50%',
        left: '50%',
        marginLeft: -10,
        marginTop: -10,
      }}
      {...props}
    />
  );
};

const PointAnnotation = ({ coordinate, id, children, ...props }) => {
  return (
    <View 
      style={{ 
        position: 'absolute',
        width: 20, 
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      {...props}
    >
      {children}
    </View>
  );
};

// Create a mock implementation with proper React components
const MapboxGL = {
  setAccessToken: (token) => {
    console.log('Mock setAccessToken called with:', token);
  },
  StyleURL: {
    Street: 'mapbox://styles/mapbox/streets-v11',
    Satellite: 'mapbox://styles/mapbox/satellite-v9',
  },
  // Export components directly on the MapboxGL object
  MapView,
  Camera,
  UserLocation,
  PointAnnotation,
  locationManager: {
    start: () => console.log('Mock locationManager.start called'),
    stop: () => console.log('Mock locationManager.stop called'),
  },
};

// Add components as properties
MapboxGL.MapView = MapView;
MapboxGL.Camera = Camera;
MapboxGL.UserLocation = UserLocation;
MapboxGL.PointAnnotation = PointAnnotation;

export default MapboxGL;
export { MapView, Camera, UserLocation, PointAnnotation };