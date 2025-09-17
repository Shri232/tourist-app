/**
 * Simple Stack Navigator
 * 
 * This is a simplified stack navigator that doesn't rely on the problematic native-stack components
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';

// A simple stack navigator that doesn't use the problematic native-stack
export default function SimpleStackNavigator({ children, initialRouteName }) {
  // Track the current route name
  const [currentRoute, setCurrentRoute] = useState(initialRouteName);
  
  // Convert children to an array and build a map of screens
  const screens = React.Children.toArray(children).reduce((acc, child) => {
    // Only process Screen components
    if (child.type.name === 'Screen') {
      const { name, component, options, children } = child.props;
      
      acc[name] = {
        component,
        options,
        children
      };
    }
    return acc;
  }, {});
  
  // Create a navigation object for the screens
  const navigation = {
    navigate: (routeName, params = {}) => {
      if (screens[routeName]) {
        setCurrentRoute(routeName);
      }
    },
    goBack: () => {
      // This would need to maintain a history stack to work properly
      console.log('goBack not fully implemented in SimpleStackNavigator');
    },
    setOptions: (options) => {
      // This would need state management to implement properly
      console.log('setOptions not implemented in SimpleStackNavigator');
    }
  };
  
  // Render the current screen
  const CurrentScreen = screens[currentRoute]?.component || (() => null);
  const options = screens[currentRoute]?.options || {};
  
  // Default header shown unless specifically disabled
  const headerShown = options.headerShown !== false;
  const headerTitle = options.title || currentRoute;
  const headerStyle = options.headerStyle || { backgroundColor: '#2563EB' };
  const headerTintColor = options.headerTintColor || '#FFFFFF';
  
  return (
    <SafeAreaView style={styles.container}>
      {headerShown && (
        <View style={[styles.header, headerStyle]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, { color: headerTintColor }]}>←</Text>
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: headerTintColor }]}>
            {headerTitle}
          </Text>
          
          <View style={styles.headerRight} />
        </View>
      )}
      
      <View style={styles.screenContainer}>
        <CurrentScreen navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

// Screen component for use with SimpleStackNavigator
SimpleStackNavigator.Screen = function Screen({ name, component, options, children }) {
  // This is just a placeholder component for configuration
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#2563EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  screenContainer: {
    flex: 1,
  },
});