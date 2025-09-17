module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    '@babel/preset-typescript',
  ],
  plugins: [
    'react-native-worklets/plugin',
    // Add a plugin to ignore CSS imports
    ['module-resolver', {
      root: ['./'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        // Mock specific CSS files
        'mapbox-gl/dist/mapbox-gl.css': './mocks/mapboxGlCssMock.js'
      }
    }]
  ],
};
