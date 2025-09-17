/**
 * Real Mapbox Implementation
 * This file provides a proper implementation for Mapbox GL in React Native
 */
import MapboxGL from '@rnmapbox/maps';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLES } from '../config/mapbox';

// Set the access token
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

// Set Mapbox options
MapboxGL.setTelemetryEnabled(false);
MapboxGL.setConnected(true);

// Extend StyleURL with our configured styles
MapboxGL.StyleURL = {
  ...MapboxGL.StyleURL,
  ...MAPBOX_STYLES,
};

// Export the real implementation
export default MapboxGL;
export const {
  MapView,
  Camera,
  UserLocation,
  PointAnnotation,
  ShapeSource,
  SymbolLayer,
  LineLayer,
  FillLayer,
  locationManager
} = MapboxGL;