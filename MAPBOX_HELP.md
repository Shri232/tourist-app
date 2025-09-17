# Mapbox Troubleshooting Guide

## Common Issues and Solutions

### Native module not available

If you see "Native Mapbox module not available" error, try these steps:

1. Clean and rebuild the project:

   ```
   cd android && ./gradlew clean
   npx react-native run-android
   ```

2. Check that Mapbox dependencies are properly installed:

   - Verify gradle.properties has MAPBOX_DOWNLOADS_TOKEN
   - Ensure build.gradle has necessary dependencies

3. Verify that MapboxGL is properly initialized in MainApplication.kt

### Map shows but is blank/grey

1. Verify your access token is valid
2. Check internet connection
3. Try a different map style

### Location not showing

1. Make sure location permissions are granted
2. Enable location services on the device
3. Verify UserLocation component is properly configured

## Manual Integration Steps

If automatic linking doesn't work, follow these steps:

### Android

1. Add to android/settings.gradle:

   ```gradle
   include ':@rnmapbox_maps'
   project(':@rnmapbox_maps').projectDir = new File(rootProject.projectDir, '../node_modules/@rnmapbox/maps/android/rctmgl')
   ```

2. Add to android/app/build.gradle dependencies:

   ```gradle
   implementation project(':@rnmapbox_maps')
   ```

3. Update MainApplication.java to manually add package:
   ```java
   import com.mapbox.rctmgl.RCTMGLPackage;
   // In getPackages method:
   packages.add(new RCTMGLPackage());
   ```

### iOS

1. Add to ios/Podfile:

   ```ruby
   pod 'rnmapbox-maps', :path => '../node_modules/@rnmapbox/maps'
   ```

2. Run `pod install` from ios directory
