/**
 * Mapbox Fallback Component
 * This provides a fallback UI when the native Mapbox module fails
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapFallback = ({ style, message }) => (
  <View style={[styles.container, style]}>
    <Text style={styles.title}>Map Temporarily Unavailable</Text>
    <Text style={styles.message}>{message || 'Native Mapbox module not available'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#cc0000',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});

export default MapFallback;