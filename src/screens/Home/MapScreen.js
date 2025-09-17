// src/screens/Map/MapScreen.js
import React, { useEffect, useState, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
// Import MapboxGL from our custom fix instead
import MapboxGL from "../../../mapbox-fix";

import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { API_URL } from "../../constants/apiConfig";
import restrictedZones from "../../assets/23.json";

MapboxGL.setAccessToken("pk.eyJ1IjoicmFtc3dhbXkiLCJhIjoiY21mY3BsMjNxMDBzMjJtc2RydmNqY3liYSJ9.dRnVTQOWVPqRROaca9_L-g");

export default function MapScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [lastSent, setLastSent] = useState(null);
  const [lastCoords, setLastCoords] = useState(null);
  const [zoneStatus, setZoneStatus] = useState("🟢 Safe Area");
  const [connectionStatus, setConnectionStatus] = useState("🔄 Connecting...");
  const cameraRef = useRef(null);
  const { touristId } = useContext(AuthContext);

  // ✅ Request Location Permission
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      setHasPermission(true); // iOS handled via Info.plist
    }
  };

  useEffect(() => {
    requestLocationPermission();
    testBackendConnection();
  }, []);

  // ✅ Test backend connection
  const testBackendConnection = async () => {
    try {
      // Let's try multiple possible endpoints to find the right one
      console.log("🔍 Testing backend connection with multiple possible endpoints");
      
      // Define possible endpoints to try (with and without /api prefix)
      const baseUrl = API_URL.replace('/api', '');
      const possibleEndpoints = [
        `${API_URL}/geojson`,      // If API_URL includes /api and endpoint is /api/geojson
        `${baseUrl}/api/geojson`,  // If endpoint is /api/geojson
        `${baseUrl}/geojson`,      // If endpoint is /geojson
        `${baseUrl}/locations/geojson`, // If endpoint is /locations/geojson
        `${API_URL}/locations/geojson`, // If API_URL includes /api and endpoint is /api/locations/geojson
      ];
      
      console.log("🔍 Will try these endpoints:", possibleEndpoints);
      
      // Try each endpoint until one works
      let response = null;
      let successUrl = null;
      
      for (const url of possibleEndpoints) {
        try {
          console.log(`🔍 Trying: ${url}`);
          const result = await axios.get(url, {
            timeout: 5000,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          });
          
          // Check if response is valid
          if (result.status === 200) {
            response = result;
            successUrl = url;
            console.log(`✅ Connection succeeded with: ${url}`);
            // Store the successful endpoint pattern for future API calls
            global.WORKING_API_PATTERN = url.replace('/geojson', '');
            break; // Exit loop on success
          }
        } catch (innerErr) {
          console.log(`❌ Failed with ${url}: ${innerErr.message}`);
        }
      }
      
      // If we found a successful endpoint
      if (response && response.status === 200) {
        console.log("✅ Backend connection test successful:", response.status);
        console.log("🔧 Working API pattern:", global.WORKING_API_PATTERN);
        setConnectionStatus("🟢 Server Online");
        
        // Check if we have valid geojson data and set it on the map if available
        if (response.data && response.data.type === 'FeatureCollection') {
          console.log("📊 Valid GeoJSON received with", 
            response.data.features ? response.data.features.length : 0, 
            "features");
        }
      } else {
        console.error("❌ All connection attempts failed");
        setConnectionStatus("🔴 Server Offline");
      }
    } catch (err) {
      console.error("❌ Backend connection test failed:", {
        message: err.message,
        status: err.response?.status,
        code: err.code,
        url: err.config?.url,
        timeout: err.code === 'ECONNABORTED',
        networkError: !err.response,
      });
      
      let errorMessage = "Unknown error";
      let troubleshootingSteps = [];
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Connection timeout";
        troubleshootingSteps = [
          "1. Check if backend server is running",
          "2. Verify server is listening on port 5000",
          "3. Check network connectivity"
        ];
      } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
        errorMessage = "Cannot reach server";
        troubleshootingSteps = [
          "1. Verify backend server is running on 10.51.25.163:5000",
          "2. Check if you're on the same network",
          "3. Try ping 10.51.25.163 from command line",
          "4. Ensure no firewall is blocking port 5000"
        ];
      } else if (err.response?.status === 404) {
        errorMessage = "Endpoint not found";
        troubleshootingSteps = [
          "1. Backend server is running but /geojson endpoint missing",
          "2. Check if your backend routes are properly configured",
          "3. Verify the controller is properly exported"
        ];
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error";
        troubleshootingSteps = [
          "1. Check backend server logs for errors",
          "2. Verify database connection",
          "3. Check if all dependencies are installed"
        ];
      }
      
      setConnectionStatus("🔴 Server Offline");
      
      if (__DEV__) {
        Alert.alert(
          "Backend Connection Failed",
          `Server: ${API_URL}\nError: ${errorMessage}\n\nTroubleshooting:\n${troubleshootingSteps.join('\n')}\n\nTechnical Details:\nCode: ${err.code || 'N/A'}\nStatus: ${err.response?.status || 'N/A'}`,
          [
            { text: "Retry", onPress: testBackendConnection },
            { text: "OK" }
          ]
        );
      }
    }
  };

  // ✅ Distance Calculator
  const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371000; // meters
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(lat1) *
        Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ✅ Simple point-in-polygon check without turf
  const isPointInPolygon = (point, polygon) => {
    const x = point[0];
    const y = point[1];
    let inside = false;
    
    const coords = polygon.coordinates[0];
    let j = coords.length - 1;
    
    for (let i = 0; i < coords.length; i++) {
      const xi = coords[i][0];
      const yi = coords[i][1];
      const xj = coords[j][0];
      const yj = coords[j][1];
      
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
      j = i;
    }
    
    return inside;
  };

  // ✅ Check if point is near a LineString (buffer zone)
  const isPointNearLineString = (point, lineString, bufferDistance = 0.001) => {
    const [px, py] = point;
    const coords = lineString.coordinates;
    
    for (let i = 0; i < coords.length - 1; i++) {
      const [x1, y1] = coords[i];
      const [x2, y2] = coords[i + 1];
      
      // Calculate distance from point to line segment
      const A = px - x1;
      const B = py - y1;
      const C = x2 - x1;
      const D = y2 - y1;
      
      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      let param = -1;
      
      if (lenSq !== 0) {
        param = dot / lenSq;
      }
      
      let xx, yy;
      
      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }
      
      const dx = px - xx;
      const dy = py - yy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < bufferDistance) {
        return true;
      }
    }
    
    return false;
  };

  // ✅ Enhanced Geo-fence check for both Polygons and LineStrings
  const checkGeoFence = (coords) => {
    const point = [coords.longitude, coords.latitude];

    let insideZone = false;
    for (let feature of restrictedZones.features) {
      let isInside = false;
      
      if (feature.geometry.type === "Polygon") {
        isInside = isPointInPolygon(point, feature.geometry);
      } else if (feature.geometry.type === "LineString") {
        isInside = isPointNearLineString(point, feature.geometry, 0.0005); // ~50m buffer
      }
      
      if (isInside) {
        insideZone = true;
        const zoneName = feature.properties?.name || "Restricted";
        setZoneStatus(`⚠️ Danger Zone: ${zoneName}`);
        Alert.alert("⚠️ Alert", `You entered a restricted/high-risk zone: ${zoneName}`);
        break;
      }
    }

    if (!insideZone) {
      setZoneStatus("🟢 Safe Area");
    }
  };

  // ✅ Send location with throttle logic
  const sendLocation = async (coords) => {
    if (!touristId) {
      console.warn("⚠️ No touristId found, skipping location send");
      return;
    }

    const now = Date.now();
    const movedEnough =
      lastCoords && haversineDistance(lastCoords, coords) >= 20;
    const timeElapsed = lastSent ? now - lastSent : Infinity;

    // Send every 30 seconds OR if moved more than 20 meters
    if (timeElapsed >= 30000 || movedEnough) {
      try {
        const payload = {
          touristId,
          latitude: coords.latitude,
          longitude: coords.longitude,
          timestamp: new Date().toISOString(),
          accuracy: coords.accuracy || null,
          speed: coords.speed || null,
          heading: coords.heading || null,
          provider: Platform.OS === "android" ? "gps" : "CoreLocation",
          deviceId: `${Platform.OS}_device_${touristId}`,
        };

        console.log("📍 Attempting to send location:", payload);

        // Use the discovered working API pattern, or fall back to original if not found
        const apiEndpoint = global.WORKING_API_PATTERN ? 
          `${global.WORKING_API_PATTERN}/v1/locations` : 
          `${API_URL}/v1/locations`;
          
        console.log("📡 Sending to endpoint:", apiEndpoint);
        
        const response = await axios.post(apiEndpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        });

        console.log("✅ Location sent successfully:", response.data);

        setLastSent(now);
        setLastCoords(coords);
        setConnectionStatus("✅ Connected");
      } catch (err) {
        console.error("❌ Failed to send location:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: {
            url: err.config?.url,
            method: err.config?.method,
          }
        });
        
        setConnectionStatus("❌ Connection Failed");
        
        // Show user-friendly error for debugging
        if (__DEV__) {
          Alert.alert(
            "Location Send Failed", 
            `Error: ${err.response?.data?.error || err.message}\nStatus: ${err.response?.status || 'Network Error'}`,
            [{ text: "OK" }]
          );
        }
      }
    } else {
      console.log(`⏳ Skipped location send - Time: ${Math.round(timeElapsed/1000)}s, Distance: ${lastCoords ? Math.round(haversineDistance(lastCoords, coords)) : 0}m`);
    }
  };

  if (!hasPermission) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Tourist ID Badge */}
      <View style={styles.badgeWrapper}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ID: {touristId || "N/A"}</Text>
        </View>
      </View>

      {/* Zone Status Banner */}
      <View style={styles.statusBanner}>
        <Text style={styles.statusText}>{zoneStatus}</Text>
      </View>

      {/* Connection Status Banner */}
      <View style={styles.connectionBanner}>
        <TouchableOpacity onPress={testBackendConnection} style={styles.connectionBannerTouch}>
          <Text style={styles.connectionText}>{connectionStatus}</Text>
          <Text style={styles.retryText}>Tap to retry</Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapWrapper}>
        {/* Use our MapboxGL mock implementation that shows a fallback UI */}
        <MapboxGL.MapView
          style={styles.map}
          styleURL={MapboxGL.StyleURL.Street}
          onPress={e => console.log('Map pressed', e)}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            zoomLevel={15}
            followUserLocation={true}
            followUserMode="normal"
          />
          
          <MapboxGL.UserLocation
            visible={true}
            onUpdate={location => {
              if (location && location.coords) {
                console.log('Location updated:', location.coords);
                setUserLocation(location.coords);
                checkGeoFence(location.coords);
                sendLocation(location.coords);
              }
            }}
          />
        </MapboxGL.MapView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            if (userLocation) {
              try {
                cameraRef.current?.setCamera({
                  centerCoordinate: [userLocation.longitude, userLocation.latitude],
                  zoomLevel: 16,
                  animationDuration: 500,
                });
              } catch (e) {
                console.warn('Camera animation failed:', e);
              }
            }
          }}
        >
          <Text style={styles.fabIcon}>🎯</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  badgeWrapper: { position: "absolute", top: 18, left: 18, zIndex: 20 },
  badge: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 14, letterSpacing: 0.5 },
  statusBanner: {
    position: "absolute",
    top: 18,
    right: 18,
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    zIndex: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  statusText: { fontWeight: "700", fontSize: 14 },
  connectionBanner: {
    position: "absolute",
    top: 70,
    right: 18,
    backgroundColor: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    zIndex: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  connectionBannerTouch: {
    alignItems: "center",
  },
  connectionText: { fontWeight: "600", fontSize: 12 },
  retryText: { fontSize: 10, color: "#6B7280", marginTop: 1 },
  mapWrapper: { flex: 1, marginBottom: 0 },
  map: { flex: 1 },
  // Fallback styles for when map fails to load
  mapFallback: {
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  mapFallbackText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#cc0000",
    textAlign: "center",
    marginBottom: 8,
  },
  mapFallbackSubtext: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 32,
    backgroundColor: "#2563EB",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: { fontSize: 28, color: "#fff" },
});
