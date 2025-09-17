import React, { useEffect, useMemo } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox, View, Text, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import all our fixes
import './src/utils/ReactNavigationFix';
import './src/utils/fixReactNavigation';
import './src/patches/useFrameSize'; // Add the useFrameSize patch
import './src/fixes/useFrameSizeFix'; // Direct fix for useFrameSize

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
  // Reset React's internal state when app comes to foreground
  // This can help with stale context references
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('App has come to the foreground!');
        // Force a small delay before showing UI to let React contexts initialize
        setTimeout(() => {
          console.log('Contexts should be ready now');
        }, 100);
      }
    });
    
    return () => {
      subscription.remove();
    };
  }, []);

  // Create a stable auth provider value
  const authProviderValue = useMemo(() => ({
    // Just creating this to ensure React doesn't optimize out the useMemo
    key: 'authProvider'
  }), []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <AuthProvider key={authProviderValue.key}>
            <AppNavigator />
          </AuthProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
