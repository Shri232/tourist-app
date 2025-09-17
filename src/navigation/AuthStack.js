// src/navigation/AuthStack.js
import React from 'react';
import { View, Text } from 'react-native';
// Import our simple stack navigator instead of the native one
import SimpleStackNavigator from '../components/SimpleStackNavigator';
import TouristRegistration from '../screens/Auth/TouristRegistration';

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

export default function AuthStack() {
  // Use our simplified stack navigator
  return (
    <Stack initialRouteName="Register">
      <Stack.Screen 
        name="Register"
        component={TouristRegistration}
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
