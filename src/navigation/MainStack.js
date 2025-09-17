// src/navigation/MainStack.js
import React from 'react';
import { View, Text } from 'react-native';
// Import our simple stack navigator instead of the native one
import SimpleStackNavigator from '../components/SimpleStackNavigator';
import HomeScreen from '../screens/Home/HomeScreen';
import MapScreen from '../screens/Home/MapScreen';
import PanicButtonScreen from '../screens/Home/PanicButtonScreen';
import TouristProfileScreen from '../screens/Profile/TouristProfileScreen';

// Use our simple stack instead
const Stack = SimpleStackNavigator;

// Wrap the component in a try/catch
const SafeScreenRenderer = ({ component: Component, ...props }) => {
  try {
    return <Component {...props} />;
  } catch (error) {
    console.error('Error rendering screen:', error);
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Screen Error</Text>
        <Text style={{marginBottom: 10, textAlign: 'center'}}>{error.message}</Text>
      </View>
    );
  }
};

export default function MainStack() {
  // Use our simplified stack navigator with minimal options
  return (
    <Stack initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Smart Tourist',
        }}
      />
      <Stack.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          title: 'Tourist Map',
        }}
      />
      <Stack.Screen 
        name="PanicButton" 
        component={PanicButtonScreen}
        options={{
          title: 'Emergency',
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={TouristProfileScreen}
        options={{
          title: 'My Profile',
        }}
      />
    </Stack>
  );
}
