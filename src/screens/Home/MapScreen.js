import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Platform, PermissionsAndroid } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

// 1️⃣ Set your Mapbox access token here (get it from https://account.mapbox.com/)
MapboxGL.setAccessToken("pk.eyJ1IjoicmFtc3dhbXkiLCJhIjoiY21mY3BsMjNxMDBzMjJtc2RydmNqY3liYSJ9.dRnVTQOWVPqRROaca9_L-g");

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // 2️⃣ Request location permissions
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      setHasPermission(true); // iOS handles permissions in Info.plist
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  if (!hasPermission) {
    return <View style={styles.page} />;
  }

  return (
    <View style={styles.page}>
      {/* Map View */}
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street} // You can change style: Satellite, Dark, Light, etc.
      >
        {/* Camera centers on user location or defaults to Bangalore */}
        <MapboxGL.Camera
          zoomLevel={14}
          centerCoordinate={
            userLocation
              ? [userLocation.longitude, userLocation.latitude]
              : [77.5946, 12.9716] // Default: Bangalore
          }
        />

        {/* User’s real-time location */}
        <MapboxGL.UserLocation
          visible={true}
          onUpdate={(location) => {
            if (location && location.coords) {
              setUserLocation(location.coords);
            }
          }}
        />
      </MapboxGL.MapView>

      {/* Coordinates overlay */}
      {userLocation && (
        <View style={styles.coordsContainer}>
          <Text style={styles.coordsText}>
            Latitude: {userLocation.latitude.toFixed(6)}
          </Text>
          <Text style={styles.coordsText}>
            Longitude: {userLocation.longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  map: { flex: 1 },
  coordsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
  coordsText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
