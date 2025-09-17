const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'geojson'],
    assetExts: ['geojson', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'css'],
    extraNodeModules: {
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
    },
    resolverMainFields: ['react-native', 'main', 'browser'],
  },
  transformer: {
    babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
    // Removed reference to expo-asset as it's not installed
  },
  watchFolders: [
    path.resolve(__dirname, 'node_modules'),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
