import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox, View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Suppress warnings from React Navigation 7
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'Non-serializable values were found in the navigation state',
  '[react-native-gesture-handler]',
  'ReactNavigation.NavigationContainer: Deprecation warning',
  // Add any other warnings you want to suppress
]);

// Error boundary to catch and display navigation errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Navigation Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Something went wrong with navigation
          </Text>
          <Text style={{ marginBottom: 20, textAlign: 'center' }}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
          <Text onPress={() => this.setState({ hasError: false })} 
                style={{ color: 'blue', padding: 10 }}>
            Try Again
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
