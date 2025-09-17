/**
 * Mapbox Native Module Fix
 * 
 * This file re-exports the native @rnmapbox/maps implementation
 * to ensure we're not using the web version which requires
 * mapbox-gl to be installed.
 */

// Re-export all components from the native module
import * as MapboxNative from '@rnmapbox/maps/src/index';
export * from '@rnmapbox/maps/src/index';
export default MapboxNative;