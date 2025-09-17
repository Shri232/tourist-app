// src/navigation/MainStack.js
import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import MapScreen from '../screens/Home/MapScreen';
import PanicButtonScreen from '../screens/Home/PanicButtonScreen';
import TouristProfileScreen from '../screens/Profile/TouristProfileScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563EB',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Smart Tourist',
          headerStyle: {
            backgroundColor: '#2563EB',
          },
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
          headerStyle: {
            backgroundColor: '#EF4444',
          },
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={TouristProfileScreen}
        options={{
          title: 'My Profile',
        }}
      />
    </Stack.Navigator>
  );
}
