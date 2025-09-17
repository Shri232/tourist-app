// src/navigation/AuthStack.js
import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TouristRegistration from '../screens/Auth/TouristRegistration';

// Create the stack outside of the component to avoid recreation on re-renders
const Stack = createNativeStackNavigator();

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
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        // Force key navigation style for React Navigation 7 compatibility
        animation: 'default',
      }}
    >
      <Stack.Screen 
        name="Register"
        // Use render callback instead of component prop for safety
        children={props => <SafeScreenRenderer component={TouristRegistration} {...props} />}
        options={{
          freezeOnBlur: true,
        }}
      />
    </Stack.Navigator>
  );
}
